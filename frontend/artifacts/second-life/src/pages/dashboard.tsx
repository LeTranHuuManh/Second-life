import React, { useState } from "react";
import { Link } from "wouter";
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
import { useUserProducts } from "@/hooks/use-products";
import { useDashboardStats } from "@/hooks/use-dashboard";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { SellerRegistration } from "@/components/seller-registration";

const data = [
  { name: "T1", revenue: 4000 },
  { name: "T2", revenue: 3000 },
  { name: "T3", revenue: 5000 },
  { name: "T4", revenue: 2780 },
  { name: "T5", revenue: 8890 },
  { name: "T6", revenue: 6390 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
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

  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();

  const revString = stats?.revenue?.toLocaleString("vi-VN") || "0";
  const finalChartData = stats?.chartData?.length ? stats.chartData : data;

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
              <h3 className="text-2xl font-bold">{stats?.newOrders || 0}</h3>
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={finalChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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

      {/* Product List */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold font-display text-lg">
            Sản phẩm đang đăng ({userProducts.length})
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
                  <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0">
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
                <Link href={`/san-pham/${product.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex-shrink-0"
                  >
                    Xem
                  </Button>
                </Link>
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
    </div>
  );
}
