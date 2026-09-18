// Ảnh nền thành phố cho hero.
//
// ✅ ĐỦ 34/34 tỉnh/thành trong public/images/cities/ (đuôi .png).
//
// Nếu thêm/sửa ảnh: giữ đúng tên file như bảng dưới (viết thường, dấu gạch ngang).
// Ảnh ngang tối thiểu 1200px rộng. Tỉnh chưa có ảnh → hero dùng gradient như cũ.
// Sau khi thêm/sửa ảnh chỉ cần F5 — không cần khởi động lại dev server.

function normalizeForMatch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .trim();
}

export const cityBackgrounds: Record<string, string> = {
  "Hà Nội": "/images/cities/thu-do-ha-noi.png",
  "Cao Bằng": "/images/cities/tinh-cao-bang.png",
  "Tuyên Quang": "/images/cities/tinh-tuyen-quang.png",
  "Điện Biên": "/images/cities/tinh-dien-bien.png",
  "Lai Châu": "/images/cities/tinh-lai-chau.png",
  "Sơn La": "/images/cities/tinh-son-la.png",
  "Lào Cai": "/images/cities/tinh-lao-cai.png",
  "Thái Nguyên": "/images/cities/tinh-thai-nguyen.png",
  "Lạng Sơn": "/images/cities/tinh-lang-son.png",
  "Quảng Ninh": "/images/cities/tinh-quang-ninh.png",
  "Bắc Ninh": "/images/cities/tinh-bac-ninh.png",
  "Phú Thọ": "/images/cities/tinh-phu-tho.png",
  "Hải Phòng": "/images/cities/thanh-pho-hai-phong.png",
  "Hưng Yên": "/images/cities/tinh-hung-yen.png",
  "Ninh Bình": "/images/cities/tinh-ninh-binh.png",
  "Thanh Hóa": "/images/cities/tinh-thanh-hoa.png",
  "Nghệ An": "/images/cities/tinh-nghe-an.png",
  "Hà Tĩnh": "/images/cities/tinh-ha-tinh.png",
  "Quảng Trị": "/images/cities/tinh-quang-tri.png",
  "Huế": "/images/cities/thanh-pho-hue.png",
  "Đà Nẵng": "/images/cities/thanh-pho-da-nang.png",
  "Quảng Ngãi": "/images/cities/tinh-quang-ngai.png",
  "Gia Lai": "/images/cities/tinh-gia-lai.png",
  "Khánh Hòa": "/images/cities/tinh-khanh-hoa.png",
  "Lâm Đồng": "/images/cities/tinh-lam-dong.png",
  "Đắk Lắk": "/images/cities/tinh-dak-lak.png",
  "Đồng Nai": "/images/cities/tinh-dong-nai.png",
  "Tây Ninh": "/images/cities/tinh-tay-ninh.png",
  "TP. Hồ Chí Minh": "/images/cities/thanh-pho-ho-chi-minh.png",
  "Đồng Tháp": "/images/cities/tinh-dong-thap.png",
  "Vĩnh Long": "/images/cities/tinh-vinh-long.png",
  "An Giang": "/images/cities/tinh-an-giang.png",
  "Cần Thơ": "/images/cities/thanh-pho-can-tho.png",
  "Cà Mau": "/images/cities/tinh-ca-mau.png",
};

// Tên khác khi geocoding trả về tên tiếng Anh / tên không dấu
const cityBackgroundAliases: Record<string, string[]> = {
  "TP. Hồ Chí Minh": ["ho chi minh", "saigon", "sai gon"],
  "Hà Nội": ["hanoi"],
  "Đà Nẵng": ["da nang", "danang"],
  "Cần Thơ": ["can tho", "cantho"],
};

// Trả về đường dẫn ảnh nền nếu locationName khớp 1 tỉnh/thành, ngược lại null.
// Ưu tiên khớp có tên dài nhất (chính xác nhất).
export function getCityBackgroundSrc(locationName: string): string | null {
  const normalized = normalizeForMatch(locationName);

  if (!normalized) {
    return null;
  }

  let bestName: string | null = null;
  let bestKeyLength = 0;

  for (const name of Object.keys(cityBackgrounds)) {
    const key = normalizeForMatch(name);
    const aliases = cityBackgroundAliases[name] ?? [];

    const matched =
      normalized.includes(key) ||
      aliases.some((alias) => normalized.includes(alias));

    if (matched && key.length > bestKeyLength) {
      bestName = name;
      bestKeyLength = key.length;
    }
  }

  return bestName ? cityBackgrounds[bestName] : null;
}
