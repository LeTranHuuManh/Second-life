import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface ProductRatingResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  imageUrl?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export function useRatings(productId: number) {
  return useQuery({
    queryKey: ["ratings", productId],
    queryFn: async (): Promise<ProductRatingResponse[]> => {
      const resp = await apiFetch(`/products/${productId}/ratings`);
      return resp.data || [];
    },
    enabled: !!productId,
  });
}

export function useSubmitProductRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { productId: number; rating: number; comment: string; imageUrl?: string }) => {
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ratings", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products", String(variables.productId)] });
    },
  });
}
