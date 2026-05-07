import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, X, Building, MapPin, Phone } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSellerRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["seller-requests", page],
    queryFn: () =>
      apiFetch(`/seller-requests/admin/pending?page=${page}&size=20`),
  });

  const requests = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const reviewMutation = useMutation({
    mutationFn: (args: { id: number; status: string; adminNote?: string }) =>
      apiFetch(`/seller-requests/admin/${args.id}/review`, {
        method: "PUT",
        body: JSON.stringify({
          status: args.status,
          adminNote: args.adminNote,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-requests"] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái yêu cầu",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display">Duyệt Shop</h2>
          <p className="text-muted-foreground text-sm">
            Quản lý yêu cầu đăng ký đăng bán của người dùng
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Tên Shop</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Ngày gửi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Không có yêu cầu chờ duyệt
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request: any) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="font-medium">{request.userFullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {request.userEmail}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <span className="flex items-center text-primary font-medium">
                      <Building className="w-3 h-3 mr-1 inline" />
                      {request.shopName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                      {request.phone}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                      <MapPin className="w-3 h-3 mr-1" />
                      {request.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.createdAt
                      ? format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "PENDING" ? "secondary" : "default"
                      }
                    >
                      CHỜ DUYỆT
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                      onClick={() => {
                        if (
                          confirm(
                            `Chấp nhận quyền bán hàng cho ${request.userFullName}?`,
                          )
                        ) {
                          reviewMutation.mutate({
                            id: request.id,
                            status: "APPROVED",
                          });
                        }
                      }}
                      disabled={reviewMutation.isPending}
                    >
                      <Check className="w-4 h-4 mr-1" /> Duyệt
                    </Button>

                    <RejectDialog
                      requestId={request.id}
                      onReject={(note) =>
                        reviewMutation.mutate({
                          id: request.id,
                          status: "REJECTED",
                          adminNote: note,
                        })
                      }
                      disabled={reviewMutation.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Trang trước
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}

function RejectDialog({
  requestId,
  onReject,
  disabled,
}: {
  requestId: number;
  onReject: (note: string) => void;
  disabled: boolean;
}) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          disabled={disabled}
        >
          <X className="w-4 h-4 mr-1" /> Từ chối
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lý do từ chối</DialogTitle>
          <DialogDescription>
            Cung cấp lý do để người dùng hiểu vì sao yêu cầu đăng ký bán hàng
            của họ chưa đạt yêu cầu.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Nhập lý do (Cửa hàng không phù hợp, thiếu thông tin...)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-4"
        />
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onReject(note);
              setOpen(false);
              setNote("");
            }}
          >
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
