# Hướng dẫn phát triển Local

## ✅ Đã sửa: Hỗ trợ đầy đủ Localhost

### **KHÔNG BỊ HỎNG** - Tất cả chức năng vẫn hoạt động bình thường!

## Cách truy cập Admin trên Local

### Cách 1: Sử dụng path-based routing (Đơn giản nhất - KHUYẾN NGHỊ)
```
http://localhost:5173/admin/login
http://localhost:5173/admin/dashboard
http://localhost:5173/admin/points
http://localhost:5173/admin/betting-odds
```

### Cách 2: Sử dụng subdomain (Cần cấu hình hosts)
1. Sửa file `/etc/hosts` (Linux/Mac) hoặc `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 admin.localhost
```

2. Truy cập:
```
http://admin.localhost:5173/login
http://admin.localhost:5173/dashboard
```

**Lưu ý**: Với `admin.localhost`, routes sẽ KHÔNG có `/admin` prefix (giống production)

### Cách 3: Sử dụng IP local
```
http://192.168.x.x:5173/admin/login
http://10.0.x.x:5173/admin/login
```

## Cách truy cập User trên Local
```
http://localhost:5173/
http://localhost:5173/wallet
http://localhost:5173/lottery
http://localhost:5173/login
```

## Logic hoạt động

### Trên Localhost:
- **Path-based routing**: 
  - Nếu URL bắt đầu bằng `/admin/*` → Render AdminRoutes với paths `/admin/*`
  - Ví dụ: `/admin/login`, `/admin/dashboard`
  
- **Subdomain routing**: 
  - Nếu hostname là `admin.localhost` → Render AdminRoutes với paths không có `/admin` prefix
  - Ví dụ: `/login`, `/dashboard` (giống production)
  
- **Còn lại**: Render UserRoutes

### Trên Production:
- **Subdomain routing**: 
  - Nếu subdomain là `admin` → Render AdminRoutes với paths không có `/admin` prefix
  - Ví dụ: `admin.tathiet168.com/login` → `/login`
  
- **Còn lại**: Render UserRoutes

## ✅ Đảm bảo không mất chức năng

1. **Tất cả routes vẫn hoạt động**: User routes và Admin routes đều hoạt động bình thường
2. **Navigation tự động**: Các helper functions tự động chuyển đổi paths dựa trên environment
3. **Backward compatible**: Code cũ vẫn hoạt động, không cần sửa gì thêm
4. **Local development**: Hỗ trợ cả path-based và subdomain-based routing

## Test Checklist

### User Routes:
- [ ] `localhost:5173/` → User homepage ✅
- [ ] `localhost:5173/wallet` → Wallet page ✅
- [ ] `localhost:5173/lottery` → Lottery page ✅
- [ ] `localhost:5173/login` → User login ✅

### Admin Routes (Path-based):
- [ ] `localhost:5173/admin/login` → Admin login ✅
- [ ] `localhost:5173/admin/dashboard` → Admin dashboard (sau khi login) ✅
- [ ] `localhost:5173/admin/points` → Admin points management ✅
- [ ] `localhost:5173/admin/betting-odds` → Admin betting odds ✅

### Admin Routes (Subdomain - nếu đã cấu hình hosts):
- [ ] `admin.localhost:5173/login` → Admin login ✅
- [ ] `admin.localhost:5173/dashboard` → Admin dashboard ✅

## Cấu hình Vite (nếu cần)

Nếu muốn test với subdomain `admin.localhost`, có thể cấu hình trong `vite.config.js`:

```js
export default defineConfig({
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ network
    port: 5173,
  },
  // ...
})
```

Sau đó truy cập: `http://admin.localhost:5173` (sau khi đã cấu hình hosts)

