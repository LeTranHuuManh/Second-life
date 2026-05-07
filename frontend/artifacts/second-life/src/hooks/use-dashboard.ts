import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["seller-dashboard-stats"],
    queryFn: async () => {
      try {
        const response = await apiFetch("/seller/dashboard/stats");
        return response.data;
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
          revenue: 0,
          newOrders: 0,
          views: 0,
          chartData: []
        };
      }
    }
  });
}
