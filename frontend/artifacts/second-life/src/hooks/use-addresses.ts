import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface UserAddress {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  isDefault: boolean;
}

export type CreateAddressRequest = Omit<UserAddress, "id">;

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async (): Promise<UserAddress[]> => {
      const data = await apiFetch("/users/me/addresses");
      return data.data || [];
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAddressRequest) => {
      const resData = await apiFetch("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return resData.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiFetch(`/users/me/addresses/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiFetch(`/users/me/addresses/${id}/default`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
