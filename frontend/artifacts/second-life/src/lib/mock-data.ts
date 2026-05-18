export type ProductStatus = "available" | "rented" | "sold" | "draft";
export type ProductType = "buy" | "rent" | "both";

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  avatar: string;
  address: string;
  joinedAt: string;
  totalOrders: number;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  type: ProductType;
  buyPrice?: number;
  rentPricePerDay?: number;
  aiSuggestedBuyPrice?: number;
  aiSuggestedRentPrice?: number;
  images: string[];
  stocks: number;
  status: ProductStatus;
  shop: Shop;
  location: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export const MOCK_SHOP: Shop = {
  id: "shop-1",
  name: "Tiệm Đồ Xinh",
  avatar: "https://i.pravatar.cc/150?img=47",
  address: "Quận 1, TP. Hồ Chí Minh",
  joinedAt: "2023-01-15T00:00:00Z",
  totalOrders: 1250,
  rating: 4.8,
};

const SHOP_HN: Shop = {
  id: "shop-2",
  name: "Vintage Hà Nội",
  avatar: "https://i.pravatar.cc/150?img=12",
  address: "Hoàn Kiếm, Hà Nội",
  joinedAt: "2022-06-01T00:00:00Z",
  totalOrders: 890,
  rating: 4.9,
};

const SHOP_DN: Shop = {
  id: "shop-3",
  name: "Đà Nẵng Shop",
  avatar: "https://i.pravatar.cc/150?img=33",
  address: "Hải Châu, Đà Nẵng",
  joinedAt: "2023-08-15T00:00:00Z",
  totalOrders: 320,
  rating: 4.7,
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Máy ảnh Fujifilm X-T4 Like New 99%",
    description: "Máy ảnh ít sử dụng, còn bảo hành hãng 6 tháng. Phụ kiện đi kèm: 1 pin zin, sạc, dây đeo.",
    category: "Điện tử",
    type: "both",
    buyPrice: 28500000,
    rentPricePerDay: 250000,
    aiSuggestedBuyPrice: 28000000,
    aiSuggestedRentPrice: 230000,
    images: [
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: MOCK_SHOP,
    location: "TP. Hồ Chí Minh",
    rating: 5.0,
    reviewsCount: 12,
    reviews: [
      {
        id: "r1",
        userName: "Minh Tuấn",
        userAvatar: "https://i.pravatar.cc/40?img=11",
        rating: 5,
        comment: "Máy quá đẹp, chủ shop nhiệt tình tư vấn!",
        createdAt: "2024-05-10T10:00:00Z"
      },
      {
        id: "r2",
        userName: "Lan Anh",
        userAvatar: "https://i.pravatar.cc/40?img=5",
        rating: 5,
        comment: "Sản phẩm đúng mô tả, giao hàng nhanh. Rất hài lòng!",
        createdAt: "2024-05-12T08:00:00Z"
      }
    ]
  },
  {
    id: "p2",
    name: "Sofa lười êm ái phong cách Hàn Quốc",
    description: "Sofa bọc nhung siêu mềm, phù hợp decor phòng khách, phòng ngủ. Mới 95% do mới đổi concept nhà.",
    category: "Nội thất",
    type: "buy",
    buyPrice: 1200000,
    aiSuggestedBuyPrice: 1150000,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
    ],
    stocks: 2,
    status: "available",
    shop: SHOP_HN,
    location: "Hà Nội",
    rating: 4.5,
    reviewsCount: 8,
    reviews: []
  },
  {
    id: "p3",
    name: "Lều cắm trại 4 người tự bung",
    description: "Cho thuê lều cắm trại cuối tuần. Nhẹ, dễ tháo lắp, chống nước tốt. Nhận ship nội thành.",
    category: "Đồ thể thao",
    type: "rent",
    rentPricePerDay: 80000,
    aiSuggestedRentPrice: 85000,
    images: [
      "https://images.unsplash.com/photo-1504280390224-b1f4864f1d69?w=800&q=80"
    ],
    stocks: 5,
    status: "available",
    shop: SHOP_DN,
    location: "Đà Nẵng",
    rating: 4.9,
    reviewsCount: 34,
    reviews: []
  },
  {
    id: "p4",
    name: "Đầm Vintage tiểu thư dáng dài",
    description: "Chỉ mặc 1 lần đi tiệc. Freesize có dây thắt eo. Chất liệu vải tơ mềm mại.",
    category: "Quần áo",
    type: "both",
    buyPrice: 350000,
    rentPricePerDay: 50000,
    aiSuggestedBuyPrice: 320000,
    aiSuggestedRentPrice: 55000,
    images: [
      "https://images.unsplash.com/photo-1515347619152-16b110a2f7c0?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: MOCK_SHOP,
    location: "TP. Hồ Chí Minh",
    rating: 5.0,
    reviewsCount: 2,
    reviews: []
  },
  {
    id: "p5",
    name: "Bàn làm việc gỗ thông tự nhiên",
    description: "Bàn gỗ thông 100% tự nhiên, kích thước 120x60cm. Còn mới 90%, không trầy xước.",
    category: "Nội thất",
    type: "buy",
    buyPrice: 2200000,
    aiSuggestedBuyPrice: 2100000,
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: SHOP_HN,
    location: "Hà Nội",
    rating: 4.7,
    reviewsCount: 15,
    reviews: []
  },
  {
    id: "p6",
    name: "Xe đạp địa hình Trek Marlin 5",
    description: "Xe đạp địa hình cỡ 29inch, đã đi 200km. Còn rất mới, tất cả phụ kiện nguyên bản.",
    category: "Đồ thể thao",
    type: "both",
    buyPrice: 8500000,
    rentPricePerDay: 150000,
    aiSuggestedBuyPrice: 8200000,
    aiSuggestedRentPrice: 160000,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: SHOP_DN,
    location: "Đà Nẵng",
    rating: 4.8,
    reviewsCount: 7,
    reviews: []
  },
  {
    id: "p7",
    name: "Máy tính bảng iPad Air 5 64GB WiFi",
    description: "iPad Air 5 màu xanh, nguyên seal, fullbox. Chưa active. Không cào trầy.",
    category: "Điện tử",
    type: "buy",
    buyPrice: 14900000,
    aiSuggestedBuyPrice: 14500000,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"
    ],
    stocks: 2,
    status: "available",
    shop: MOCK_SHOP,
    location: "TP. Hồ Chí Minh",
    rating: 4.9,
    reviewsCount: 23,
    reviews: []
  },
  {
    id: "p8",
    name: "Áo dài truyền thống lụa cao cấp",
    description: "Áo dài may đo chất lụa Hà Đông thật, màu đỏ đô, size M. Mặc 2 lần.",
    category: "Quần áo",
    type: "rent",
    rentPricePerDay: 120000,
    aiSuggestedRentPrice: 130000,
    images: [
      "https://images.unsplash.com/photo-1559058789-672da06263d8?w=800&q=80"
    ],
    stocks: 3,
    status: "available",
    shop: SHOP_HN,
    location: "Hà Nội",
    rating: 5.0,
    reviewsCount: 18,
    reviews: []
  },
  {
    id: "p9",
    name: "Ghế văn phòng Herman Miller Aeron",
    description: "Ghế công thái học nhập khẩu Mỹ, đã dùng 1 năm. Điều chỉnh đầy đủ, đệm lưới thoáng khí.",
    category: "Nội thất",
    type: "both",
    buyPrice: 22000000,
    rentPricePerDay: 200000,
    aiSuggestedBuyPrice: 21000000,
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: MOCK_SHOP,
    location: "TP. Hồ Chí Minh",
    rating: 4.8,
    reviewsCount: 6,
    reviews: []
  },
  {
    id: "p10",
    name: "Nồi chiên không dầu Philips 5.6L",
    description: "Nồi chiên không dầu gia đình 5.6L, dùng 6 tháng. Còn bảo hành chính hãng 18 tháng.",
    category: "Nhà bếp",
    type: "buy",
    buyPrice: 2800000,
    aiSuggestedBuyPrice: 2600000,
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: SHOP_DN,
    location: "Đà Nẵng",
    rating: 4.6,
    reviewsCount: 11,
    reviews: []
  },
  {
    id: "p11",
    name: "Bộ sách Harry Potter bản cứng",
    description: "Bộ 7 cuốn Harry Potter bản tiếng Anh bìa cứng, còn mới. Có chữ ký tác giả.",
    category: "Sách",
    type: "both",
    buyPrice: 1500000,
    rentPricePerDay: 30000,
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: SHOP_HN,
    location: "Hà Nội",
    rating: 5.0,
    reviewsCount: 4,
    reviews: []
  },
  {
    id: "p12",
    name: "Đàn guitar acoustic Yamaha F310",
    description: "Guitar acoustic cỡ 41 inch, âm thanh ấm. Đã chỉnh dây chuẩn. Phù hợp người mới học.",
    category: "Âm nhạc",
    type: "both",
    buyPrice: 1800000,
    rentPricePerDay: 60000,
    aiSuggestedBuyPrice: 1700000,
    aiSuggestedRentPrice: 65000,
    images: [
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: MOCK_SHOP,
    location: "TP. Hồ Chí Minh",
    rating: 4.7,
    reviewsCount: 9,
    reviews: []
  },
  {
    id: "p13",
    name: "Máy chiếu Xiaomi Mi Smart Projector",
    description: "Máy chiếu mini 1080P 500 lumens, dùng 5 tháng. Có thể kết nối WiFi, Bluetooth.",
    category: "Điện tử",
    type: "rent",
    rentPricePerDay: 200000,
    aiSuggestedRentPrice: 190000,
    images: [
      "https://images.unsplash.com/photo-1540991323689-4a0cbeb3e7ba?w=800&q=80"
    ],
    stocks: 2,
    status: "available",
    shop: SHOP_DN,
    location: "Đà Nẵng",
    rating: 4.9,
    reviewsCount: 27,
    reviews: []
  },
  {
    id: "p14",
    name: "Tủ quần áo gỗ MDF 6 ngăn",
    description: "Tủ quần áo 6 cánh gỗ công nghiệp, màu trắng. Kích thước 1m8 x 2m. Còn mới 85%.",
    category: "Nội thất",
    type: "buy",
    buyPrice: 3500000,
    aiSuggestedBuyPrice: 3300000,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: SHOP_HN,
    location: "Hà Nội",
    rating: 4.4,
    reviewsCount: 5,
    reviews: []
  },
  {
    id: "p15",
    name: "Đồng hồ Casio G-Shock GW-M5610",
    description: "Đồng hồ nam nhận sóng, pin năng lượng mặt trời. Đã dùng 2 năm, còn hoạt động tốt.",
    category: "Thời trang",
    type: "buy",
    buyPrice: 2900000,
    aiSuggestedBuyPrice: 2800000,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: MOCK_SHOP,
    location: "TP. Hồ Chí Minh",
    rating: 4.8,
    reviewsCount: 14,
    reviews: []
  },
  {
    id: "p16",
    name: "Bộ nồi inox 3 đáy Elmich",
    description: "Bộ 5 nồi inox 3 đáy cao cấp, dùng bếp từ được. Chưa dùng, còn nguyên hộp.",
    category: "Nhà bếp",
    type: "buy",
    buyPrice: 1200000,
    aiSuggestedBuyPrice: 1100000,
    images: [
      "https://images.unsplash.com/photo-1584947897558-4e2b0c0e18e2?w=800&q=80"
    ],
    stocks: 3,
    status: "available",
    shop: SHOP_DN,
    location: "Đà Nẵng",
    rating: 4.6,
    reviewsCount: 3,
    reviews: []
  },
  {
    id: "p17",
    name: "Laptop Dell XPS 15 9510 i7 RTX 3050",
    description: "Laptop gaming/đồ hoạ, chip i7-11800H, 16GB RAM, 512GB SSD. Đã dùng 1 năm.",
    category: "Điện tử",
    type: "both",
    buyPrice: 32000000,
    rentPricePerDay: 350000,
    aiSuggestedBuyPrice: 30000000,
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: SHOP_HN,
    location: "Hà Nội",
    rating: 4.9,
    reviewsCount: 8,
    reviews: []
  },
  {
    id: "p18",
    name: "Bộ đồ chơi LEGO Technic 42083",
    description: "Bộ LEGO Technic Bugatti Chiron 3599 mảnh. Đã lắp ráp 1 lần, còn đầy đủ chi tiết.",
    category: "Đồ chơi",
    type: "buy",
    buyPrice: 3200000,
    aiSuggestedBuyPrice: 3000000,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: MOCK_SHOP,
    location: "TP. Hồ Chí Minh",
    rating: 4.7,
    reviewsCount: 6,
    reviews: []
  },
  {
    id: "p19",
    name: "Quạt trần cánh gỗ Panasonic",
    description: "Quạt trần 5 cánh gỗ teak, điều khiển từ xa, 3 tốc độ. Dùng 3 năm, hoạt động tốt.",
    category: "Đồ gia dụng",
    type: "buy",
    buyPrice: 1500000,
    aiSuggestedBuyPrice: 1400000,
    images: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80"
    ],
    stocks: 2,
    status: "available",
    shop: SHOP_DN,
    location: "Đà Nẵng",
    rating: 4.3,
    reviewsCount: 7,
    reviews: []
  },
  {
    id: "p20",
    name: "Bộ ván trượt Penny 22 inch",
    description: "Penny board nhựa cao cấp màu vàng, bánh silicon. Chỉ dùng vài lần, còn mới.",
    category: "Đồ thể thao",
    type: "both",
    buyPrice: 650000,
    rentPricePerDay: 40000,
    images: [
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80"
    ],
    stocks: 1,
    status: "available",
    shop: SHOP_HN,
    location: "Hà Nội",
    rating: 4.5,
    reviewsCount: 2,
    reviews: []
  },
];

export const MOCK_CATEGORIES = [
  { id: "c1", name: "Quần áo", icon: "👗" },
  { id: "c2", name: "Điện tử", icon: "💻" },
  { id: "c3", name: "Nội thất", icon: "🛋️" },
  { id: "c4", name: "Đồ thể thao", icon: "⚽" },
  { id: "c5", name: "Sách", icon: "📚" },
  { id: "c6", name: "Đồ chơi", icon: "🎮" },
  { id: "c7", name: "Nhà bếp", icon: "🍳" },
  { id: "c8", name: "Thời trang", icon: "👜" },
  { id: "c9", name: "Âm nhạc", icon: "🎸" },
  { id: "c10", name: "Đồ gia dụng", icon: "🏠" },
];

export const VIETNAMESE_PROVINCES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

// --- Admin Mocks ---

export type UserRole = "admin" | "user" | "guest";
export type UserStatus = "active" | "banned" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  totalOrders: number;
}

export const ADMIN_MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    role: "user",
    status: "active",
    joinedAt: "2024-01-15T08:00:00Z",
    totalOrders: 12,
  },
  {
    id: "user-2",
    name: "Tran Thi B",
    email: "tranthib@example.com",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    role: "user",
    status: "banned",
    joinedAt: "2024-02-20T10:30:00Z",
    totalOrders: 3,
  },
  {
    id: "user-3",
    name: "Le Van C",
    email: "levanc@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    role: "admin",
    status: "active",
    joinedAt: "2023-11-05T09:15:00Z",
    totalOrders: 45,
  }
];

export type AILogStatus = "success" | "failed" | "pending";

export interface AILog {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  suggestedPrice: number;
  userFinalPrice: number;
  timestamp: string;
  status: AILogStatus;
}

export const MOCK_AI_LOGS: AILog[] = [
  {
    id: "log-1",
    productId: "p1",
    productName: "Sony Alpha a7 III",
    userName: "Nguyen Van A",
    suggestedPrice: 32000000,
    userFinalPrice: 31500000,
    timestamp: "2024-03-25T14:22:00Z",
    status: "success",
  },
  {
    id: "log-2",
    productId: "p2",
    productName: "PlayStation 5",
    userName: "Trinh D",
    suggestedPrice: 11000000,
    userFinalPrice: 12000000,
    timestamp: "2024-04-10T09:12:00Z",
    status: "success",
  },
  {
    id: "log-3",
    productId: "p3",
    productName: "Máy ảnh Film cũ",
    userName: "Tran Thi B",
    suggestedPrice: 500000,
    userFinalPrice: 0,
    timestamp: "2024-04-20T16:05:00Z",
    status: "failed",
  }
];

export const MOCK_ADMIN_DASHBOARD_STATS = {
  totalUsers: 12450,
  activeUsers: 8430,
  totalProducts: 45600,
  pendingProducts: 120,
  totalRevenue: 1245000000,
  aiUsageCount: 3450,
};

export const MOCK_CHART_DATA = [
  { month: "Jan", revenue: 4000, transactions: 240 },
  { month: "Feb", revenue: 3000, transactions: 139 },
  { month: "Mar", revenue: 2000, transactions: 980 },
  { month: "Apr", revenue: 2780, transactions: 390 },
  { month: "May", revenue: 1890, transactions: 480 },
  { month: "Jun", revenue: 2390, transactions: 380 },
  { month: "Jul", revenue: 3490, transactions: 430 },
];
