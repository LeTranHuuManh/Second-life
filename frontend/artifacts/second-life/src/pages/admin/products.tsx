import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Ban, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function AdminProducts() {
  const products = MOCK_PRODUCTS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sản phẩm Nền tảng
          </h1>
          <p className="text-muted-foreground mt-1">
            Duyệt sản phẩm mới và kiểm tra trạng thái Mua Bán / Cho Thuê.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 bg-card p-2 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-8 bg-background border-none shadow-none focus-visible:ring-0"
          />
        </div>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          Lọc
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Tên Sản phẩm</TableHead>
              <TableHead>Loại hình</TableHead>
              <TableHead>Giá đề xuất</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Tác vụ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 10).map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-[200px]">
                      <span className="font-semibold text-sm truncate">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.type === "buy" ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      Bán
                    </Badge>
                  ) : product.type === "rent" ? (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                    >
                      Cho thuê
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      Bán & Cho thuê
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {product.buyPrice
                    ? `${product.buyPrice.toLocaleString("vi-VN")}đ`
                    : `${product.rentPricePerDay?.toLocaleString("vi-VN")}đ / ngày`}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-orange-50 text-orange-700"
                  >
                    Chờ xét duyệt
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                    >
                      <CheckCircle className="mr-1 h-3.5 w-3.5" /> Duyệt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Ban className="mr-1 h-3.5 w-3.5" /> Từ chối
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
