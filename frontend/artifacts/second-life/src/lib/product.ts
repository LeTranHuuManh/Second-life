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
  sellerId: number;
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

export interface CategoryData {
  id: number;
  name: string;
  icon?: string;
  parentId?: number;
}

/**
 * Lấy danh sách danh mục (categories) từ Backend
 */
export const getCategories = async (): Promise<CategoryData[]> => {
  return await apiFetch("/categories", {
    method: "GET",
  });
};

export interface ProductsPageData {
  content: any[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
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
