import { apiFetch } from "./api";

export interface CreateProductData {
  title: string;
  description: string;
  price?: number;
  rentalPricePerDay?: number;
  condition: string;
  location: string;
  listingType: string; // "SELL", "RENT", "SELL_AND_RENT"
  categoryId: number;
  images?: string[];
}

export interface UpdateProductData {
  title: string;
  description: string;
  price?: number;
  rentalPricePerDay?: number;
  condition: string;
  location: string;
  listingType: string; // "SELL", "RENT", "SELL_AND_RENT"
  categoryId: number;
  images?: string[];
}

/**
 * API Tạo sản phẩm mới
 */
export const createProduct = async (data: CreateProductData) => {
  return await apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * API Cap nhat san pham
 */
export const updateProduct = async (
  productId: number,
  data: UpdateProductData,
) => {
  return await apiFetch(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * API Xoa san pham
 */
export const deleteProduct = async (productId: number) => {
  return await apiFetch(`/products/${productId}`, {
    method: "DELETE",
  });
};

/**
 * API Upload ảnh cho sản phẩm đã tạo
 */
export const uploadProductImages = async (
  productId: number,
  files: FileList | File[],
) => {
  const formData = new FormData();

  // Nén các ảnh vào formData, sử dụng name="files" cho array
  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  return await apiFetch(`/products/${productId}/images`, {
    method: "POST",
    body: formData,
    // KHÔNG TỰ KHAI BÁO Content-Type, trình duyệt sẽ tự động thêm multipart/form-data kèm boundary
  });
};

export interface ProductsPageData {
  content: any[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
  totalPages?: number;
  totalElements?: number;
  number?: number;
  size?: number;
}

/**
 * Lấy danh sách sản phẩm cho trang chủ (phân trang)
 * @param page - Số trang (0-indexed)
 * @param size - Số sản phẩm trên mỗi trang
 */
export const getAvailableProducts = async (
  page: number = 0,
  size: number = 20,
): Promise<ProductsPageData> => {
  return await apiFetch(`/products?page=${page}&size=${size}`, {
    method: "GET",
  });
};

export interface ProductSearchParams {
  q?: string;
  categoryId?: number;
  listingType?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
}

export const searchProducts = async (
  params: ProductSearchParams,
): Promise<ProductsPageData> => {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.categoryId !== undefined) {
    searchParams.set("categoryId", String(params.categoryId));
  }
  if (params.listingType) searchParams.set("listingType", params.listingType);
  if (params.province) searchParams.set("province", params.province);
  if (params.minPrice !== undefined) {
    searchParams.set("minPrice", String(params.minPrice));
  }
  if (params.maxPrice !== undefined) {
    searchParams.set("maxPrice", String(params.maxPrice));
  }
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/products/search?${queryString}`
    : "/products/search";

  return await apiFetch(endpoint, {
    method: "GET",
  });
};

/**
 * Lấy danh sách sản phẩm của người dùng - Quản lý bán hàng (phân trang)
 * @param userId - ID của người dùng/người bán
 * @param page - Số trang (0-indexed)
 * @param size - Số sản phẩm trên mỗi trang
 */
export const getUserProducts = async (
  userId: number,
  page: number = 0,
  size: number = 20,
): Promise<ProductsPageData> => {
  return await apiFetch(`/products/user/${userId}?page=${page}&size=${size}`, {
    method: "GET",
  });
};

/**
 * Lấy thông tin chi tiết của một sản phẩm
 * @param id - ID của sản phẩm
 */
export const getProductById = async (id: string | number) => {
  return await apiFetch(`/products/${id}`, {
    method: "GET",
  });
};
