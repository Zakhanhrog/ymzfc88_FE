# BettingHub - Nền tảng cá cược trực tuyến

Dự án web cá cược được xây dựng với React, Vite, Tailwind CSS và Ant Design.

## 🚀 Tính năng

- ✅ **Đăng ký/Đăng nhập**: Hệ thống authentication đầy đủ
- ✅ **Trang chủ**: Hiển thị trận đấu hot và live
- ✅ **Giao diện đẹp**: Sử dụng Ant Design + Tailwind CSS
- ✅ **Responsive**: Tương thích mọi thiết bị
- ✅ **Cấu trúc rõ ràng**: Tách biệt features, components, services

## 📁 Cấu trúc dự án

```
src/
├── components/common/     # Components dùng chung
│   ├── Layout.jsx        # Layout chính
│   └── Loading.jsx       # Component loading
├── features/             # Tính năng theo module
│   ├── auth/            # Xác thực
│   │   ├── components/  # Components riêng
│   │   ├── pages/       # Trang chính
│   │   └── services/    # API services
│   └── home/            # Trang chủ
│       ├── components/  
│       ├── pages/       
│       └── services/    
├── hooks/               # Custom hooks
├── utils/               # Utilities & constants
└── styles/              # Global styles
```

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + Vite
- **UI Framework**: Ant Design
- **Styling**: Tailwind CSS
- **Routing**: React Router Dom
- **HTTP Client**: Axios
- **Icons**: Ant Design Icons

## 📦 Cài đặt và chạy

### Prerequisites
- Node.js >= 16
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Build production
```bash
npm run build
```

## 🔐 Demo Account

Để test đăng nhập, sử dụng:
- **Email**: admin@bettinghub.com
- **Password**: 123456

## 📝 Tính năng đã có

### 1. Authentication
- [x] Đăng ký tài khoản mới
- [x] Đăng nhập
- [x] Đăng xuất
- [x] Lưu trạng thái đăng nhập

### 2. Trang chủ
- [x] Banner giới thiệu
- [x] Thống kê tổng quan
- [x] Danh sách trận đấu HOT
- [x] Danh sách trận đấu LIVE
- [x] Hiển thị tỷ lệ cược

### 3. Layout & Navigation
- [x] Header với menu
- [x] Dropdown user menu
- [x] Footer
- [x] Responsive design

## 🔄 API Services

Hiện tại sử dụng **Mock API** để demo. Các endpoints có thể dễ dàng thay thế bằng API thực:

### Auth Service
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất

### Home Service  
- `GET /matches/hot` - Lấy trận đấu hot
- `GET /matches/live` - Lấy trận đấu live
- `GET /stats` - Lấy thống kê

## 🎨 UI Components

### Reusable Components
- `Layout` - Layout chính của app
- `Loading` - Component loading với spinner
- `StatsCard` - Card hiển thị thống kê
- `MatchList` - Danh sách trận đấu
- `Banner` - Banner trang chủ

### Form Components
- `LoginForm` - Form đăng nhập
- `RegisterForm` - Form đăng ký

## 🔧 Utilities

### Helpers
- `formatDate()` - Format ngày tháng
- `formatCurrency()` - Format tiền tệ VND
- `isValidEmail()` - Validate email
- `isValidPhoneNumber()` - Validate số điện thoại
- `calculatePayout()` - Tính toán tiền thắng cược

### Constants
- API endpoints
- Storage keys
- Status constants
- Validation rules

### Custom Hooks
- `useAuth()` - Quản lý authentication
- `useLocalStorage()` - Wrapper cho localStorage

## 🚧 Phát triển tiếp theo

Dự án đã có cấu trúc cơ bản, có thể phát triển thêm:

1. **Betting System**: Hệ thống đặt cược thực tế
2. **User Profile**: Trang thông tin cá nhân
3. **Betting History**: Lịch sử cược
4. **Live Updates**: Real-time updates
5. **Payment Integration**: Tích hợp thanh toán
6. **Admin Panel**: Panel quản trị
7. **Mobile App**: Ứng dụng mobile

## 📞 Hỗ trợ

Nếu có vấn đề gì, vui lòng tạo issue hoặc liên hệ qua email.

---

**Lưu ý**: Đây là dự án demo, không dùng cho mục đích cá cược thực tế.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
