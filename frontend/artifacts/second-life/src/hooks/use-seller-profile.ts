import { useQuery } from "@tanstack/react-query";
import { getSellerProfile, SellerProfileData } from "@/lib/shop";

export function useSellerProfile(sellerId?: string) {
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
