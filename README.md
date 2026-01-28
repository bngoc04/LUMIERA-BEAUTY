<div align="center">

# 🚀 LUMIERA_BEAUTY 

<p>
<img width="761" height="276" alt="image" src="https://github.com/user-attachments/assets/fe046d68-950d-4552-902e-92a602237b15" />

</p>
Chào mừng đến với **Lumiera Beauty**, một ứng dụng web toàn diện được thiết kế cho thẩm mỹ viện cao cấp. Hệ thống giúp quản lý lịch hẹn, dịch vụ, khách hàng và chấm công nhân viên một cách hiệu quả.

</div>

## 🌟 Tính Năng Chính

*   **Hệ thống xác thực**: Đăng nhập và đăng ký bảo mật cho Khách hàng và Quản trị viên. Hỗ trợ khôi phục mật khẩu.
*   **Phân quyền truy cập**:
    *   **Admin Dashboard**: Quản lý lịch hẹn, danh sách dịch vụ, khách hàng và xem báo cáo chấm công.
    *   **Khách hàng**: Đặt lịch hẹn trực tuyến, xem chi tiết dịch vụ và quản lý hồ sơ cá nhân.
*   **Trợ lý ảo thông minh (Lumiera AI)**: Chatbot tích hợp giúp giải đáp thắc mắc và hỗ trợ khách hàng ngay lập tức.
*   **Quản lý lịch hẹn**: Lên lịch, cập nhật và theo dõi trạng thái các cuộc hẹn làm đẹp (Pending, Confirmed, Completed).
*   **Quản lý dịch vụ**: Thêm mới, cập nhật giá và thông tin các dịch vụ làm đẹp.
*   **Chấm công nhân viên**: Theo dõi lịch sử check-in/check-out hàng ngày của nhân viên.
*   **Giao diện Responsive**: Thiết kế sang trọng, tối ưu hiển thị trên cả máy tính và thiết bị di động.

## 🛠️ Công Nghệ Sử Dụng

*   **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS).
*   **Backend**: Node.js, Express.js.
*   **Database**: `lowdb` (Cơ sở dữ liệu JSON cục bộ, đơn giản và hiệu quả).
*   **Styles**: CSS tùy chỉnh kết hợp Font Awesome và Google Fonts (Inter, Imperial Script, Abhaya Libre).

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### Yêu cầu tiên quyết
*   [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản v14 trở lên)
*   npm (Node Package Manager)

### Các bước cài đặt

1.  **Clone hoặc tải xuống** mã nguồn dự án.
2.  Mở terminal tại thư mục gốc của dự án (`lumiera-beauty-root`).
3.  Cài đặt các thư viện cần thiết cho backend:
    ```bash
    npm run install-backend
    ```
    *(Hoặc bạn có thể chạy `cd backend && npm install`)*

### Chạy ứng dụng

1.  Khởi động server từ thư mục gốc:
    ```bash
    npm start
    ```
2.  Server sẽ khởi chạy tại địa chỉ **`http://localhost:3000`**.
3.  Mở trình duyệt truy cập địa chỉ trên, bạn sẽ tự động được chuyển hướng đến trang **Đăng nhập**.

## 🔑 Tài Khoản Demo

### Quản trị viên (Admin)
*   **Tài khoản**: `admin@lumiera.com`
*   **Mật khẩu**: `admin123`
*   *Quyền hạn*: Kiểm soát toàn bộ hệ thống (Dashboard, Dịch vụ, Khách hàng, Chấm công).

### Khách hàng (Customer)
*   Bạn có thể đăng ký tài khoản mới tại trang **Đăng ký**.
*   **Tài khoản thử nghiệm**:
    *   **Email**: `testuser@gmail.com`
    *   **Mật khẩu**: `password123`
*   *Quyền hạn*: Đặt lịch, xem hồ sơ, xem dịch vụ.

## 📂 Cấu Trúc Dự Án

```
LUMIERA_BEAUTY/
├── backend/                # Mã nguồn phía Server
│   ├── server.js           # Ứng dụng Express chính & định nghĩa API
│   ├── db.json             # Cơ sở dữ liệu JSON
│   └── package.json        # Các thư viện phụ thuộc của Backend
│
├── frontend/               # Mã nguồn phía Client (Giao diện)
│   ├── assets/             # Hình ảnh và tài nguyên
│   ├── chatbot.css/js      # Style và Logic cho Chatbot
│   ├── admin.css/js        # Style và Logic cho trang Admin
│   ├── script.js           # Logic chung
│   ├── *.html              # Các trang HTML (homepage, admin, datlich, v.v.)
│   └── ...
│
├── package.json            # Cấu hình gốc và scripts chạy nhanh
└── README.md               # Tài liệu hướng dẫn dự án
```

## 📡 Tài Liệu API

Backend cung cấp các API RESTful tại `http://localhost:3000/api/`:

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/appointments` | Lấy danh sách lịch hẹn |
| **POST** | `/appointments` | Tạo lịch hẹn mới |
| **GET** | `/services` | Lấy danh sách dịch vụ |
| **POST** | `/services` | Thêm dịch vụ mới |
| **GET** | `/customers` | Lấy danh sách khách hàng |
| **GET** | `/attendance` | Xem dữ liệu chấm công |
| **POST** | `/register` | Đăng ký người dùng mới |
| **POST** | `/login` | Đăng nhập hệ thống |

---
*Phát triển bởi đội ngũ Lumiera Beauty*
