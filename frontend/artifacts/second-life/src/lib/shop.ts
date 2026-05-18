import { apiFetch } from "./api";

export interface SellerProfileData {
	id: number;
	name: string;
	phone?: string | null;
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

export const updateSellerProfile = async (
	sellerId: string | number,
	data: { shopName?: string; description?: string; phone?: string; address?: string; avatar?: File; coverImage?: File }
) => {
	const formData = new FormData();
	if (data.shopName) formData.append("shopName", data.shopName);
	if (data.description) formData.append("description", data.description);
	if (data.phone) formData.append("phone", data.phone);
	if (data.address) formData.append("address", data.address);
	if (data.avatar) formData.append("avatar", data.avatar);
	if (data.coverImage) formData.append("coverImage", data.coverImage);

	return await apiFetch(`/shop/${sellerId}`, {
		method: "PUT",
		body: formData,
	});
};
