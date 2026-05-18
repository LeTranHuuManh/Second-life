import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSellerProfile, updateSellerProfile, SellerProfileData } from "@/lib/shop";

export function useSellerProfile(sellerId?: string | number) {
  return useQuery({
    queryKey: ["seller-profile", sellerId],
    queryFn: async (): Promise<SellerProfileData | null> => {
      if (!sellerId) return null;
      const data = await getSellerProfile(sellerId);
      return data.data || data;
    },
    enabled: !!sellerId,
  });
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sellerId,
      data,
    }: {
      sellerId: string | number;
      data: { shopName?: string; description?: string; phone?: string; address?: string; avatar?: File; coverImage?: File };
    }) => {
      return await updateSellerProfile(sellerId, data);
    },
    onSuccess: (_, { sellerId }) => {
      queryClient.invalidateQueries({ queryKey: ["seller-profile", sellerId] });
    },
  });
}
