import React, { useState } from "react";
import { Link } from "wouter";
import {
  useUpdateSellerOrderStatus,
  useSellerOrders,
  type SellerOrderStatus,
} from "@/hooks/use-seller-orders";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/lib/context";
import {
  useDeleteUserProduct,
  useUpdateUserProduct,
  useUserProducts,
} from "@/hooks/use-products";
import { uploadProductImages } from "@/lib/product";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useCategories } from "@/hooks/use-categories";
import {
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  Clock,
  Settings2,
  Truck,
  CheckCircle2,
  PackageCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SellerRegistration } from "@/components/seller-registration";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const data = [
  { name: "T1", revenue: 4000 },
  { name: "T2", revenue: 3000 },
  { name: "T3", revenue: 5000 },
  { name: "T4", revenue: 2780 },
  { name: "T5", revenue: 8890 },
  { name: "T6", revenue: 6390 },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Chờ duyệt",
    color: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-700",
    icon: <Settings2 className="w-3.5 h-3.5" />,
  },
  SHIPPING: {
    label: "Đang giao",
    color: "bg-violet-100 text-violet-700",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  DELIVERED: {
    label: "Chờ nhận hàng",
    color: "bg-orange-100 text-orange-700",
    icon: <PackageCheck className="w-3.5 h-3.5" />,
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

const ORDER_STATUS_OPTIONS: SellerOrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPING",
  "DELIVERED",
  "COMPLETED",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [statusSelections, setStatusSelections] = useState<
    Record<number, SellerOrderStatus>
  >({});
  const [editOpen, setEditOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [editError, setEditError] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    rentalPricePerDay: "",
    condition: "Like New",
    location: "",
    listingType: "SELL",
    categoryId: "",
  });

  const userIdNumber = user?.id
    ? typeof user.id === "string"
      ? parseInt(user.id)
      : user.id
    : 1;

  const { data: userProducts = [], isLoading: isLoadingProducts } =
    useUserProducts(userIdNumber, {
      page,
      size: 10,
    });
  const { data: categories = [] } = useCategories();
  const updateUserProductMutation = useUpdateUserProduct();
  const deleteUserProductMutation = useDeleteUserProduct();

  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();

  const { data: sellerOrdersData, isLoading: isLoadingOrders } =
    useSellerOrders();
  const updateOrderStatusMutation = useUpdateSellerOrderStatus();

  const sellerOrders = sellerOrdersData || [];

  const revString = stats?.revenue?.toLocaleString("vi-VN") || "0";
  const finalChartData = stats?.chartData?.length ? stats.chartData : data;

  const openEditModal = (product: any) => {
    setEditError("");
    setEditProductId(Number(product.id));
    setExistingImages(product.images || []);
    setEditSelectedFiles([]);
    setEditForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price ? String(product.price) : "",
      rentalPricePerDay: product.rentalPricePerDay
        ? String(product.rentalPricePerDay)
        : "",
      condition: product.condition || "Like New",
      location: product.location || "",
      listingType: product.listingType || "SELL",
      categoryId: product.categoryId ? String(product.categoryId) : "",
    });
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (!editProductId) return;

    if (!editForm.title.trim() || !editForm.description.trim()) {
      setEditError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (!editForm.categoryId) {
      setEditError("Vui lòng chọn danh mục");
      return;
    }

    if (
      (editForm.listingType === "SELL" ||
        editForm.listingType === "SELL_AND_RENT") &&
      (!editForm.price || Number(editForm.price) <= 0)
    ) {
      setEditError("Vui lòng nhập giá bán hợp lệ");
      return;
    }

    if (
      (editForm.listingType === "RENT" ||
        editForm.listingType === "SELL_AND_RENT") &&
      (!editForm.rentalPricePerDay || Number(editForm.rentalPricePerDay) <= 0)
    ) {
      setEditError("Vui lòng nhập giá thuê hợp lệ");
      return;
    }

    updateUserProductMutation.mutate(
      {
        productId: editProductId,
        data: {
          title: editForm.title,
          description: editForm.description,
          listingType: editForm.listingType,
          price:
            editForm.listingType === "RENT"
              ? undefined
              : Number(editForm.price) || 0,
          rentalPricePerDay:
            editForm.listingType === "SELL"
              ? undefined
              : Number(editForm.rentalPricePerDay) || 0,
          condition: editForm.condition,
          location: editForm.location,
          categoryId: Number(editForm.categoryId),
          images: existingImages,
        },
      },
      {
        onSuccess: async () => {
          if (editSelectedFiles.length > 0) {
            try {
              await uploadProductImages(editProductId, editSelectedFiles);
            } catch (err) {
              console.error("Upload images failed", err);
            }
          }
          setEditOpen(false);
          // Invalidate user products should already be handled in the hook, but upload may be slightly delayed.
          // Wait briefly
          setTimeout(() => {
            // Forcing a minor refresh can be done if necessary, but mutation onSuccess does it.
          }, 500);
        },
      },
    );
  };

  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteProduct = (productId: number) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
      return;
    }
    deleteUserProductMutation.mutate(productId);
  };

  // Chặn user bình thường không cho thấy Dashboard bán hàng
  if (user?.role === "USER") {
    return (
      <div className="container mx-auto px-4 py-12">
        <SellerRegistration />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Quản lý bán hàng</h1>
          <p className="text-muted-foreground mt-1">
            Chào mừng trở lại, {user?.name || "Shop"}
          </p>
        </div>
        <Link href="/dang-ban">
          <Button className="rounded-full shadow-colored font-bold px-6">
            <Plus className="w-4 h-4 mr-2" /> Đăng tin mới
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm của tôi</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng khách đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Doanh thu tháng
                  </p>
                  <h3 className="text-2xl font-bold">{revString}đ</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Đơn hàng mới
                  </p>
                  <h3 className="text-2xl font-bold">
                    {stats?.newOrders || 0}
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Lượt xem shop
                  </p>
                  <h3 className="text-2xl font-bold">{stats?.views || 0}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm mb-8">
            <h3 className="font-bold font-display text-lg mb-6">
              Biểu đồ doanh thu
            </h3>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={finalChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold font-display text-lg">
                Sản phẩm của tôi ({userProducts.length})
              </h3>
              <Link href="/dang-ban">
                <Button
                  className="rounded-full shadow-colored font-bold px-4"
                  size="sm"
                >
                  <Plus className="w-4 h-4" /> Đăng mới
                </Button>
              </Link>
            </div>

            {isLoadingProducts ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : userProducts.length > 0 ? (
              <div className="space-y-4">
                {userProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden shrink-0">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate">{product.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.listingType === "SELL" &&
                            `Bán: ${product.price?.toLocaleString("vi-VN")} đ`}
                          {product.listingType === "RENT" &&
                            `Thuê: ${product.rentalPricePerDay?.toLocaleString("vi-VN")} đ/ngày`}
                          {product.listingType === "SELL_AND_RENT" &&
                            `Bán: ${product.price?.toLocaleString("vi-VN")} đ • Thuê: ${product.rentalPricePerDay?.toLocaleString("vi-VN")} đ/ngày`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/san-pham/${product.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          Xem
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openEditModal(product)}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteProduct(Number(product.id))}
                        disabled={deleteUserProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Xoá
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Bạn chưa đăng sản phẩm nào
                </p>
                <Link href="/dang-ban">
                  <Button className="rounded-full shadow-colored font-bold">
                    <Plus className="w-4 h-4 mr-2" /> Đăng sản phẩm đầu tiên
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-w-lg rounded-3xl p-0 overflow-hidden">
              <DialogHeader className="px-6 pt-6 pb-0">
                <DialogTitle className="text-xl font-bold font-display">
                  Chỉnh sửa sản phẩm
                </DialogTitle>
              </DialogHeader>
              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {editError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {editError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tên sản phẩm
                  </label>
                  <Input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mô tả
                  </label>
                  <Textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Loại hình
                  </label>
                  <select
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={editForm.listingType}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        listingType: e.target.value,
                      }))
                    }
                  >
                    <option value="SELL">Chỉ bán</option>
                    <option value="RENT">Chỉ cho thuê</option>
                    <option value="SELL_AND_RENT">Cả bán và cho thuê</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(editForm.listingType === "SELL" ||
                    editForm.listingType === "SELL_AND_RENT") && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Giá bán (VNĐ)
                      </label>
                      <Input
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            price: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                      />
                    </div>
                  )}
                  {(editForm.listingType === "RENT" ||
                    editForm.listingType === "SELL_AND_RENT") && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Giá thuê / ngày (VNĐ)
                      </label>
                      <Input
                        value={editForm.rentalPricePerDay}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            rentalPricePerDay: e.target.value.replace(
                              /\D/g,
                              "",
                            ),
                          }))
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tình trạng
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      value={editForm.condition}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          condition: e.target.value,
                        }))
                      }
                    >
                      <option value="New 100%">Mới 100%</option>
                      <option value="Like New">Like New</option>
                      <option value="Used">Đã sử dụng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Địa điểm
                    </label>
                    <Input
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Danh mục
                  </label>
                  <select
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={editForm.categoryId}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
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
                    Ảnh sản phẩm
                  </label>
                  {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {existingImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-md overflow-hidden bg-muted"
                        >
                          <img
                            src={img}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Bạn có thể chọn thêm các ảnh mới. Các ảnh mới sẽ được thêm
                    vào danh sách.
                  </p>
                </div>
              </div>
              <DialogFooter className="px-6 pb-6 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => setEditOpen(false)}
                >
                  Huỷ
                </Button>
                <Button
                  className="flex-1 rounded-full font-bold"
                  onClick={handleEditSubmit}
                  disabled={updateUserProductMutation.isPending}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="orders">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="font-bold font-display text-lg mb-6">
              Đơn hàng cần xử lý
            </h3>
            <div className="space-y-4">
              {isLoadingOrders ? (
                <div className="text-center text-muted-foreground">
                  Đang tải...
                </div>
              ) : sellerOrders.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  Chưa có đơn hàng nào
                </div>
              ) : (
                sellerOrders.map((order: any) => {
                  const cfg =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  return (
                    <div
                      key={order.orderItemId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary/10 rounded-2xl border border-border/50 gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">
                            DH-{order.orderId} (Item: {order.orderItemId})
                          </span>
                          <Badge
                            className={`${cfg.color} border-0 text-xs flex items-center gap-1.5`}
                          >
                            {cfg.icon} {cfg.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {order.itemType === "BUY" ? "Mua" : "Thuê"}
                          </Badge>
                        </div>
                        <p className="font-bold">{order.productName}</p>
                        <p className="text-sm border-l-2 pl-2 border-primary/20 text-muted-foreground mt-2">
                          Khách:{" "}
                          <span className="font-medium text-foreground">
                            {order.customerName}
                          </span>
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <p className="font-bold text-primary">
                          {order.price?.toLocaleString("vi-VN")} đ
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                        <div className="flex items-center gap-2 w-full sm:w-auto mt-2">
                          <select
                            className="h-9 rounded-full border border-border bg-white px-3 text-xs"
                            value={
                              statusSelections[order.orderItemId] ??
                              order.status
                            }
                            onChange={(e) =>
                              setStatusSelections((prev) => ({
                                ...prev,
                                [order.orderItemId]: e.target
                                  .value as SellerOrderStatus,
                              }))
                            }
                          >
                            {ORDER_STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_CONFIG[status]?.label ?? status}
                              </option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            className="rounded-full font-bold"
                            onClick={() =>
                              updateOrderStatusMutation.mutate({
                                orderItemId: order.orderItemId,
                                status:
                                  statusSelections[order.orderItemId] ??
                                  order.status,
                              })
                            }
                            disabled={updateOrderStatusMutation.isPending}
                          >
                            Cập nhật
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
