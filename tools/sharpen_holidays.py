"""
Script làm nét ảnh ngày lễ cho WeatherNow.

Ảnh gốc trong public/holidays có độ phân giải rất thấp (~300x168px) nên khi hiển thị
ở khung ~720px+ bị mờ. Script này:
  1. Backup toàn bộ ảnh gốc vào  public/holidays-original/
  2. Upscale ảnh lên width 1200px (thuật toán Lanczos - nét nhất trong các thuật toán resize)
  3. Áp dụng Unsharp Mask (làm nét cạnh) + tăng nhẹ độ tương phản & màu sắc
  4. Lưu lại JPEG chất lượng 88, progressive

Chạy: python tools/sharpen_holidays.py
Chạy lại an toàn (backup không ghi đè).
"""

from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance

PROJECT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT / "public" / "holidays"
BACKUP_DIR = PROJECT / "public" / "holidays-original"

TARGET_WIDTH = 1200  # đủ cho khung 720px CSS và màn hình Retina/scaling 125-150%
JPEG_QUALITY = 88


def process_image(path: Path) -> tuple[str, str]:
    img = Image.open(path)
    img = img.convert("RGB")
    orig_size = img.size

    # 1. Upscale Lanczos lên TARGET_WIDTH nếu ảnh nhỏ hơn
    if img.width < TARGET_WIDTH:
        ratio = TARGET_WIDTH / img.width
        new_size = (TARGET_WIDTH, round(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    # 2. Làm nét cạnh bằng Unsharp Mask
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=130, threshold=2))

    # 3. Tăng nhẹ tương phản & độ đậm màu để ảnh trông "sống" hơn
    img = ImageEnhance.Contrast(img).enhance(1.04)
    img = ImageEnhance.Color(img).enhance(1.06)

    # 4. Lưu đè lên file gốc (bản gốc đã được backup)
    img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return f"{orig_size[0]}x{orig_size[1]} -> {img.size[0]}x{img.size[1]}"


def main() -> None:
    if not SRC_DIR.exists():
        print(f"Không tìm thấy thư mục: {SRC_DIR}")
        return

    # Backup toàn bộ ảnh gốc (chỉ lần đầu)
    if not BACKUP_DIR.exists():
        BACKUP_DIR.mkdir(parents=True)
        for f in sorted(SRC_DIR.glob("*.jpg")):
            (BACKUP_DIR / f.name).write_bytes(f.read_bytes())
        print(f"Đã backup ảnh gốc vào: {BACKUP_DIR}")

    total = 0
    for f in sorted(SRC_DIR.glob("*.jpg")):
        try:
            info = process_image(f)
            print(f"  {f.name}: {info}")
            total += 1
        except Exception as exc:  # noqa: BLE001
            print(f"  LỖI {f.name}: {exc}")

    print(f"\nHoàn tất: đã xử lý {total} ảnh (width tối thiểu {TARGET_WIDTH}px, quality {JPEG_QUALITY})")


if __name__ == "__main__":
    main()
