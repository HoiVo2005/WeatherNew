# WeatherNow Desktop cho Windows

Dự án đã được tích hợp Electron để chạy như một phần mềm cài đặt trên máy tính.

## Yêu cầu

- Windows 10 hoặc Windows 11 64-bit
- Node.js 20 trở lên
- Kết nối Internet khi cài thư viện và khi xem dữ liệu thời tiết/bản đồ

## Cách nhanh nhất để tạo bộ cài

1. Giải nén source.
2. Nhấp đúp file `build-desktop.bat`.
3. Chờ hoàn tất.
4. Mở thư mục `dist`.
5. Chạy file `WeatherNow-Setup-1.0.0.exe` để cài ứng dụng.

## Chạy thử ứng dụng desktop

Nhấp đúp `run-desktop-dev.bat` hoặc chạy:

```bash
npm install
npm run desktop:dev
```

## Các lệnh đã thêm

```bash
npm run build
npm run desktop:start
npm run desktop:win
npm run desktop:portable
```

- `desktop:win`: tạo bộ cài Windows NSIS.
- `desktop:portable`: tạo bản chạy trực tiếp không cần cài.

## Lưu ý

- Ứng dụng không sử dụng database.
- Dữ liệu thời tiết lấy từ Open-Meteo.
- Bản đồ lấy lớp bản đồ trực tuyến từ OpenStreetMap/OpenTopoMap/CARTO.
- Vì vậy ứng dụng cần Internet để cập nhật thời tiết và hiển thị bản đồ.
