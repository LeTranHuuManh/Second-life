import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface CategoryData {
  id: number;
  name: string;
  icon?: string | null;
  parentId?: number | null;
}

export const getCategories = async (): Promise<CategoryData[]> => {
  const data = await apiFetch("/categories");
  return data.data || data;
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // cache for 1 hour
  });
}
