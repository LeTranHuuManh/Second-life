import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchProducts,
  getUserProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  type UpdateProductData,
} from "@/lib/product";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type ListingType = "all" | "buy" | "rent" | "both";
export type SortOption = "default" | "price_asc" | "price_desc" | "distance";

export interface ProductFilters {
  listing_type?: ListingType;
  category?: string;
  query?: string;
  province?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  /** @deprecated use listing_type */
  type?: string;
}

export interface ProductsPageResult {
  items: Product[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

type SearchProduct = Product & {
  categoryId?: number;
  listingType?: string;
};

const normalizeNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const mapListingType = (listingType?: string): Product["type"] => {
  if (listingType === "SELL") return "buy";
  if (listingType === "RENT") return "rent";
  return "both";
};

export function useProducts(filters?: ProductFilters) {
  const page = filters?.page ?? 0;
  const size = filters?.size ?? 20;

  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      try {
        const response = await searchProducts({
          q: filters?.query,
          categoryId: filters?.category ? Number(filters.category) : undefined,
          listingType: filters?.listing_type,
          province: filters?.province,
          minPrice: filters?.minPrice,
          maxPrice: filters?.maxPrice,
          sort: filters?.sort,
          page,
          size,
        });

        const items: SearchProduct[] = (response.content || []).map(
          (p: any) => {
            const images =
              Array.isArray(p.images) && p.images.length > 0
                ? p.images
                : ["/images/placeholder.png"];

            return {
              id: String(p.id),
              name: p.title,
              description: p.description || "",
              category: p.categoryId ? String(p.categoryId) : "",
              type: mapListingType(p.listingType),
              buyPrice: normalizeNumber(p.price),
              rentPricePerDay: normalizeNumber(p.rentalPricePerDay),
              aiSuggestedBuyPrice: undefined,
              aiSuggestedRentPrice: undefined,
              images,
              stocks: 1,
              status: p.status === "AVAILABLE" ? "available" : "sold",
              shop: {
                id: String(p.sellerId ?? ""),
                name: p.sellerId ? `Shop ${p.sellerId}` : "Shop",
                avatar: "https://i.pravatar.cc/150?img=11",
                address: "",
                joinedAt: "",
                totalOrders: 0,
                rating: 0,
              },
              location: p.location || "",
              rating: 0,
              reviewsCount: 0,
              reviews: [],
              categoryId: p.categoryId,
              listingType: p.listingType,
            } as SearchProduct;
          },
        );
        return {
          items,
          totalPages: response.totalPages ?? response.page?.totalPages ?? 1,
          totalElements:
            response.totalElements ??
            response.page?.totalElements ??
            items.length,
          pageNumber: response.number ?? response.page?.number ?? page,
          pageSize: response.size ?? response.page?.size ?? size,
        } as ProductsPageResult;
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm từ API:", error);
        // Fallback về mock data nếu API bị lỗi
        return {
          items: MOCK_PRODUCTS,
          totalPages: 1,
          totalElements: MOCK_PRODUCTS.length,
          pageNumber: 0,
          pageSize: MOCK_PRODUCTS.length,
        } as ProductsPageResult;
      }
    },
  });
}

/**
 * Hook để lấy danh sách sản phẩm của người dùng (quản lý bán hàng)
 */
export function useUserProducts(
  userId: number,
  filters?: { page?: number; size?: number },
) {
  const page = filters?.page ?? 0;
  const size = filters?.size ?? 20;

  return useQuery({
    queryKey: ["userProducts", userId, page, size],
    queryFn: async () => {
      try {
        const response = await getUserProducts(userId, page, size);
        return response.content || [];
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm của người dùng:", error);
        return [];
      }
    },
  });
}

export function useUpdateUserProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      data,
    }: {
      productId: number;
      data: UpdateProductData;
    }) => {
      return updateProduct(productId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
    },
  });
}

export function useDeleteUserProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      return deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      try {
        const product = await getProductById(id);
        // Map response từ backend sang format giao diện của bạn
        return {
          ...product,
          name: product.title,
          buyPrice: product.price ? Number(product.price) : 0,
          rentPricePerDay: product.rentalPricePerDay
            ? Number(product.rentalPricePerDay)
            : 0,
          type:
            product.listingType === "SELL"
              ? "buy"
              : product.listingType === "RENT"
                ? "rent"
                : "both",
          stocks: product.stocks ?? 1,
          images:
            product.images && product.images.length > 0
              ? product.images
              : ["/images/placeholder.png"],
          shop: {
            id: String(product.seller?.id || product.sellerId),
            name:
              product.seller?.fullName ||
              `Seller ${product.seller?.id || product.sellerId}`,
            avatar:
              product.seller?.avatarUrl || "https://i.pravatar.cc/150?img=11",
            address: product.seller?.address || "",
            joinedAt: product.seller?.joinedAt || "",
            totalOrders: product.seller?.totalOrders || 0,
            rating: product.seller?.rating ? Number(product.seller.rating) : 0,
          },
          status: product.status === "AVAILABLE" ? "available" : "sold",
          rating: 0,
          reviewsCount: 0,
          reviews: [],
        };
      } catch (error) {
        console.error(`Lỗi khi lấy chi tiết sản phẩm ${id}:`, error);
        // Fallback về mock data nếu muốn test
        const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
        if (!mockProduct) throw new Error("Product not found");
        return mockProduct;
      }
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      await delay(1000);
      return { id: "p-new", ...data } as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
