import { useState } from "react";
import { useUsers, useToggleUserStatus } from "@/hooks/use-users";
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
import { MoreHorizontal, ShieldAlert, Lock, Unlock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminUsers() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useUsers(page);
  const toggleUserStatusMutation = useToggleUserStatus();

  const handleToggleStatus = (userId: number) => {
    toggleUserStatusMutation.mutate(userId);
  };

  const users = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Người dùng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tài khoản User & Guest tham gia nền tảng.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Thành viên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="text-right">Số đơn hàng</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <Badge variant="default" className="bg-blue-600">
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary">User</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.status === "active" ? (
                    <Badge
                      variant="outline"
                      className="text-green-600 bg-green-50"
                    >
                      Hoạt động
                    </Badge>
                  ) : user.status === "banned" ? (
                    <Badge variant="destructive">Đã Khóa</Badge>
                  ) : (
                    <Badge variant="secondary">Chờ duyệt</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-right">{user.totalOrders}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                      <DropdownMenuItem>
                        Xem thông tin chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>Lịch sử hoạt động</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === "banned" ? (
                        <DropdownMenuItem className="text-green-600" onClick={() => handleToggleStatus(user.id)}>
                          <Unlock className="mr-2 h-4 w-4" /> Mở khóa tài khoản
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-destructive" onClick={() => handleToggleStatus(user.id)}>
                          <Lock className="mr-2 h-4 w-4" /> Khóa tài khoản
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
