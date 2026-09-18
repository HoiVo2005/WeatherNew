# 🖼️ Hướng dẫn thêm ảnh nền thành phố (hero)

## 1. Thư mục đặt ảnh

```
public/images/cities/
```

Thư mục này đã được tạo sẵn trong dự án.

## 2. Tên file

Đặt tên file **đúng theo bảng dưới** (viết thường, không dấu, dùng dấu gạch ngang), ví dụ chọn tỉnh "Đà Nẵng" thì app tự lấy `public/images/cities/da-nang.jpg` làm nền.

| Tỉnh/thành | Tên file ảnh |
|---|---|
| Hà Nội | `thu-do-ha-noi.png` |
| Cao Bằng | `tinh-cao-bang.png` |
| Tuyên Quang | `tinh-tuyen-quang.png` |
| Điện Biên | `tinh-dien-bien.png` |
| Lai Châu | `tinh-lai-chau.png` |
| Sơn La | `tinh-son-la.png` |
| Lào Cai | `tinh-lao-cai.png` |
| Thái Nguyên | `tinh-thai-nguyen.png` |
| Lạng Sơn | `tinh-lang-son.png` |
| Quảng Ninh | `tinh-quang-ninh.png` |
| Bắc Ninh | `tinh-bac-ninh.png` |
| Phú Thọ | `tinh-phu-tho.png` |
| Hải Phòng | `thanh-pho-hai-phong.png` |
| Hưng Yên | `tinh-hung-yen.png` |
| Ninh Bình | `tinh-ninh-binh.png` |
| Thanh Hóa | `tinh-thanh-hoa.png` |
| Nghệ An | `tinh-nghe-an.png` |
| Hà Tĩnh | `tinh-ha-tinh.png` |
| Quảng Trị | `tinh-quang-tri.png` |
| Huế | `thanh-pho-hue.png` |
| Đà Nẵng | `thanh-pho-da-nang.png` |
| Quảng Ngãi | `tinh-quang-ngai.png` |
| Gia Lai | `tinh-gia-lai.png` |
| Khánh Hòa | `tinh-khanh-hoa.png` |
| Lâm Đồng | `tinh-lam-dong.png` |
| Đắk Lắk | `tinh-dak-lak.png` |
| Đồng Nai | `tinh-dong-nai.png` |
| Tây Ninh | `tinh-tay-ninh.png` |
| TP. Hồ Chí Minh | `thanh-pho-ho-chi-minh.png` |
| Đồng Tháp | `tinh-dong-thap.png` |
| Vĩnh Long | `tinh-vinh-long.png` |
| **An Giang** | `tinh-an-giang.png` |
| Cần Thơ | `thanh-pho-can-tho.png` |
| Cà Mau | `tinh-ca-mau.png` |

## 3. Yêu cầu ảnh

- **Ảnh ngang**, tối thiểu **1200px** chiều rộng (khuyến nghị 1600×900 trở lên).
- Nên chọn ảnh có trời/quang cảnh **không quá sáng chói** để chữ trắng trên hero dễ đọc (app tự phủ 1 lớp tối nhẹ trên ảnh).

## 4. Định dạng

- Bộ ảnh hiện tại dùng **.png** (bảng ánh xạ trong `src/data/city-backgrounds.ts` đã trỏ đúng tới các file `.png` bạn đã thêm).
- Nếu sau này thêm ảnh `.jpg`/`.webp` thì sửa đuôi file tương ứng trong bảng `cityBackgrounds` ở file `src/data/city-backgrounds.ts`.

## 5. Sau khi bỏ ảnh vào

- Nhấn **F5** (tải lại trang) là thấy — **không cần** khởi động lại dev server.
- Tỉnh nào chưa có ảnh → hero vẫn hiển thị nền gradient trời như cũ, **không báo lỗi**.
- Ảnh áp dụng cho cả trường hợp chọn tỉnh từ danh sách 34 tỉnh/thành lẫn kết quả tìm kiếm (kể cả tên tiếng Anh như "Ho Chi Minh City" vẫn nhận diện đúng).
