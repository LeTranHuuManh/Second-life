import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAvailableProducts,
  getUserProducts,
  getProductById,
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
  page?: number;
  size?: number;
  /** @deprecated use listing_type */
  type?: string;
}

export function useProducts(filters?: ProductFilters) {
  const page = filters?.page ?? 0;
  const size = filters?.size ?? 20;

  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      try {
        // Gọi API từ backend để lấy sản phẩm có phân trang
        const response = await getAvailableProducts(page, size);
        let result = response.content || [];

        // Áp dụng filter ở phía client
        // listing_type filter (new canonical field)
        const lt =
          filters?.listing_type ?? (filters?.type as ListingType) ?? "all";
        if (lt === "buy") {
          result = result.filter(
            (p) =>
              p.listingType === "SELL" || p.listingType === "SELL_AND_RENT",
          );
        } else if (lt === "rent") {
          result = result.filter(
            (p) =>
              p.listingType === "RENT" || p.listingType === "SELL_AND_RENT",
          );
        } else if (lt === "both") {
          result = result.filter((p) => p.listingType === "SELL_AND_RENT");
        }

        // Category
        if (filters?.category) {
          result = result.filter(
            (p) => p.categoryId === Number(filters.category),
          );
        }

        // Province / location
        if (filters?.province) {
          result = result.filter((p) =>
            p.location.toLowerCase().includes(filters.province!.toLowerCase()),
          );
        }

        // Text query
        if (filters?.query) {
          const q = filters.query.toLowerCase();
          result = result.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q),
          );
        }

        // Sort
        const sort = filters?.sort ?? "default";
        if (sort === "price_asc") {
          result.sort((a, b) => {
            const pa = Math.min(
              a.price?.toNumber() ?? Infinity,
              a.rentalPricePerDay?.toNumber() ?? Infinity,
            );
            const pb = Math.min(
              b.price?.toNumber() ?? Infinity,
              b.rentalPricePerDay?.toNumber() ?? Infinity,
            );
            return pa - pb;
          });
        } else if (sort === "price_desc") {
          result.sort((a, b) => {
            const pa = Math.max(
              a.price?.toNumber() ?? 0,
              a.rentalPricePerDay?.toNumber() ?? 0,
            );
            const pb = Math.max(
              b.price?.toNumber() ?? 0,
              b.rentalPricePerDay?.toNumber() ?? 0,
            );
            return pb - pa;
          });
        } else if (sort === "distance") {
          result.sort((a, b) => a.location.localeCompare(b.location));
        }

        return result;
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm từ API:", error);
        // Fallback về mock data nếu API bị lỗi
        return MOCK_PRODUCTS;
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
          stock: 1,
          images:
            product.images && product.images.length > 0
              ? product.images
              : ["/images/placeholder.png"],
          shop: {
            id: String(product.sellerId),
            name: `Seller ${product.sellerId}`,
            avatar: "https://i.pravatar.cc/150?img=11",
            address: product.location || "TP. Hồ Chí Minh",
            joinedAt: "2023-01-15T00:00:00Z",
            totalOrders: 10,
            rating: 5,
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
