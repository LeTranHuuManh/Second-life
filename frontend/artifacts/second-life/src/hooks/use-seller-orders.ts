import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type SellerOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED";

export interface SellerOrderResponse {
  orderItemId: number;
  orderId: number;
  customerName: string;
  productId: number;
  productName: string;
  productImageUrl?: string;
  itemType?: "BUY" | "RENT";
  price?: number;
  orderDate?: string;
  status: SellerOrderStatus;
}

export function useSellerOrders() {
  return useQuery({
    queryKey: ["seller-orders"],
    queryFn: async (): Promise<SellerOrderResponse[]> => {
      const resp = await apiFetch("/seller/orders");
      return resp.data || [];
    },
  });
}

export function useUpdateSellerOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderItemId,
      status,
    }: {
      orderItemId: number;
      status: SellerOrderStatus;
    }) => {
      await apiFetch(`/seller/orders/${orderItemId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
  });
}
