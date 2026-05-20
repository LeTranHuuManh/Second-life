import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  type: "BUY" | "RENT";
  priceAtPurchase: number;
  rentalDays?: number;
  startDate?: string;
  endDate?: string;
}

export interface OrderResponse {
  id: number;
  shippingAddress: any;
  shippingFee: number;
  note: string;
  totalAmount: number;
  depositAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "COMPLETED" | "CANCELLED";
  paymentMethod: string;
  createdAt: string;
  items: OrderItemResponse[];
  reviewed?: boolean; 
}

export interface OrderItemRequest {
  productId: number;
  type: "BUY" | "RENT";
  rentalDays?: number;
  startDate?: string;
  endDate?: string;
}

export interface OrderCreateRequest {
  addressId: number;
  note?: string;
  paymentMethod?: string;
  items: OrderItemRequest[];
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<OrderResponse[]> => {
      const resp = await apiFetch("/orders/me");
      return resp.data || [];
    },
  });
}

export function useConfirmReceived() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { orderId: number; productId: number; rating: number; comment: string; imageUrl?: string }) => {
      const payload = {
        rating: data.rating,
        comment: data.comment,
        imageUrl: data.imageUrl,
      };
      const resp = await apiFetch(`/products/${data.productId}/ratings`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderCreateRequest): Promise<OrderResponse[]> => {
      const resp = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return resp.data as OrderResponse[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
