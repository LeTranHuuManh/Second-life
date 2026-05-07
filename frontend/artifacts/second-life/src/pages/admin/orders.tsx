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
import { MOCK_ADMIN_DASHBOARD_STATS } from "@/lib/mock-data";
import { Eye, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Đơn hàng & Giao dịch PayOS
          </h1>
          <p className="text-muted-foreground mt-1">
            Giám sát các đơn mua/cho thuê và dòng tiền cọc giao dịch.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            Đang Vận Chuyển
          </h3>
          <p className="text-sm text-muted-foreground">Có 34 đơn</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            Đang Cho Thuê (Active)
          </h3>
          <p className="text-sm text-muted-foreground">
            Có 12 đơn cần quản lý lịch
          </p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            Giao dịch chờ cọc
          </h3>
          <p className="text-sm text-muted-foreground">2 Đơn cần xử lý</p>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Giao dịch mới nhất</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Mã Đơn</TableHead>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Hình thức</TableHead>
              <TableHead>Sự kiện PayOS</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">#ORD-{9403 + i}</TableCell>
                <TableCell>
                  <div className="font-medium text-sm">Tran Thi B</div>
                  <div className="text-xs text-muted-foreground">
                    tranthib@...
                  </div>
                </TableCell>
                <TableCell>
                  {(Math.random() * 2000000 + 500000)
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  đ
                  {i % 2 === 0 && (
                    <span className="block text-xs text-muted-foreground">
                      (Có tiền cọc)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {i % 2 === 0 ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      Mua đứt
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700"
                    >
                      Cho thuê
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="border-green-300 text-green-700 bg-green-50"
                      >
                        Đã thanh toán (Success)
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Mã GD: #POS_2920{i}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
