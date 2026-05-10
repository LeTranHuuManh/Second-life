import { apiFetch } from "./api";

export interface SellerProfileData {
	id: number;
	name: string;
	avatar?: string | null;
	coverImage?: string | null;
	address?: string | null;
	totalOrders: number;
	totalProducts: number;
	joinedDate?: string | null;
	rating?: number | null;
	ratingCount?: number | null;
	description?: string | null;
	responseRate?: string | null;
	responseTime?: string | null;
}

export const getSellerProfile = async (sellerId: string | number) => {
	return await apiFetch(`/shop/${sellerId}`, {
		method: "GET",
	});
};
