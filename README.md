# [cite_start]Second Life – Nền tảng Marketplace mua bán & cho thuê đồ cũ tích hợp AI định giá [cite: 3]

## 📖 Giới thiệu dự án

[cite_start]Second Life là một nền tảng trung gian C2C (customer-to-customer) [cite: 6] [cite_start]được xây dựng với mục tiêu giảm lãng phí tài nguyên [cite: 7] [cite_start]và hỗ trợ sinh viên/người trẻ kiếm thêm thu nhập[cite: 8]. [cite_start]Điểm nổi bật của dự án là việc tích hợp hệ thống AI định giá thực tế [cite: 13][cite_start], giúp minh bạch giá cả[cite: 9], bảo vệ người dùng khỏi việc bị ép giá và cung cấp gợi ý giá thuê/bán hợp lý.

[cite_start]Đây là một hệ thống web fullstack production-ready [cite: 11] với backend monolithic để tối ưu tốc độ triển khai giai đoạn đầu.

---

## 🚀 Tính năng chính (Theo Use Cases)

### [cite_start]1. Dành cho Khách (Guest) [cite: 29]

- Tìm kiếm sản phẩm.
- Xem thông tin chi tiết của sản phẩm.
- Nhận đề xuất (recommendation) sản phẩm dựa trên vị trí.

### [cite_start]2. Dành cho Người dùng (User - Buyer/Seller/Renter) [cite: 30]

- Đăng ký và đăng nhập vào hệ thống.
- [cite_start]Đăng sản phẩm bán [cite: 35] [cite_start]hoặc cho thuê[cite: 36].
- [cite_start]**Nhận gợi ý giá từ AI** [cite: 37] khi đăng bài.
- [cite_start]Mua hoặc thuê sản phẩm (chọn ngày)[cite: 39].
- Thêm sản phẩm vào giỏ hàng.
- [cite_start]Thanh toán [cite: 40] và đặt cọc thông qua tích hợp **PayOS**.
- [cite_start]Nhắn tin (Chat) [cite: 38] trao đổi trực tiếp qua kết nối realtime.
- [cite_start]Đánh giá chất lượng sau giao dịch[cite: 41].
- Xem lịch sử đặt hàng, lịch trình cho thuê sản phẩm, lịch sử tìm kiếm và lịch sử xem sản phẩm.
- Nhận thông báo (qua mail, hệ thống) khi quan tâm một sản phẩm.

### [cite_start]3. Dành cho Quản trị viên (Admin) [cite: 31]

- [cite_start]Quản lý user[cite: 43].
- [cite_start]Quản lý bài đăng [cite: 44] [cite_start]và quản lý báo cáo vi phạm[cite: 45].
- [cite_start]Thống kê doanh thu [cite: 46] và tỷ lệ thuê thành công trên Dashboard.
- [cite_start]Quản lý mô hình AI [cite: 47] và theo dõi độ chính xác của giá AI so với thực tế.

---

## 🛠 Kiến trúc & Công nghệ (Tech Stack)

- **Kiến trúc tổng thể:** Hybrid (Frontend + AI Service tách riêng, Backend Monolithic).
- [cite_start]**Frontend:** Next.js [cite: 50] (App Router, Tailwind CSS, Zustand/Redux).
- **Backend:** Java Spring Boot Monolithic (modular theo domain: User, Product, Order, Rental, Payment, Chat, Notification).
- [cite_start]**AI Service:** Viết bằng Python[cite: 61]. [cite_start]Sử dụng XGBoost Model [cite: 71] [cite_start]để dự đoán giá thuê/ngày và Gemini Vision để phân tích ảnh[cite: 71]. Giai đoạn đầu, mô hình sẽ được huấn luyện bằng tập dữ liệu giả lập (fake data) để thiết lập luồng pipeline.
- [cite_start]**Cơ sở dữ liệu[cite: 62]:**
  - [cite_start]**MySQL (transaction):** [cite: 63] Quản lý người dùng, sản phẩm, đơn hàng.
  - [cite_start]**MongoDB (chat/log):** [cite: 64] Lưu trữ tin nhắn WebSocket và log hệ thống.
  - [cite_start]**Redis (cache):** [cite: 65] Caching dữ liệu tĩnh và quản lý session/token.

---

## 📂 Cây thư mục dự án (Directory Structure)

```text
second-life-project/
├── frontend/                     # Chứa source code Frontend sử dụng Next.js
│   ├── public/
│   ├── src/
│   │   ├── app/                  # Chứa các route cho Guest, User, Admin
│   │   ├── components/           # Các component UI tái sử dụng
│   │   ├── hooks/                # Custom hooks (ví dụ: useWebSocket)
│   │   ├── services/             # Fetch API đến Spring Cloud Gateway
│   │   └── store/                # Quản lý global state
│   ├── package.json
│
├── backend/                      # Spring Boot Monolithic Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/secondlife/backend/
│   │   │   │   ├── domain/       # Chia module theo domain nghiệp vụ
│   │   │   │   ├── controller/   # REST API controllers
│   │   │   │   ├── service/      # Business logic
│   │   │   │   ├── repository/   # Data access layer
│   │   │   │   └── config/       # Security, CORS, Swagger, ...
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml                   # Cấu hình Maven Spring Boot app đơn
│
├── ai-service/                   # Chứa AI Pricing Service (Python)
│   ├── api/                      # FastAPI/Flask server trả API
│   ├── pipeline/
│   │   ├── gemini_vision.py      # Module gọi Gemini API phân tích ảnh
│   │   └── feature_eng.py        # Tiền xử lý dữ liệu JSON thành vector
│   ├── model/                    # Chứa file mô hình XGBoost đã train
│   ├── data/                     # Script tạo fake data và lưu trữ dataset
│   └── requirements.txt
│
├── infrastructure/               # Cấu hình hạ tầng
│   ├── docker-compose.yml        # Chạy MySQL, MongoDB, Redis
│
└── README.md
```
# Second-life
# Second-life
# Second-life
