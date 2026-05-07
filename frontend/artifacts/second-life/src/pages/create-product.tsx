import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  createProduct,
  uploadProductImages,
  getCategories,
  CategoryData,
} from "@/lib/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export default function CreateProductPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    rentalPricePerDay: string;
    condition: string;
    location: string;
    listingType: string;
    categoryId: string;
  }>({
    title: "",
    description: "",
    price: "",
    rentalPricePerDay: "",
    condition: "Like New",
    location: "Hà Nội",
    listingType: "SELL", // Mặc định là bán
    categoryId: "1", // Mặc định danh mục đầu tiên
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    // Tự động load danh sách danh mục khi trang render
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          // Gán mặc định danh mục đầu tiên nếu danh sách không rỗng
          setFormData((prev) => ({ ...prev, categoryId: String(data[0].id) }));
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách Category", err);
      }
    };
    loadCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    let { name, value } = e.target;

    // Nếu chọn thay đổi loại hình đăng tin thì reset giá trị bị ẩn
    if (name === "listingType") {
      setFormData((prev) => ({
        ...prev,
        listingType: value,
        // Reset về chuỗi rỗng:
        ...(value === "RENT" ? { price: "" } : {}),
        ...(value === "SELL" ? { rentalPricePerDay: "" } : {}),
      }));
      return;
    }

    if (name === "price" || name === "rentalPricePerDay") {
      // Chỉ giữ lại số
      value = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm chuyển đổi string "1000000" -> "1.000.000"
  const formatCurrency = (val: string) => {
    if (!val) return "";
    return new Intl.NumberFormat("vi-VN").format(Number(val));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Logic để kiểm tra trước (tránh gọi API thừa)
      if (
        formData.listingType === "SELL" ||
        formData.listingType === "SELL_AND_RENT"
      ) {
        if (!formData.price || Number(formData.price) <= 0) {
          setError("Vui lòng nhập giá bán lớn hơn 0");
          setLoading(false);
          return;
        }
      }
      if (
        formData.listingType === "RENT" ||
        formData.listingType === "SELL_AND_RENT"
      ) {
        if (
          !formData.rentalPricePerDay ||
          Number(formData.rentalPricePerDay) <= 0
        ) {
          setError("Vui lòng nhập giá thuê mỗi ngày lớn hơn 0");
          setLoading(false);
          return;
        }
      }

      // 1. Tạo dữ liệu Product (chữ, chưa có ảnh)
      // LƯU Ý: Thay sellerId bằng ID người bán thật đang đăng nhập từ Session/Zustand store của bạn
      const productPayload = {
        title: formData.title,
        description: formData.description,
        listingType: formData.listingType,
        price:
          formData.listingType === "RENT"
            ? undefined
            : Number(formData.price) || 0,
        rentalPricePerDay:
          formData.listingType === "SELL"
            ? undefined
            : Number(formData.rentalPricePerDay) || 0,
        condition: formData.condition,
        location: formData.location,
        categoryId: Number(formData.categoryId),
        sellerId: 1, // <--- Thay ID người dùng thật ở đây
      };

      const productResponse = await createProduct(productPayload);
      const newProductId = productResponse.id;

      // 2. Upload ảnh (cập nhật id vào product)
      if (selectedFiles && selectedFiles.length > 0) {
        await uploadProductImages(newProductId, selectedFiles);
      }

      alert("Tạo sản phẩm và upload ảnh thành công!");
      setLocation(`/san-pham/${newProductId}`); // Redirect tới trang chi tiết
    } catch (err: any) {
      setError(err.message || "Tạo sản phẩm thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Đăng bán sản phẩm mới</h1>

      {error && (
        <div className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên sản phẩm *
          </label>
          <Input
            required
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="VD: Áo khoác mùa đông"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả *</label>
          <Textarea
            required
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Mô tả tình trạng, xuất xứ..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Loại hình kinh doanh *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="listingType"
                value="SELL"
                checked={formData.listingType === "SELL"}
                onChange={handleInputChange}
              />
              Chỉ bán
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="listingType"
                value="RENT"
                checked={formData.listingType === "RENT"}
                onChange={handleInputChange}
              />
              Chỉ cho thuê
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="listingType"
                value="SELL_AND_RENT"
                checked={formData.listingType === "SELL_AND_RENT"}
                onChange={handleInputChange}
              />
              Cả bán và cho thuê
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(formData.listingType === "SELL" ||
            formData.listingType === "SELL_AND_RENT") && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Giá bán (VNĐ) *
              </label>
              <Input
                required
                type="text"
                name="price"
                value={formatCurrency(formData.price)}
                onChange={handleInputChange}
              />
            </div>
          )}
          {(formData.listingType === "RENT" ||
            formData.listingType === "SELL_AND_RENT") && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Giá thuê / ngày (VNĐ) *
              </label>
              <Input
                required
                type="text"
                name="rentalPricePerDay"
                value={formatCurrency(formData.rentalPricePerDay)}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tình trạng</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            >
              <option value="New 100%">Mới 100%</option>
              <option value="Like New">Like New</option>
              <option value="Used">Đã sử dụng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa điểm</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            >
              {PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Danh mục *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Chọn ảnh sản phẩm
          </label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">Chọn 1 hoặc nhiều ảnh</p>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Đang xử lý..." : "Tạo Sản Phẩm"}
        </Button>
      </form>
    </div>
  );
}
