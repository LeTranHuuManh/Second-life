import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useUsers(page: number, size: number = 20) {
  return useQuery({
    queryKey: ["users", page, size],
    queryFn: () => apiFetch(`/admin/users?page=${page}&size=${size}`),
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiFetch(`/admin/users/${userId}/toggle-status`, {
        method: "PUT",
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: data?.message || "Cập nhật trạng thái người dùng thành công",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Đã xảy ra lỗi khi cập nhật trạng thái",
      });
    }
  });
}