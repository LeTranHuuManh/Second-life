import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_AI_LOGS } from "@/lib/mock-data";
import { Eye, TrendingUp, TrendingDown, AlignJustify } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminAILogs() {
  const logs = MOCK_AI_LOGS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Gợi Ý Giá</h1>
          <p className="text-muted-foreground mt-1">
            Lịch sử định giá sản phẩm bởi trợ lý AI khi user đăng bài.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt Định Giá AI Hôm Nay
            </CardTitle>
            <AlignJustify className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+30% so với hôm qua</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Sản Phẩm</TableHead>
              <TableHead>Người Yêu Cầu</TableHead>
              <TableHead className="text-right">Giá AI Gợi Ý (VND)</TableHead>
              <TableHead className="text-right">Giá User Đặt (VND)</TableHead>
              <TableHead className="text-center">Chênh Lệch</TableHead>
              <TableHead className="text-center">Trạng Thái Gọi API</TableHead>
              <TableHead className="text-right">Thời Gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => {
              const diff =
                ((log.userFinalPrice - log.suggestedPrice) /
                  log.suggestedPrice) *
                100;
              const isHigher = log.userFinalPrice > log.suggestedPrice;
              const isEqual = log.userFinalPrice === log.suggestedPrice;

              return (
                <TableRow key={log.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium text-sm">
                    {log.productName}
                    <span className="block text-xs font-normal text-muted-foreground">
                      ID: #{log.productId}
                    </span>
                  </TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {log.suggestedPrice > 0
                      ? log.suggestedPrice.toLocaleString("vi-VN")
                      : "---"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground border-l border-r border-dashed">
                    {log.userFinalPrice > 0
                      ? log.userFinalPrice.toLocaleString("vi-VN")
                      : "---"}
                  </TableCell>
                  <TableCell className="text-center">
                    {log.status === "success" && log.userFinalPrice > 0 ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center justify-center gap-1">
                            {isEqual ? (
                              <Badge
                                variant="outline"
                                className="text-gray-500"
                              >
                                Bằng giá
                              </Badge>
                            ) : isHigher ? (
                              <Badge
                                variant="outline"
                                className="text-blue-600 bg-blue-50 border-blue-200"
                              >
                                <TrendingUp className="mr-1 h-3 w-3" /> +
                                {diff.toFixed(1)}%
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-orange-600 bg-orange-50 border-orange-200"
                              >
                                <TrendingDown className="mr-1 h-3 w-3" />{" "}
                                {diff.toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Mức độ chệch so với AI đánh giá
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {log.status === "success" ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Thành công
                      </Badge>
                    ) : log.status === "failed" ? (
                      <Badge variant="destructive">Lỗi Model</Badge>
                    ) : (
                      <Badge variant="secondary">Đang xử lý</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
