export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

let isRefreshing = false;
let failedQueue: ((token: string) => void)[] = [];

// Hàm hỗ trợ để xử lý các request bị nghẽn (pending) trong lúc refresh token
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      // prom(error); - Xử lý nâng cao: reject promise, nhưng ta làm đơn giản truyền token mới
    } else if (token) {
      prom(token);
    }
  });
  failedQueue = [];
};

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const token = localStorage.getItem("second_life_token");

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Nếu Backend trả về 401 Unauthorized (thường do Token hết hạn)
  if (response.status === 401) {
    const originalRequest = { endpoint, options };

    // Không gửi refresh token cho các request liên quan đến route lấy lại token
    if (
      !endpoint.includes("/auth/refresh") &&
      !endpoint.includes("/auth/login")
    ) {
      const refreshToken = localStorage.getItem("second_life_refresh_token");

      if (!refreshToken) {
        localStorage.removeItem("second_life_user");
        localStorage.removeItem("second_life_token");
        window.location.href = "/dang-nhap";
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      if (isRefreshing) {
        // Đưa request vào hàng đợi để tiếp tục gọi lại sau khi refresh xong
        return new Promise((resolve) => {
          failedQueue.push(async (newToken: string) => {
            originalRequest.options.headers = {
              ...originalRequest.options.headers,
              Authorization: `Bearer ${newToken}`,
            } as any;
            resolve(
              await apiFetch(originalRequest.endpoint, originalRequest.options),
            );
          });
        });
      }

      isRefreshing = true;

      try {
        // Gọi API refresh token
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error("Refresh Token expired or invalid");
        }

        const refreshData = await refreshResponse.json();
        const newToken = refreshData.data?.token || refreshData.token;
        const newRefreshToken =
          refreshData.data?.refreshToken || refreshData.refreshToken;

        // Lưu token mới
        localStorage.setItem("second_life_token", newToken);
        if (newRefreshToken) {
          localStorage.setItem("second_life_refresh_token", newRefreshToken);
        }

        processQueue(null, newToken);

        // Chạy lại request gốc
        headers["Authorization"] = `Bearer ${newToken}`;
        const finalResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });

        const finalData = await finalResponse.json();
        if (!finalResponse.ok)
          throw new Error(finalData.message || "Lỗi xử lý request");
        return finalData;
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        // Force logout khi quá hạn cả Refresh Token
        localStorage.removeItem("second_life_user");
        localStorage.removeItem("second_life_token");
        localStorage.removeItem("second_life_refresh_token");
        window.location.href = "/dang-nhap";
        throw new Error("Phiên đăng nhập đã hết hạn toàn bộ.");
      } finally {
        isRefreshing = false;
      }
    }
  }

  // Parse JSON data (bỏ payload empty như 204 nếu có)
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra, vui lòng thử lại sau");
  }

  return data;
};
