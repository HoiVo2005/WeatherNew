"use client";

import dynamic from "next/dynamic";
import {
  Activity,
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Compass,
  Droplets,
  Eye,
  ExternalLink,
  Gauge,
  Heart,
  Languages,
  Layers3,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Plus,
  Menu,
  Moon,
  Navigation,
  Search,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Trash2,
  Umbrella,
  Wind,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Solar } from "lunar-javascript";

type HolidayName = {
  vi: string;
  en: string;
};

type HolidayVisual = {
  src: string;
  alt: {
    vi: string;
    en: string;
  };
};

const SOLAR_HOLIDAY_IMAGES: Record<string, HolidayVisual> = {
  "01-01": {
    src: "/holidays/tet-duong-lich.jpg",
    alt: {
      vi: "Tết Dương lịch",
      en: "New Year's Day",
    },
  },
  "01-09": {
    src: "/holidays/ngay-hoc-sinh-sinh-vien-viet-nam.jpg",
    alt: {
      vi: "Ngày Học sinh - Sinh viên Việt Nam",
      en: "Vietnamese Students' Day",
    },
  },
  "02-03": {
    src: "/holidays/ngay-thanh-lap-dang-cong-san-viet-nam.jpg",
    alt: {
      vi: "Ngày thành lập Đảng Cộng sản Việt Nam",
      en: "Communist Party of Vietnam Foundation Day",
    },
  },
  "02-14": {
    src: "/holidays/ngay-le-tinh-nhan.jpg",
    alt: {
      vi: "Ngày Lễ Tình nhân",
      en: "Valentine's Day",
    },
  },
  "02-27": {
    src: "/holidays/ngay-thay-thuoc-viet-nam.jpg",
    alt: {
      vi: "Ngày Thầy thuốc Việt Nam",
      en: "Vietnamese Doctors' Day",
    },
  },
  "03-08": {
    src: "/holidays/ngay-quoc-te-phu-nu.jpg",
    alt: {
      vi: "Ngày Quốc tế Phụ nữ",
      en: "International Women's Day",
    },
  },
  "03-20": {
    src: "/holidays/ngay-quoc-te-hanh-phuc.jpg",
    alt: {
      vi: "Ngày Quốc tế Hạnh phúc",
      en: "International Day of Happiness",
    },
  },
  "03-22": {
    src: "/holidays/ngay-nuoc-the-gioi.jpg",
    alt: {
      vi: "Ngày Nước Thế giới",
      en: "World Water Day",
    },
  },
  "03-26": {
    src: "/holidays/ngay-thanh-lap-doan-tncs-ho-chi-minh.jpg",
    alt: {
      vi: "Ngày thành lập Đoàn TNCS Hồ Chí Minh",
      en: "Ho Chi Minh Communist Youth Union Foundation Day",
    },
  },
  "04-01": {
    src: "/holidays/ngay-ca-thang-tu.jpg",
    alt: {
      vi: "Ngày Cá tháng Tư",
      en: "April Fools' Day",
    },
  },
  "04-07": {
    src: "/holidays/ngay-suc-khoe-the-gioi.jpg",
    alt: {
      vi: "Ngày Sức khỏe Thế giới",
      en: "World Health Day",
    },
  },
  "04-22": {
    src: "/holidays/ngay-trai-dat.jpg",
    alt: {
      vi: "Ngày Trái Đất",
      en: "Earth Day",
    },
  },
  "04-23": {
    src: "/holidays/ngay-sach-va-ban-quyen-the-gioi.jpg",
    alt: {
      vi: "Ngày Sách và Bản quyền Thế giới",
      en: "World Book and Copyright Day",
    },
  },
  "04-30": {
    src: "/holidays/ngay-giai-phong-mien-nam-thong-nhat-dat-nuoc.jpg",
    alt: {
      vi: "Ngày Giải phóng miền Nam, thống nhất đất nước",
      en: "Reunification Day",
    },
  },
  "05-01": {
    src: "/holidays/ngay-quoc-te-lao-dong.jpg",
    alt: {
      vi: "Ngày Quốc tế Lao động",
      en: "International Workers' Day",
    },
  },
  "05-07": {
    src: "/holidays/ngay-chien-thang-dien-bien-phu.jpg",
    alt: {
      vi: "Ngày Chiến thắng Điện Biên Phủ",
      en: "Dien Bien Phu Victory Day",
    },
  },
  "05-15": {
    src: "/holidays/ngay-quoc-te-gia-dinh.jpg",
    alt: {
      vi: "Ngày Quốc tế Gia đình",
      en: "International Day of Families",
    },
  },
  "05-19": {
    src: "/holidays/ngay-sinh-chu-tich-ho-chi-minh.jpg",
    alt: {
      vi: "Ngày sinh Chủ tịch Hồ Chí Minh",
      en: "President Ho Chi Minh's Birthday",
    },
  },
  "05-31": {
    src: "/holidays/ngay-the-gioi-khong-thuoc-la.jpg",
    alt: {
      vi: "Ngày Thế giới Không thuốc lá",
      en: "World No Tobacco Day",
    },
  },
  "06-01": {
    src: "/holidays/ngay-quoc-te-thieu-nhi.jpg",
    alt: {
      vi: "Ngày Quốc tế Thiếu nhi",
      en: "International Children's Day",
    },
  },
  "06-05": {
    src: "/holidays/ngay-moi-truong-the-gioi.jpg",
    alt: {
      vi: "Ngày Môi trường Thế giới",
      en: "World Environment Day",
    },
  },
  "06-08": {
    src: "/holidays/ngay-dai-duong-the-gioi.jpg",
    alt: {
      vi: "Ngày Đại dương Thế giới",
      en: "World Oceans Day",
    },
  },
  "06-21": {
    src: "/holidays/ngay-bao-chi-cach-mang-viet-nam.jpg",
    alt: {
      vi: "Ngày Báo chí Cách mạng Việt Nam",
      en: "Vietnam Revolutionary Press Day",
    },
  },
  "06-26": {
    src: "/holidays/ngay-quoc-te-phong-chong-ma-tuy.jpg",
    alt: {
      vi: "Ngày Quốc tế phòng, chống ma túy",
      en: "International Day against Drug Abuse and Illicit Trafficking",
    },
  },
  "06-28": {
    src: "/holidays/ngay-gia-dinh-viet-nam.jpg",
    alt: {
      vi: "Ngày Gia đình Việt Nam",
      en: "Vietnamese Family Day",
    },
  },
  "07-11": {
    src: "/holidays/ngay-dan-so-the-gioi.jpg",
    alt: {
      vi: "Ngày Dân số Thế giới",
      en: "World Population Day",
    },
  },
  "07-27": {
    src: "/holidays/ngay-thuong-binh-liet-si.jpg",
    alt: {
      vi: "Ngày Thương binh - Liệt sĩ",
      en: "Vietnam War Invalids and Martyrs Day",
    },
  },
  "07-28": {
    src: "/holidays/ngay-viem-gan-the-gioi.jpg",
    alt: {
      vi: "Ngày Viêm gan Thế giới",
      en: "World Hepatitis Day",
    },
  },
  "08-12": {
    src: "/holidays/ngay-quoc-te-thanh-nien.jpg",
    alt: {
      vi: "Ngày Quốc tế Thanh niên",
      en: "International Youth Day",
    },
  },
  "08-19": {
    src: "/holidays/ngay-cach-mang-thang-tam.jpg",
    alt: {
      vi: "Ngày Cách mạng Tháng Tám",
      en: "August Revolution Day",
    },
  },
  "09-02": {
    src: "/holidays/quoc-khanh-nuoc-cong-hoa-xa-hoi-chu-nghia-viet-nam.jpg",
    alt: {
      vi: "Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam",
      en: "Vietnam National Day",
    },
  },
  "09-05": {
    src: "/holidays/ngay-quoc-te-tu-thien.jpg",
    alt: {
      vi: "Ngày Quốc tế Từ thiện",
      en: "International Day of Charity",
    },
  },
  "09-08": {
    src: "/holidays/ngay-quoc-te-xoa-mu-chu.jpg",
    alt: {
      vi: "Ngày Quốc tế Xóa mù chữ",
      en: "International Literacy Day",
    },
  },
  "09-21": {
    src: "/holidays/ngay-quoc-te-hoa-binh.jpg",
    alt: {
      vi: "Ngày Quốc tế Hòa bình",
      en: "International Day of Peace",
    },
  },
  "09-27": {
    src: "/holidays/ngay-du-lich-the-gioi.jpg",
    alt: {
      vi: "Ngày Du lịch Thế giới",
      en: "World Tourism Day",
    },
  },
  "10-01": {
    src: "/holidays/ngay-quoc-te-nguoi-cao-tuoi.jpg",
    alt: {
      vi: "Ngày Quốc tế Người cao tuổi",
      en: "International Day of Older Persons",
    },
  },
  "10-05": {
    src: "/holidays/ngay-nha-giao-the-gioi.jpg",
    alt: {
      vi: "Ngày Nhà giáo Thế giới",
      en: "World Teachers' Day",
    },
  },
  "10-10": {
    src: "/holidays/ngay-giai-phong-thu-do.jpg",
    alt: {
      vi: "Ngày Giải phóng Thủ đô",
      en: "Hanoi Liberation Day",
    },
  },
  "10-13": {
    src: "/holidays/ngay-doanh-nhan-viet-nam.jpg",
    alt: {
      vi: "Ngày Doanh nhân Việt Nam",
      en: "Vietnamese Entrepreneurs' Day",
    },
  },
  "10-16": {
    src: "/holidays/ngay-luong-thuc-the-gioi.jpg",
    alt: {
      vi: "Ngày Lương thực Thế giới",
      en: "World Food Day",
    },
  },
  "10-20": {
    src: "/holidays/ngay-phu-nu-viet-nam.jpg",
    alt: {
      vi: "Ngày Phụ nữ Việt Nam",
      en: "Vietnamese Women's Day",
    },
  },
  "10-24": {
    src: "/holidays/ngay-lien-hop-quoc.jpg",
    alt: {
      vi: "Ngày Liên Hợp Quốc",
      en: "United Nations Day",
    },
  },
  "10-31": {
    src: "/holidays/le-hoi-halloween.jpg",
    alt: {
      vi: "Lễ hội Halloween",
      en: "Halloween",
    },
  },
  "11-09": {
    src: "/holidays/ngay-phap-luat-viet-nam.jpg",
    alt: {
      vi: "Ngày Pháp luật Việt Nam",
      en: "Vietnam Law Day",
    },
  },
  "11-14": {
    src: "/holidays/ngay-dai-thao-duong-the-gioi.jpg",
    alt: {
      vi: "Ngày Đái tháo đường Thế giới",
      en: "World Diabetes Day",
    },
  },
  "11-19": {
    src: "/holidays/ngay-quoc-te-nam-gioi.jpg",
    alt: {
      vi: "Ngày Quốc tế Nam giới",
      en: "International Men's Day",
    },
  },
  "11-20": {
    src: "/holidays/ngay-nha-giao-viet-nam.jpg",
    alt: {
      vi: "Ngày Nhà giáo Việt Nam",
      en: "Vietnamese Teachers' Day",
    },
  },
  "11-25": {
    src: "/holidays/ngay-quoc-te-xoa-bo-bao-luc-doi-voi-phu-nu.jpg",
    alt: {
      vi: "Ngày Quốc tế xóa bỏ bạo lực đối với phụ nữ",
      en: "International Day for the Elimination of Violence against Women",
    },
  },
  "12-01": {
    src: "/holidays/ngay-the-gioi-phong-chong-aids.jpg",
    alt: {
      vi: "Ngày Thế giới phòng, chống AIDS",
      en: "World AIDS Day",
    },
  },
  "12-03": {
    src: "/holidays/ngay-quoc-te-nguoi-khuyet-tat.jpg",
    alt: {
      vi: "Ngày Quốc tế Người khuyết tật",
      en: "International Day of Persons with Disabilities",
    },
  },
  "12-05": {
    src: "/holidays/ngay-tinh-nguyen-vien-quoc-te.jpg",
    alt: {
      vi: "Ngày Tình nguyện viên Quốc tế",
      en: "International Volunteer Day",
    },
  },
  "12-10": {
    src: "/holidays/ngay-nhan-quyen-quoc-te.jpg",
    alt: {
      vi: "Ngày Nhân quyền Quốc tế",
      en: "Human Rights Day",
    },
  },
  "12-22": {
    src: "/holidays/ngay-thanh-lap-quan-doi-nhan-dan-viet-nam.jpg",
    alt: {
      vi: "Ngày thành lập Quân đội Nhân dân Việt Nam",
      en: "Vietnam People's Army Foundation Day",
    },
  },
  "12-24": {
    src: "/holidays/dem-giang-sinh.jpg",
    alt: {
      vi: "Đêm Giáng sinh",
      en: "Christmas Eve",
    },
  },
  "12-25": {
    src: "/holidays/le-giang-sinh.jpg",
    alt: {
      vi: "Lễ Giáng sinh",
      en: "Christmas Day",
    },
  },
  "12-31": {
    src: "/holidays/dem-giao-thua-duong-lich.jpg",
    alt: {
      vi: "Đêm Giao thừa Dương lịch",
      en: "New Year's Eve",
    },
  },
};

const LUNAR_NEW_YEAR_EVE_IMAGE: HolidayVisual = {
  src: "/holidays/dem-giao-thua-am-lich.jpg",
  alt: {
    vi: "Đêm Giao thừa Âm lịch",
    en: "Lunar New Year's Eve",
  },
};

const LUNAR_HOLIDAY_IMAGES: Record<string, HolidayVisual> = {
  "01-01": {
    src: "/holidays/tet-mung-1.jpg",
    alt: {
      vi: "Tết Nguyên Đán",
      en: "Lunar New Year",
    },
  },
  "01-02": {
    src: "/holidays/tet-mung-2.jpg",
    alt: {
      vi: "Mùng 2 Tết Nguyên Đán",
      en: "Second day of Lunar New Year",
    },
  },
  "01-03": {
    src: "/holidays/tet-mung-3.jpg",
    alt: {
      vi: "Mùng 3 Tết Nguyên Đán",
      en: "Third day of Lunar New Year",
    },
  },
  "01-10": {
    src: "/holidays/via-than-tai.jpg",
    alt: {
      vi: "Ngày Vía Thần Tài",
      en: "God of Wealth Day",
    },
  },
  "01-15": {
    src: "/holidays/tet-nguyen-tieu.jpg",
    alt: {
      vi: "Tết Nguyên Tiêu",
      en: "Lantern Festival",
    },
  },
  "03-03": {
    src: "/holidays/tet-han-thuc.jpg",
    alt: {
      vi: "Tết Hàn Thực",
      en: "Cold Food Festival",
    },
  },
  "03-10": {
    src: "/holidays/gio-to-hung-vuong.jpg",
    alt: {
      vi: "Giỗ Tổ Hùng Vương",
      en: "Hung Kings Commemoration Day",
    },
  },
  "04-15": {
    src: "/holidays/le-phat-dan.jpg",
    alt: {
      vi: "Lễ Phật Đản",
      en: "Vesak Day",
    },
  },
  "05-05": {
    src: "/holidays/tet-doan-ngo.jpg",
    alt: {
      vi: "Tết Đoan Ngọ",
      en: "Dragon Boat Festival",
    },
  },
  "07-07": {
    src: "/holidays/le-that-tich.jpg",
    alt: {
      vi: "Lễ Thất Tịch",
      en: "Qixi Festival",
    },
  },
  "07-15": {
    src: "/holidays/le-vu-lan.jpg",
    alt: {
      vi: "Lễ Vu Lan",
      en: "Vu Lan Festival",
    },
  },
  "08-15": {
    src: "/holidays/tet-trung-thu.jpg",
    alt: {
      vi: "Tết Trung Thu",
      en: "Mid-Autumn Festival",
    },
  },
  "09-09": {
    src: "/holidays/tet-trung-cuu.jpg",
    alt: {
      vi: "Tết Trùng Cửu",
      en: "Double Ninth Festival",
    },
  },
  "10-10": {
    src: "/holidays/tet-trung-thap.jpg",
    alt: {
      vi: "Tết Trùng Thập",
      en: "Double Tenth Festival",
    },
  },
  "12-23": {
    src: "/holidays/tet-ong-cong-ong-tao.jpg",
    alt: {
      vi: "Tết Ông Công Ông Táo",
      en: "Kitchen Gods Festival",
    },
  },
};

const DYNAMIC_HOLIDAY_IMAGES: Record<string, HolidayVisual> = {
  "easter": {
    src: "/holidays/le-phuc-sinh.jpg",
    alt: {
      vi: "Lễ Phục Sinh",
      en: "Easter Sunday",
    },
  },
  "mothers-day": {
    src: "/holidays/ngay-cua-me.jpg",
    alt: {
      vi: "Ngày của Mẹ",
      en: "Mother's Day",
    },
  },
  "fathers-day": {
    src: "/holidays/ngay-cua-cha.jpg",
    alt: {
      vi: "Ngày của Cha",
      en: "Father's Day",
    },
  },
  "earth-hour": {
    src: "/holidays/gio-trai-dat.jpg",
    alt: {
      vi: "Giờ Trái Đất",
      en: "Earth Hour",
    },
  },
};

function getDynamicHolidayImageKey(date: Date): string | null {
  const year = date.getFullYear();

  if (isSameDate(date, getEasterDate(year))) {
    return "easter";
  }

  if (isSameDate(date, getNthWeekdayOfMonth(year, 4, 0, 2))) {
    return "mothers-day";
  }

  if (isSameDate(date, getNthWeekdayOfMonth(year, 5, 0, 3))) {
    return "fathers-day";
  }

  if (isSameDate(date, getLastWeekdayOfMonth(year, 2, 6))) {
    return "earth-hour";
  }

  return null;
}

function getHolidayVisual(
  date: Date,
  language: "vi" | "en",
): { src: string; alt: string } | null {
  // Kiểm tra Giao thừa âm lịch trước
  if (isLunarNewYearEve(date)) {
    return {
      src: LUNAR_NEW_YEAR_EVE_IMAGE.src,
      alt: LUNAR_NEW_YEAR_EVE_IMAGE.alt[language],
    };
  }

  const lunarVisual = LUNAR_HOLIDAY_IMAGES[getLunarKey(date)];

  if (lunarVisual) {
    return {
      src: lunarVisual.src,
      alt: lunarVisual.alt[language],
    };
  }

  const solarVisual = SOLAR_HOLIDAY_IMAGES[getDateKey(date)];

  if (solarVisual) {
    return {
      src: solarVisual.src,
      alt: solarVisual.alt[language],
    };
  }

  const dynamicKey = getDynamicHolidayImageKey(date);

  const dynamicVisual = dynamicKey
    ? DYNAMIC_HOLIDAY_IMAGES[dynamicKey]
    : undefined;

  if (dynamicVisual) {
    return {
      src: dynamicVisual.src,
      alt: dynamicVisual.alt[language],
    };
  }

  return null;
}

const SOLAR_HOLIDAYS: Record<string, HolidayName[]> = {
  "01-01": [
    { vi: "Tết Dương lịch", en: "New Year's Day" },
  ],
  "01-09": [
    { vi: "Ngày Học sinh - Sinh viên Việt Nam", en: "Vietnamese Students' Day" },
  ],
  "02-03": [
    { vi: "Ngày thành lập Đảng Cộng sản Việt Nam", en: "Communist Party of Vietnam Foundation Day" },
  ],
  "02-14": [
    { vi: "Ngày Lễ Tình nhân", en: "Valentine's Day" },
  ],
  "02-27": [
    { vi: "Ngày Thầy thuốc Việt Nam", en: "Vietnamese Doctors' Day" },
  ],
  "03-08": [
    { vi: "Ngày Quốc tế Phụ nữ", en: "International Women's Day" },
  ],
  "03-20": [
    { vi: "Ngày Quốc tế Hạnh phúc", en: "International Day of Happiness" },
  ],
  "03-22": [
    { vi: "Ngày Nước Thế giới", en: "World Water Day" },
  ],
  "03-26": [
    { vi: "Ngày thành lập Đoàn TNCS Hồ Chí Minh", en: "Ho Chi Minh Communist Youth Union Foundation Day" },
  ],
  "04-01": [
    { vi: "Ngày Cá tháng Tư", en: "April Fools' Day" },
  ],
  "04-07": [
    { vi: "Ngày Sức khỏe Thế giới", en: "World Health Day" },
  ],
  "04-22": [
    { vi: "Ngày Trái Đất", en: "Earth Day" },
  ],
  "04-23": [
    { vi: "Ngày Sách và Bản quyền Thế giới", en: "World Book and Copyright Day" },
  ],
  "04-30": [
    { vi: "Ngày Giải phóng miền Nam, thống nhất đất nước", en: "Reunification Day" },
  ],
  "05-01": [
    { vi: "Ngày Quốc tế Lao động", en: "International Workers' Day" },
  ],
  "05-07": [
    { vi: "Ngày Chiến thắng Điện Biên Phủ", en: "Dien Bien Phu Victory Day" },
  ],
  "05-15": [
    { vi: "Ngày Quốc tế Gia đình", en: "International Day of Families" },
  ],
  "05-19": [
    { vi: "Ngày sinh Chủ tịch Hồ Chí Minh", en: "President Ho Chi Minh's Birthday" },
  ],
  "05-31": [
    { vi: "Ngày Thế giới Không thuốc lá", en: "World No Tobacco Day" },
  ],
  "06-01": [
    { vi: "Ngày Quốc tế Thiếu nhi", en: "International Children's Day" },
  ],
  "06-05": [
    { vi: "Ngày Môi trường Thế giới", en: "World Environment Day" },
  ],
  "06-08": [
    { vi: "Ngày Đại dương Thế giới", en: "World Oceans Day" },
  ],
  "06-21": [
    { vi: "Ngày Báo chí Cách mạng Việt Nam", en: "Vietnam Revolutionary Press Day" },
  ],
  "06-26": [
    { vi: "Ngày Quốc tế phòng, chống ma túy", en: "International Day against Drug Abuse and Illicit Trafficking" },
  ],
  "06-28": [
    { vi: "Ngày Gia đình Việt Nam", en: "Vietnamese Family Day" },
  ],
  "07-11": [
    { vi: "Ngày Dân số Thế giới", en: "World Population Day" },
  ],
  "07-27": [
    { vi: "Ngày Thương binh - Liệt sĩ", en: "Vietnam War Invalids and Martyrs Day" },
  ],
  "07-28": [
    { vi: "Ngày Viêm gan Thế giới", en: "World Hepatitis Day" },
  ],
  "08-12": [
    { vi: "Ngày Quốc tế Thanh niên", en: "International Youth Day" },
  ],
  "08-19": [
    { vi: "Ngày Cách mạng Tháng Tám", en: "August Revolution Day" },
  ],
  "09-02": [
    { vi: "Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam", en: "Vietnam National Day" },
  ],
  "09-05": [
    { vi: "Ngày Quốc tế Từ thiện", en: "International Day of Charity" },
  ],
  "09-08": [
    { vi: "Ngày Quốc tế Xóa mù chữ", en: "International Literacy Day" },
  ],
  "09-21": [
    { vi: "Ngày Quốc tế Hòa bình", en: "International Day of Peace" },
  ],
  "09-27": [
    { vi: "Ngày Du lịch Thế giới", en: "World Tourism Day" },
  ],
  "10-01": [
    { vi: "Ngày Quốc tế Người cao tuổi", en: "International Day of Older Persons" },
  ],
  "10-05": [
    { vi: "Ngày Nhà giáo Thế giới", en: "World Teachers' Day" },
  ],
  "10-10": [
    { vi: "Ngày Giải phóng Thủ đô", en: "Hanoi Liberation Day" },
    { vi: "Ngày Sức khỏe Tâm thần Thế giới", en: "World Mental Health Day" },
  ],
  "10-13": [
    { vi: "Ngày Doanh nhân Việt Nam", en: "Vietnamese Entrepreneurs' Day" },
  ],
  "10-16": [
    { vi: "Ngày Lương thực Thế giới", en: "World Food Day" },
  ],
  "10-20": [
    { vi: "Ngày Phụ nữ Việt Nam", en: "Vietnamese Women's Day" },
  ],
  "10-24": [
    { vi: "Ngày Liên Hợp Quốc", en: "United Nations Day" },
  ],
  "10-31": [
    { vi: "Lễ hội Halloween", en: "Halloween" },
  ],
  "11-09": [
    { vi: "Ngày Pháp luật Việt Nam", en: "Vietnam Law Day" },
  ],
  "11-14": [
    { vi: "Ngày Đái tháo đường Thế giới", en: "World Diabetes Day" },
  ],
  "11-19": [
    { vi: "Ngày Quốc tế Nam giới", en: "International Men's Day" },
  ],
  "11-20": [
    { vi: "Ngày Nhà giáo Việt Nam", en: "Vietnamese Teachers' Day" },
    { vi: "Ngày Trẻ em Thế giới", en: "World Children's Day" },
  ],
  "11-25": [
    { vi: "Ngày Quốc tế xóa bỏ bạo lực đối với phụ nữ", en: "International Day for the Elimination of Violence against Women" },
  ],
  "12-01": [
    { vi: "Ngày Thế giới phòng, chống AIDS", en: "World AIDS Day" },
  ],
  "12-03": [
    { vi: "Ngày Quốc tế Người khuyết tật", en: "International Day of Persons with Disabilities" },
  ],
  "12-05": [
    { vi: "Ngày Tình nguyện viên Quốc tế", en: "International Volunteer Day" },
  ],
  "12-10": [
    { vi: "Ngày Nhân quyền Quốc tế", en: "Human Rights Day" },
  ],
  "12-22": [
    { vi: "Ngày thành lập Quân đội Nhân dân Việt Nam", en: "Vietnam People's Army Foundation Day" },
  ],
  "12-24": [
    { vi: "Đêm Giáng sinh", en: "Christmas Eve" },
  ],
  "12-25": [
    { vi: "Lễ Giáng sinh", en: "Christmas Day" },
  ],
  "12-31": [
    { vi: "Đêm Giao thừa Dương lịch", en: "New Year's Eve" },
  ],
};

const LUNAR_HOLIDAYS: Record<string, HolidayName[]> = {
  "01-01": [
    { vi: "Tết Nguyên Đán", en: "Lunar New Year" },
  ],
  "01-02": [
    { vi: "Mùng 2 Tết Nguyên Đán", en: "Second day of Lunar New Year" },
  ],
  "01-03": [
    { vi: "Mùng 3 Tết Nguyên Đán", en: "Third day of Lunar New Year" },
  ],
  "01-10": [
    { vi: "Ngày Vía Thần Tài", en: "God of Wealth Day" },
  ],
  "01-15": [
    { vi: "Tết Nguyên Tiêu", en: "Lantern Festival" },
  ],
  "03-03": [
    { vi: "Tết Hàn Thực", en: "Cold Food Festival" },
  ],
  "03-10": [
    { vi: "Giỗ Tổ Hùng Vương", en: "Hung Kings Commemoration Day" },
  ],
  "04-15": [
    { vi: "Lễ Phật Đản", en: "Vesak Day" },
  ],
  "05-05": [
    { vi: "Tết Đoan Ngọ", en: "Dragon Boat Festival" },
  ],
  "07-07": [
    { vi: "Lễ Thất Tịch", en: "Qixi Festival" },
  ],
  "07-15": [
    { vi: "Lễ Vu Lan", en: "Vu Lan Festival" },
  ],
  "08-15": [
    { vi: "Tết Trung Thu", en: "Mid-Autumn Festival" },
  ],
  "09-09": [
    { vi: "Tết Trùng Cửu", en: "Double Ninth Festival" },
  ],
  "10-10": [
    { vi: "Tết Trùng Thập", en: "Double Tenth Festival" },
  ],
  "12-23": [
    { vi: "Tết Ông Công Ông Táo", en: "Kitchen Gods Festival" },
  ],
};

function getDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function getLunarKey(date: Date) {
  const lunar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ).getLunar();

  const month = String(Math.abs(lunar.getMonth())).padStart(2, "0");
  const day = String(lunar.getDay()).padStart(2, "0");
  return `${month}-${day}`;
}

function isLunarNewYearEve(date: Date) {
  const currentSolar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  const currentLunar = currentSolar.getLunar();

  const nextDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  );

  const nextLunar = Solar.fromYmd(
    nextDate.getFullYear(),
    nextDate.getMonth() + 1,
    nextDate.getDate(),
  ).getLunar();

  return (
    Math.abs(currentLunar.getMonth()) === 12 &&
    Math.abs(nextLunar.getMonth()) === 1 &&
    nextLunar.getDay() === 1
  );
}

function getEasterDate(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getNthWeekdayOfMonth(
  year: number,
  monthIndex: number,
  weekday: number,
  occurrence: number,
) {
  const first = new Date(year, monthIndex, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, monthIndex, 1 + offset + (occurrence - 1) * 7);
}

function getLastWeekdayOfMonth(
  year: number,
  monthIndex: number,
  weekday: number,
) {
  const last = new Date(year, monthIndex + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, monthIndex, last.getDate() - offset);
}

function getDynamicHolidays(date: Date): HolidayName[] {
  const year = date.getFullYear();
  const holidays: HolidayName[] = [];

  if (isSameDate(date, getEasterDate(year))) {
    holidays.push({ vi: "Lễ Phục Sinh", en: "Easter Sunday" });
  }

  if (isSameDate(date, getNthWeekdayOfMonth(year, 4, 0, 2))) {
    holidays.push({ vi: "Ngày của Mẹ", en: "Mother's Day" });
  }

  if (isSameDate(date, getNthWeekdayOfMonth(year, 5, 0, 3))) {
    holidays.push({ vi: "Ngày của Cha", en: "Father's Day" });
  }

  if (isSameDate(date, getLastWeekdayOfMonth(year, 2, 6))) {
    holidays.push({ vi: "Giờ Trái Đất", en: "Earth Hour" });
  }

  return holidays;
}

function getCalendarHolidays(
  date: Date,
  language: "vi" | "en",
): string[] {
  const solarHolidays = SOLAR_HOLIDAYS[getDateKey(date)] ?? [];
  const lunarHolidays = LUNAR_HOLIDAYS[getLunarKey(date)] ?? [];
  const dynamicHolidays = getDynamicHolidays(date);

  const lunarNewYearEve: HolidayName[] = isLunarNewYearEve(date)
    ? [
        {
          vi: "Đêm Giao thừa Âm lịch",
          en: "Lunar New Year's Eve",
        },
      ]
    : [];

  return [
    ...solarHolidays,
    ...lunarHolidays,
    ...lunarNewYearEve,
    ...dynamicHolidays,
  ].map((holiday) => holiday[language]);
}

function getSolarHoliday(
  date: Date,
  language: "vi" | "en" = "vi",
) {
  const holidays = getCalendarHolidays(date, language);
  return holidays.length > 0 ? holidays.join(" • ") : null;
}

const WeatherMap = dynamic(() => import("@/components/WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <LoaderCircle className="spin" size={30} />
      <span>Đang tải bản đồ...</span>
    </div>
  ),
});

type Language = "vi" | "en";
type Theme = "light" | "dark";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationResult = {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type CurrentWeather = {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  dew_point_2m: number;
  visibility: number;
  is_day: number;
};

type HourlyWeather = {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
};

type DailyWeather = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  wind_gusts_10m_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  daylight_duration: number[];
  sunshine_duration: number[];
  sunrise: string[];
  sunset: string[];
};

type WeatherResponse = {
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
};

type AirQualityResponse = {
  hourly: {
    time: string[];
    european_aqi: number[];
    pm10: number[];
    pm2_5: number[];
    carbon_monoxide: number[];
    nitrogen_dioxide: number[];
    sulphur_dioxide: number[];
    ozone: number[];
  };
};

type FavoriteLocation = Coordinates & {
  name: string;
};

type TemperatureUnit = "celsius" | "fahrenheit";
type WindUnit = "kmh" | "ms";
type WindyOverlay = "wind" | "gust" | "rain" | "radar" | "waves" | "satellite";

const defaultCoordinates: Coordinates = {
  latitude: 10.8231,
  longitude: 106.6297,
};

const translations = {
  vi: {
    appName: "Thời tiết hôm nay",
    home: "Tổng quan",
    map: "Bản đồ",
    forecast: "Dự báo",
    searchPlaceholder: "Tìm theo tên tỉnh, thành phố hoặc địa điểm...",
    search: "Tìm kiếm",
    currentLocation: "Vị trí của tôi",
    today: "Hôm nay",
    previousDay: "Ngày trước",
    nextDay: "Ngày sau",
    backToToday: "Quay lại hôm nay",
    feelsLike: "Cảm giác như",
    humidity: "Độ ẩm",
    wind: "Gió",
    pressure: "Áp suất",
    visibility: "Tầm nhìn",
    clouds: "Mây che phủ",
    precipitation: "Lượng mưa",
    hourlyForecast: "Dự báo theo giờ",
    sevenDayForecast: "Dự báo 7 ngày",
    weatherMap: "Bản đồ thời tiết",
    sunrise: "Mặt trời mọc",
    sunset: "Mặt trời lặn",
    lunarCalendar: "Lịch âm",
    solarCalendar: "Dương lịch",
    coordinates: "Tọa độ",
    loading: "Đang cập nhật thời tiết...",
    locationPermission:
      "Không lấy được vị trí. Hãy cho phép trình duyệt truy cập vị trí.",
    searchEmpty: "Không tìm thấy địa điểm phù hợp.",
    selectLocation: "Chọn địa điểm",
    updated: "Cập nhật thời tiết mỗi giờ theo vị trí",
    light: "Sáng",
    dark: "Tối",
    tet: "Tết Nguyên Đán",
    armyDay: "Ngày truyền thống QĐND Việt Nam",
  },
  en: {
    appName: "WeatherNow",
    home: "Overview",
    map: "Map",
    forecast: "Forecast",
    searchPlaceholder: "Search province, city or location...",
    search: "Search",
    currentLocation: "My location",
    today: "Today",
    previousDay: "Previous day",
    nextDay: "Next day",
    backToToday: "Back to today",
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    visibility: "Visibility",
    clouds: "Cloud cover",
    precipitation: "Precipitation",
    hourlyForecast: "Hourly forecast",
    sevenDayForecast: "7-day forecast",
    weatherMap: "Weather map",
    sunrise: "Sunrise",
    sunset: "Sunset",
    lunarCalendar: "Lunar calendar",
    solarCalendar: "Solar calendar",
    coordinates: "Coordinates",
    loading: "Updating weather...",
    locationPermission:
      "Unable to get your position. Please allow location access.",
    searchEmpty: "No matching location was found.",
    selectLocation: "Select location",
    updated: "Weather updated hourly by location",
    light: "Light",
    dark: "Dark",
    tet: "Lunar New Year",
    armyDay: "Vietnam People's Army Day",
  },
} as const;

const weatherDescriptions: Record<number, { vi: string; en: string }> = {
  0: { vi: "Trời quang", en: "Clear sky" },
  1: { vi: "Chủ yếu trời quang", en: "Mainly clear" },
  2: { vi: "Có mây rải rác", en: "Partly cloudy" },
  3: { vi: "Nhiều mây", en: "Overcast" },
  45: { vi: "Có sương mù", en: "Foggy" },
  48: { vi: "Sương mù đóng băng", en: "Rime fog" },
  51: { vi: "Mưa phùn nhẹ", en: "Light drizzle" },
  53: { vi: "Mưa phùn", en: "Drizzle" },
  55: { vi: "Mưa phùn dày", en: "Dense drizzle" },
  61: { vi: "Mưa nhẹ", en: "Light rain" },
  63: { vi: "Có mưa", en: "Moderate rain" },
  65: { vi: "Mưa lớn", en: "Heavy rain" },
  80: { vi: "Mưa rào nhẹ", en: "Light showers" },
  81: { vi: "Mưa rào", en: "Rain showers" },
  82: { vi: "Mưa rào lớn", en: "Heavy showers" },
  95: { vi: "Có giông", en: "Thunderstorm" },
  96: { vi: "Giông kèm mưa đá", en: "Thunderstorm with hail" },
  99: { vi: "Giông mạnh", en: "Severe thunderstorm" },
};

function WeatherIcon({
  code,
  size = 42,
  className = "",
}: {
  code: number;
  size?: number;
  className?: string;
}) {
  if ([95, 96, 99].includes(code)) {
    return (
      <CloudLightning
        size={size}
        className={`weather-icon storm ${className}`}
      />
    );
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return (
      <CloudRain size={size} className={`weather-icon rain ${className}`} />
    );
  }

  if ([45, 48].includes(code)) {
    return <CloudFog size={size} className={`weather-icon fog ${className}`} />;
  }

  if ([2, 3].includes(code)) {
    return (
      <CloudSun size={size} className={`weather-icon cloudy ${className}`} />
    );
  }

  if (code === 1) {
    return (
      <CloudSun
        size={size}
        className={`weather-icon partly-cloudy ${className}`}
      />
    );
  }

  return <Sun size={size} className={`weather-icon sunny ${className}`} />;
}

function getWeatherDescription(code: number, language: Language) {
  return (
    weatherDescriptions[code]?.[language] ??
    (language === "vi" ? "Thời tiết thay đổi" : "Variable weather")
  );
}

type WeatherScene =
  | "clear-day"
  | "clear-night"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "heavy-rain"
  | "storm";

function getWeatherScene(code: number, isDay: number): WeatherScene {
  const daytime = isDay === 1;

  if ([95, 96, 99].includes(code)) {
    return "storm";
  }

  if ([65, 82].includes(code)) {
    return "heavy-rain";
  }

  if ([61, 63, 80, 81].includes(code)) {
    return "rain";
  }

  if ([51, 53, 55].includes(code)) {
    return "drizzle";
  }

  if ([45, 48].includes(code)) {
    return "fog";
  }

  if (code === 3) {
    return "overcast";
  }

  if ([1, 2].includes(code)) {
    return daytime ? "partly-cloudy-day" : "partly-cloudy-night";
  }

  return daytime ? "clear-day" : "clear-night";
}

function getWindDirection(degrees: number) {
  const directions = ["B", "ĐB", "Đ", "ĐN", "N", "TN", "T", "TB"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function formatDuration(seconds: number, language: Language) {
  if (!Number.isFinite(seconds)) return "--";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  return language === "vi"
    ? `${hours} giờ ${minutes} phút`
    : `${hours}h ${minutes}m`;
}

function getDewPointLabel(value: number, language: Language) {
  if (value >= 24) {
    return language === "vi" ? "Rất oi bức" : "Very muggy";
  }

  if (value >= 20) {
    return language === "vi" ? "Oi bức" : "Muggy";
  }

  if (value >= 16) {
    return language === "vi" ? "Hơi ẩm" : "Slightly humid";
  }

  if (value >= 10) {
    return language === "vi" ? "Dễ chịu" : "Comfortable";
  }

  return language === "vi" ? "Khô ráo" : "Dry";
}

function formatDay(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    weekday: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatDate(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function isSameDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatHourlyUpdateLabel(date: Date, language: Language) {
  const roundedHour = new Date(date);
  roundedHour.setMinutes(0, 0, 0);

  const time = new Intl.DateTimeFormat(
    language === "vi" ? "vi-VN" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(roundedHour);

  const weekday = new Intl.DateTimeFormat(
    language === "vi" ? "vi-VN" : "en-US",
    {
      weekday: "long",
    },
  ).format(roundedHour);

  if (language === "vi") {
    const normalizedWeekday =
      weekday.charAt(0).toUpperCase() + weekday.slice(1);

    return `${normalizedWeekday} ${time}`;
  }

  return `${weekday} ${time}`;
}

function formatApiTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getLunarDate(date: Date, language: Language) {
  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  const lunar = solar.getLunar();

  if (language === "en") {
    return `${lunar.getDay()}/${lunar.getMonth()}/${lunar.getYear()}`;
  }

  return `${lunar.getDay()}/${lunar.getMonth()} năm ${lunar.getYear()}`;
}

function getLunarDayLabel(date: Date) {
  const lunar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ).getLunar();

  return `${lunar.getDay()}/${Math.abs(lunar.getMonth())}`;
}

function getCalendarNote(date: Date, language: Language) {
  return getCalendarHolidays(date, language).join(" • ");
}

async function fetchPlaceName(
  latitude: number,
  longitude: number,
  language: Language,
) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=${language}`,
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();
    const address = data.address ?? {};

    return (
      address.city ||
      address.town ||
      address.county ||
      address.state ||
      address.village ||
      data.display_name?.split(",")[0] ||
      `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
    );
  } catch {
    return `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
  }
}


export default function HomePage() {
  const [language, setLanguage] = useState<Language>("vi");
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [readAlertSignature, setReadAlertSignature] = useState("");
  const [windyOverlay, setWindyOverlay] = useState<WindyOverlay>("wind");

  const [coordinates, setCoordinates] = useState<Coordinates>(
    defaultCoordinates,
  );
  const [locationName, setLocationName] = useState("TP. Hồ Chí Minh");

  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityResponse | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>("celsius");
  const [windUnit, setWindUnit] = useState<WindUnit>("kmh");
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [currentTime, setCurrentTime] = useState<Date>(
    () => new Date("2000-01-01T00:00:00.000Z"),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const text = translations[language];
  const isSelectedToday = isSameDate(selectedDate, currentTime);
  const isHydrated = hasMounted;
  const selectedHoliday = getSolarHoliday(selectedDate, language);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedTheme = window.localStorage.getItem("weather-theme");
      const savedLanguage = window.localStorage.getItem("weather-language");
      const savedLocation = window.localStorage.getItem("weather-location");
      const savedUnits = window.localStorage.getItem("weather-units");
      const savedFavorites = window.localStorage.getItem("weather-favorites");
      const savedReadAlerts = window.localStorage.getItem(
        "weather-read-alert-signature",
      );

      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }

      if (savedLanguage === "vi" || savedLanguage === "en") {
        setLanguage(savedLanguage);
      }

      if (savedLocation) {
        try {
          const parsed: unknown = JSON.parse(savedLocation);

          if (
            typeof parsed === "object" &&
            parsed !== null &&
            "latitude" in parsed &&
            "longitude" in parsed
          ) {
            const location = parsed as {
              latitude?: unknown;
              longitude?: unknown;
              name?: unknown;
            };

            if (
              typeof location.latitude === "number" &&
              typeof location.longitude === "number"
            ) {
              setCoordinates({
                latitude: location.latitude,
                longitude: location.longitude,
              });
            }

            if (typeof location.name === "string") {
              setLocationName(location.name);
            }
          }
        } catch {
          window.localStorage.removeItem("weather-location");
        }
      }

      if (savedUnits) {
        try {
          const parsed: unknown = JSON.parse(savedUnits);

          if (typeof parsed === "object" && parsed !== null) {
            const units = parsed as {
              temperatureUnit?: unknown;
              windUnit?: unknown;
            };

            if (
              units.temperatureUnit === "celsius" ||
              units.temperatureUnit === "fahrenheit"
            ) {
              setTemperatureUnit(units.temperatureUnit);
            }

            if (units.windUnit === "kmh" || units.windUnit === "ms") {
              setWindUnit(units.windUnit);
            }
          }
        } catch {
          window.localStorage.removeItem("weather-units");
        }
      }

      if (savedFavorites) {
        try {
          const parsed: unknown = JSON.parse(savedFavorites);

          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          } else {
            window.localStorage.removeItem("weather-favorites");
          }
        } catch {
          window.localStorage.removeItem("weather-favorites");
        }
      }

      if (savedReadAlerts) {
        setReadAlertSignature(savedReadAlerts);
      }

      // Đánh dấu hoàn tất khôi phục dữ liệu sau khi component đã mount.
      setHasMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("weather-theme", theme);
  }, [hasMounted, theme]);

  useEffect(() => {
    if (!hasMounted) return;

    window.localStorage.setItem("weather-language", language);
  }, [hasMounted, language]);

  useEffect(() => {
    if (!hasMounted) return;

    window.localStorage.setItem(
      "weather-units",
      JSON.stringify({ temperatureUnit, windUnit }),
    );
  }, [hasMounted, temperatureUnit, windUnit]);

  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date());
    };

    window.setTimeout(tick, 0);

    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    setError("");

    try {
      const parameters = new URLSearchParams({
        latitude: String(coordinates.latitude),
        longitude: String(coordinates.longitude),
        timezone: "auto",
        forecast_days: "7",
        temperature_unit: temperatureUnit,
        wind_speed_unit: windUnit,
        current: [
          "temperature_2m",
          "apparent_temperature",
          "relative_humidity_2m",
          "precipitation",
          "weather_code",
          "cloud_cover",
          "pressure_msl",
          "wind_speed_10m",
          "wind_direction_10m",
          "wind_gusts_10m",
          "dew_point_2m",
          "visibility",
          "is_day",
        ].join(","),
        hourly: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "precipitation_probability",
          "weather_code",
          "wind_speed_10m",
          "wind_gusts_10m",
          "uv_index",
        ].join(","),
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_probability_max",
          "uv_index_max",
          "wind_gusts_10m_max",
          "precipitation_sum",
          "rain_sum",
          "daylight_duration",
          "sunshine_duration",
          "sunrise",
          "sunset",
        ].join(","),
      });

      const airParameters = new URLSearchParams({
        latitude: String(coordinates.latitude),
        longitude: String(coordinates.longitude),
        timezone: "auto",
        forecast_days: "5",
        hourly: [
          "european_aqi",
          "pm10",
          "pm2_5",
          "carbon_monoxide",
          "nitrogen_dioxide",
          "sulphur_dioxide",
          "ozone",
        ].join(","),
      });

      const [weatherResponse, airResponse] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?${parameters.toString()}`,
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?${airParameters.toString()}`,
        ),
      ]);

      if (!weatherResponse.ok || !airResponse.ok) {
        throw new Error("Weather request failed");
      }

      const [weatherData, airData]: [WeatherResponse, AirQualityResponse] =
        await Promise.all([weatherResponse.json(), airResponse.json()]);

      setWeather(weatherData);
      setAirQuality(airData);
    } catch {
      setError(
        language === "vi"
          ? "Không thể tải dữ liệu thời tiết. Hãy kiểm tra kết nối mạng."
          : "Unable to load weather data. Please check your connection.",
      );
    } finally {
      setWeatherLoading(false);
    }
  }, [coordinates, language, temperatureUnit, windUnit]);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void loadWeather();
    }, 0);

    const hourlyTimer = window.setInterval(() => {
      void loadWeather();
    }, 60 * 60 * 1000);

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void loadWeather();
      }
    };

    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(hourlyTimer);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, [loadWeather]);

  async function handleMapSelect(selected: Coordinates) {
    setCoordinates(selected);
    setLocationLoading(true);
    setSearchResults([]);
    setShowSearchResults(false);

    const placeName = await fetchPlaceName(
      selected.latitude,
      selected.longitude,
      language,
    );

    setLocationName(placeName);

    localStorage.setItem(
      "weather-location",
      JSON.stringify({
        ...selected,
        name: placeName,
      }),
    );

    setLocationLoading(false);
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError(text.locationPermission);
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const selected = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCoordinates(selected);

        const placeName = await fetchPlaceName(
          selected.latitude,
          selected.longitude,
          language,
        );

        setLocationName(placeName);

        localStorage.setItem(
          "weather-location",
          JSON.stringify({
            ...selected,
            name: placeName,
          }),
        );

        setLocationLoading(false);
      },
      () => {
        setError(text.locationPermission);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      },
    );
  }

  async function handleSearch(keyword: string) {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);
    setError("");

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmedKeyword,
        )}&count=8&language=${language}&format=json`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data.results ?? []);
    } catch {
      setSearchResults([]);
      setError(
        language === "vi"
          ? "Không thể tìm kiếm địa điểm."
          : "Unable to search for location.",
      );
    } finally {
      setSearchLoading(false);
    }
  }

  function selectSearchLocation(location: LocationResult) {
    const selected = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const name = [location.name, location.admin1, location.country]
      .filter(Boolean)
      .join(", ");

    setCoordinates(selected);
    setLocationName(name);
    setSearchKeyword("");
    setShowSearchResults(false);

    localStorage.setItem(
      "weather-location",
      JSON.stringify({
        ...selected,
        name,
      }),
    );
  }

  const nextHours = useMemo(() => {
    if (!weather) {
      return [];
    }

    const now = currentTime.getTime();

    const startIndex = weather.hourly.time.findIndex(
      (time) => new Date(time).getTime() >= now,
    );

    const safeStartIndex = startIndex >= 0 ? startIndex : 0;

    return weather.hourly.time
      .slice(safeStartIndex, safeStartIndex + 12)
      .map((time, relativeIndex) => {
        const index = safeStartIndex + relativeIndex;

        return {
          time,
          temperature: weather.hourly.temperature_2m[index],
          rainChance: weather.hourly.precipitation_probability[index],
          precipitation: weather.hourly.precipitation[index],
          humidity: weather.hourly.relative_humidity_2m[index],
          windSpeed: weather.hourly.wind_speed_10m[index],
          windGust: weather.hourly.wind_gusts_10m[index],
          uvIndex: weather.hourly.uv_index[index],
          weatherCode: weather.hourly.weather_code[index],
        };
      });
  }, [currentTime, weather]);

  const currentHourIndex = useMemo(() => {
    if (!weather) return 0;
    const now = currentTime.getTime();
    const index = weather.hourly.time.findIndex(
      (time) => new Date(time).getTime() >= now,
    );
    return index >= 0 ? index : 0;
  }, [currentTime, weather]);

  const currentAqiIndex = useMemo(() => {
    if (!airQuality) return 0;
    const now = currentTime.getTime();
    const index = airQuality.hourly.time.findIndex(
      (time) => new Date(time).getTime() >= now,
    );
    return index >= 0 ? index : 0;
  }, [airQuality, currentTime]);

  const currentAqi = airQuality?.hourly.european_aqi[currentAqiIndex] ?? 0;
  const currentUv = weather?.hourly.uv_index[currentHourIndex] ?? 0;

  const weatherAlerts = (() => {
    if (!weather) return [] as string[];

    const alerts: string[] = [];
    const maxRain = Math.max(
      ...nextHours.slice(0, 6).map((item) => item.rainChance ?? 0),
    );
    const maxGust = Math.max(
      ...nextHours.slice(0, 6).map((item) => item.windGust ?? 0),
    );
    const maxTemp = weather.daily.temperature_2m_max[0] ?? 0;
    const uv = weather.daily.uv_index_max[0] ?? 0;
    const code = weather.current.weather_code;

    if ([95, 96, 99].includes(code)) {
      alerts.push(
        language === "vi"
          ? "Cảnh báo giông sét tại khu vực hiện tại."
          : "Thunderstorm warning for the current area.",
      );
    }

    if (maxRain >= 70) {
      alerts.push(
        language === "vi"
          ? `Khả năng mưa cao ${Math.round(maxRain)}% trong 6 giờ tới.`
          : `High rain probability of ${Math.round(maxRain)}% in the next 6 hours.`,
      );
    }

    if (maxGust >= (windUnit === "kmh" ? 40 : 11)) {
      alerts.push(
        language === "vi"
          ? "Gió giật mạnh, cần cẩn thận khi di chuyển."
          : "Strong wind gusts expected. Travel carefully.",
      );
    }

    if (maxTemp >= (temperatureUnit === "celsius" ? 35 : 95)) {
      alerts.push(
        language === "vi"
          ? "Nắng nóng, hạn chế hoạt động ngoài trời buổi trưa."
          : "Heat warning. Limit midday outdoor activity.",
      );
    }

    if (uv >= 8) {
      alerts.push(
        language === "vi"
          ? `UV rất cao (${uv.toFixed(1)}), cần chống nắng.`
          : `Very high UV (${uv.toFixed(1)}). Sun protection is recommended.`,
      );
    }

    if (currentAqi >= 100) {
      alerts.push(
        language === "vi"
          ? `Chất lượng không khí kém (AQI ${Math.round(currentAqi)}).`
          : `Poor air quality (AQI ${Math.round(currentAqi)}).`,
      );
    }

    return alerts;
  })();

  const currentAlertSignature = weatherAlerts.join("||");
  const unreadAlertCount =
    weatherAlerts.length > 0 && currentAlertSignature !== readAlertSignature
      ? weatherAlerts.length
      : 0;

  function markAllAlertsAsRead() {
    setReadAlertSignature(currentAlertSignature);
    window.localStorage.setItem(
      "weather-read-alert-signature",
      currentAlertSignature,
    );
  }

  function saveCurrentFavorite() {
    const exists = favorites.some(
      (item) =>
        Math.abs(item.latitude - coordinates.latitude) < 0.001 &&
        Math.abs(item.longitude - coordinates.longitude) < 0.001,
    );
    if (exists) return;
    const next = [...favorites, { ...coordinates, name: locationName }].slice(
      -8,
    );
    setFavorites(next);
    localStorage.setItem("weather-favorites", JSON.stringify(next));
  }

  function removeFavorite(index: number) {
    const next = favorites.filter((_, itemIndex) => itemIndex !== index);
    setFavorites(next);
    localStorage.setItem("weather-favorites", JSON.stringify(next));
  }

  function selectFavorite(item: FavoriteLocation) {
    setCoordinates({ latitude: item.latitude, longitude: item.longitude });
    setLocationName(item.name);
    localStorage.setItem("weather-location", JSON.stringify(item));
  }

  function getAqiLabel(value: number) {
    if (value <= 20) return language === "vi" ? "Rất tốt" : "Very good";
    if (value <= 40) return language === "vi" ? "Tốt" : "Good";
    if (value <= 60) return language === "vi" ? "Trung bình" : "Moderate";
    if (value <= 80) return language === "vi" ? "Kém" : "Poor";
    if (value <= 100) return language === "vi" ? "Rất kém" : "Very poor";
    return language === "vi" ? "Nguy hại" : "Extremely poor";
  }

  const activityTips = useMemo(() => {
    if (!weather) return [];
    const rain = Math.max(
      ...nextHours.slice(0, 6).map((item) => item.rainChance ?? 0),
    );
    const uv = weather.daily.uv_index_max[0] ?? 0;
    const temp = weather.daily.temperature_2m_max[0] ?? 0;
    return [
      {
        icon: Umbrella,
        title: language === "vi" ? "Mang ô" : "Bring umbrella",
        value:
          rain >= 50
            ? language === "vi"
              ? "Nên mang"
              : "Recommended"
            : language === "vi"
              ? "Chưa cần"
              : "Not necessary",
      },
      {
        icon: Activity,
        title: language === "vi" ? "Tập thể dục" : "Exercise",
        value:
          rain < 40 && currentAqi < 80
            ? language === "vi"
              ? "Phù hợp"
              : "Suitable"
            : language === "vi"
              ? "Nên hạn chế"
              : "Limit activity",
      },
      {
        icon: Sun,
        title: language === "vi" ? "Chống nắng" : "Sun protection",
        value: uv >= 6 ? "SPF 50+" : "SPF 30",
      },
      {
        icon: CloudSun,
        title: language === "vi" ? "Phơi quần áo" : "Dry laundry",
        value:
          rain < 30 && temp > (temperatureUnit === "celsius" ? 24 : 75)
            ? language === "vi"
              ? "Tốt"
              : "Good"
            : language === "vi"
              ? "Không phù hợp"
              : "Not ideal",
      },
    ];
  }, [currentAqi, language, nextHours, temperatureUnit, weather]);

  const windyLayerConfig: Record<
    WindyOverlay,
    { overlay: string; product: string; vi: string; en: string }
  > = {
    wind: {
      overlay: "wind",
      product: "ecmwf",
      vi: "Gió",
      en: "Wind",
    },
    gust: {
      overlay: "gust",
      product: "ecmwf",
      vi: "Gió giật",
      en: "Wind gusts",
    },
    rain: {
      overlay: "rain",
      product: "ecmwf",
      vi: "Mưa & giông",
      en: "Rain & thunder",
    },
    radar: {
      overlay: "radar",
      product: "radar",
      vi: "Radar mưa",
      en: "Weather radar",
    },
    waves: {
      overlay: "waves",
      product: "ecmwf",
      vi: "Sóng biển",
      en: "Waves",
    },
    satellite: {
      overlay: "satellite",
      product: "satellite",
      vi: "Mây vệ tinh",
      en: "Satellite",
    },
  };

  const windyConfig = windyLayerConfig[windyOverlay];

  const windyEmbedUrl = new URL("https://embed.windy.com/embed.html");
  windyEmbedUrl.search = new URLSearchParams({
    type: "map",
    location: "coordinates",
    metricRain: "mm",
    metricTemp: "°C",
    metricWind: windUnit === "kmh" ? "km/h" : "m/s",
    zoom: windyOverlay === "waves" ? "5" : "6",
    overlay: windyConfig.overlay,
    product: windyConfig.product,
    level: "surface",
    lat: coordinates.latitude.toFixed(4),
    lon: coordinates.longitude.toFixed(4),
    detailLat: coordinates.latitude.toFixed(4),
    detailLon: coordinates.longitude.toFixed(4),
    marker: "true",
    pressure: windyOverlay === "wind" ? "true" : "false",
    calendar: "now",
    message: "true",
  }).toString();

  const windyFullUrl = new URL("https://www.windy.com/");
  windyFullUrl.search = new URLSearchParams({
    [windyConfig.overlay]: "",
    lat: coordinates.latitude.toFixed(4),
    lon: coordinates.longitude.toFixed(4),
    zoom: windyOverlay === "waves" ? "5" : "6",
  }).toString();

  const todayDetails = weather
    ? [
        {
          label: language === "vi" ? "Điểm sương" : "Dew point",
          value: `${Math.round(weather.current.dew_point_2m)}°`,
          detail: getDewPointLabel(weather.current.dew_point_2m, language),
          icon: Droplets,
        },
        {
          label: language === "vi" ? "Gió giật hiện tại" : "Current gust",
          value: `${Math.round(weather.current.wind_gusts_10m)} ${
            windUnit === "kmh" ? "km/h" : "m/s"
          }`,
          detail:
            language === "vi"
              ? "Tốc độ gió giật tức thời"
              : "Instantaneous wind gust",
          icon: Wind,
        },
        {
          label: language === "vi" ? "Tổng lượng mưa hôm nay" : "Today's rain",
          value: `${(weather.daily.precipitation_sum[0] ?? 0).toFixed(1)} mm`,
          detail:
            language === "vi"
              ? `Mưa thuần ${(weather.daily.rain_sum[0] ?? 0).toFixed(1)} mm`
              : `Rain ${(weather.daily.rain_sum[0] ?? 0).toFixed(1)} mm`,
          icon: CloudRain,
        },
        {
          label: language === "vi" ? "Thời gian ban ngày" : "Daylight",
          value: formatDuration(
            weather.daily.daylight_duration[0] ?? 0,
            language,
          ),
          detail:
            language === "vi"
              ? `Có nắng ${formatDuration(
                  weather.daily.sunshine_duration[0] ?? 0,
                  language,
                )}`
              : `Sunshine ${formatDuration(
                  weather.daily.sunshine_duration[0] ?? 0,
                  language,
                )}`,
          icon: Sun,
        },
      ]
    : [];

  const dayComparison = weather
    ? [0, 1].map((index) => ({
        label:
          index === 0
            ? language === "vi"
              ? "Hôm nay"
              : "Today"
            : language === "vi"
              ? "Ngày mai"
              : "Tomorrow",
        date: weather.daily.time[index],
        weatherCode: weather.daily.weather_code[index],
        max: weather.daily.temperature_2m_max[index],
        min: weather.daily.temperature_2m_min[index],
        rainChance: weather.daily.precipitation_probability_max[index] ?? 0,
        rainTotal: weather.daily.precipitation_sum[index] ?? 0,
        uv: weather.daily.uv_index_max[index] ?? 0,
        gust: weather.daily.wind_gusts_10m_max[index] ?? 0,
      }))
    : [];

  const statistics = weather
    ? [
        {
          label: text.humidity,
          value: `${weather.current.relative_humidity_2m}%`,
          icon: Droplets,
        },
        {
          label: text.wind,
          value: `${Math.round(weather.current.wind_speed_10m)} ${windUnit === "kmh" ? "km/h" : "m/s"} ${getWindDirection(
            weather.current.wind_direction_10m,
          )}`,
          icon: Wind,
        },
        {
          label: text.pressure,
          value: `${Math.round(weather.current.pressure_msl)} hPa`,
          icon: Gauge,
        },
        {
          label: text.visibility,
          value: `${(weather.current.visibility / 1000).toFixed(1)} km`,
          icon: Eye,
        },
        {
          label: text.clouds,
          value: `${weather.current.cloud_cover}%`,
          icon: Cloud,
        },
        {
          label: text.precipitation,
          value: `${weather.current.precipitation.toFixed(1)} mm`,
          icon: CloudRain,
        },
      ]
    : [];


  useEffect(() => {
    const sectionIds = ["overview", "forecast", "weather-map", "windy-storm"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);

  const weatherScene = weather
    ? getWeatherScene(weather.current.weather_code, weather.current.is_day)
    : "clear-day";

  const selectedCalendarHoliday = getCalendarNote(
    selectedDate,
    language,
  );
  const selectedCalendarHolidayVisual = getHolidayVisual(
    selectedDate,
    language,
  );

  return (
    <main className="wn-app">
      <header className="wn-header">
        <div className="wn-header__inner">
          <a className="wn-brand" href="#overview" aria-label="WeatherNow">
            <span className="wn-brand__icon">
              <CloudSun size={27} />
            </span>
            <span className="wn-brand__copy">
              <strong>Thời tiết hôm nay</strong>
              <small>Thời tiết Việt Nam</small>
            </span>
          </a>

          <nav className="wn-nav" aria-label="Điều hướng chính">
            <a
              href="#overview"
              className={activeSection === "overview" ? "is-active" : ""}
              onClick={() => setActiveSection("overview")}
            >
              <CloudSun size={17} />
              <span>{text.home}</span>
            </a>
            <a
              href="#forecast"
              className={activeSection === "forecast" ? "is-active" : ""}
              onClick={() => setActiveSection("forecast")}
            >
              <CalendarDays size={17} />
              <span>{text.forecast}</span>
            </a>
            <a
              href="#weather-map"
              className={activeSection === "weather-map" ? "is-active" : ""}
              onClick={() => setActiveSection("weather-map")}
            >
              <MapPin size={17} />
              <span>{text.map}</span>
            </a>
            <a
              href="#windy-storm"
              className={activeSection === "windy-storm" ? "is-active" : ""}
              onClick={() => setActiveSection("windy-storm")}
            >
              <Wind size={17} />
              <span>
                {language === "vi" ? "Bão & Windy" : "Storm & Windy"}
              </span>
            </a>
          </nav>

          <div className="wn-actions">
            <select
              className="wn-select"
              value={temperatureUnit}
              onChange={(event) =>
                setTemperatureUnit(event.target.value as TemperatureUnit)
              }
              aria-label="Temperature unit"
            >
              <option value="celsius">°C</option>
              <option value="fahrenheit">°F</option>
            </select>

            <select
              className="wn-select wn-select--wind"
              value={windUnit}
              onChange={(event) => setWindUnit(event.target.value as WindUnit)}
              aria-label="Wind unit"
            >
              <option value="kmh">km/h</option>
              <option value="ms">m/s</option>
            </select>

            <button
              type="button"
              className="wn-icon-button wn-language"
              onClick={() =>
                setLanguage((previous) => (previous === "vi" ? "en" : "vi"))
              }
              aria-label="Đổi ngôn ngữ"
            >
              <Languages size={18} />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              type="button"
              className="wn-icon-button"
              onClick={() =>
                setTheme((previous) =>
                  previous === "light" ? "dark" : "light",
                )
              }
              aria-label="Đổi giao diện sáng tối"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>

            <div className="wn-popover-anchor">
              <button
                type="button"
                className="wn-icon-button"
                onClick={() => {
                  setNotificationOpen(false);
                  setFavoritesOpen((previous) => !previous);
                }}
                aria-label="Địa điểm yêu thích"
                aria-expanded={favoritesOpen}
              >
                <Heart size={19} />
                {favorites.length > 0 && (
                  <span className="wn-count-badge wn-count-badge--blue">
                    {favorites.length}
                  </span>
                )}
              </button>

              {favoritesOpen && (
                <>
                  <button
                    type="button"
                    className="wn-popover-backdrop"
                    onClick={() => setFavoritesOpen(false)}
                    aria-label="Đóng danh sách yêu thích"
                  />
                  <div className="wn-popover wn-popover--favorites">
                    <div className="wn-popover__header">
                      <div>
                        <strong>
                          {language === "vi"
                            ? "Địa điểm yêu thích"
                            : "Favorite locations"}
                        </strong>
                        <small>
                          {favorites.length}/8{" "}
                          {language === "vi" ? "địa điểm đã lưu" : "saved"}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="wn-popover__close"
                        onClick={() => setFavoritesOpen(false)}
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="wn-popover__primary"
                      onClick={saveCurrentFavorite}
                    >
                      <Plus size={16} />
                      {language === "vi"
                        ? "Lưu vị trí hiện tại"
                        : "Save current location"}
                    </button>

                    <div className="wn-favorite-list">
                      {favorites.length === 0 ? (
                        <div className="wn-empty-state">
                          <MapPin size={28} />
                          <strong>
                            {language === "vi"
                              ? "Chưa có địa điểm yêu thích"
                              : "No favorite location"}
                          </strong>
                          <span>
                            {language === "vi"
                              ? "Lưu địa điểm để truy cập nhanh hơn."
                              : "Save a place for quick access."}
                          </span>
                        </div>
                      ) : (
                        favorites.map((item, index) => {
                          const active =
                            Math.abs(item.latitude - coordinates.latitude) <
                              0.001 &&
                            Math.abs(item.longitude - coordinates.longitude) <
                              0.001;

                          return (
                            <div
                              className={`wn-favorite-item ${
                                active ? "is-active" : ""
                              }`}
                              key={`${item.latitude}-${item.longitude}`}
                            >
                              <button
                                type="button"
                                className="wn-favorite-item__main"
                                onClick={() => {
                                  selectFavorite(item);
                                  setFavoritesOpen(false);
                                }}
                              >
                                <span className="wn-favorite-item__icon">
                                  <MapPin size={16} />
                                </span>
                                <span>
                                  <strong>{item.name}</strong>
                                  <small>
                                    {active
                                      ? language === "vi"
                                        ? "Đang xem"
                                        : "Currently viewing"
                                      : `${item.latitude.toFixed(
                                          2,
                                        )}°, ${item.longitude.toFixed(2)}°`}
                                  </small>
                                </span>
                              </button>
                              <button
                                type="button"
                                className="wn-favorite-item__remove"
                                onClick={() => removeFavorite(index)}
                                aria-label={`Xóa ${item.name}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="wn-popover-anchor">
              <button
                type="button"
                className="wn-icon-button"
                onClick={() => {
                  setFavoritesOpen(false);
                  setNotificationOpen((previous) => !previous);
                }}
                aria-label="Thông báo thời tiết"
                aria-expanded={notificationOpen}
              >
                <Bell size={19} />
                {unreadAlertCount > 0 && (
                  <span className="wn-count-badge wn-count-badge--red">
                    {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <>
                  <button
                    type="button"
                    className="wn-popover-backdrop"
                    onClick={() => setNotificationOpen(false)}
                    aria-label="Đóng thông báo"
                  />
                  <div className="wn-popover wn-popover--notifications">
                    <div className="wn-popover__header">
                      <div>
                        <strong>
                          {language === "vi"
                            ? "Thông báo thời tiết"
                            : "Weather notifications"}
                        </strong>
                        <small>
                          {unreadAlertCount > 0
                            ? language === "vi"
                              ? `${unreadAlertCount} cảnh báo chưa đọc`
                              : `${unreadAlertCount} unread alerts`
                            : language === "vi"
                              ? "Không có cảnh báo mới"
                              : "No new alerts"}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="wn-popover__close"
                        onClick={() => setNotificationOpen(false)}
                      >
                        <X size={17} />
                      </button>
                    </div>

                    {weatherAlerts.length > 0 && (
                      <button
                        type="button"
                        className="wn-mark-read"
                        onClick={markAllAlertsAsRead}
                        disabled={unreadAlertCount === 0}
                      >
                        <CheckCheck size={16} />
                        {language === "vi"
                          ? "Đánh dấu đã đọc tất cả"
                          : "Mark all as read"}
                      </button>
                    )}

                    <div className="wn-alert-list">
                      {weatherAlerts.length === 0 ? (
                        <div className="wn-empty-state">
                          <Bell size={28} />
                          <strong>
                            {language === "vi"
                              ? "Thời tiết đang ổn định"
                              : "Weather is stable"}
                          </strong>
                        </div>
                      ) : (
                        weatherAlerts.map((alert, index) => (
                          <div className="wn-alert-item" key={alert}>
                            <span>
                              <AlertTriangle size={18} />
                            </span>
                            <div>
                              <strong>
                                {language === "vi"
                                  ? `Cảnh báo ${index + 1}`
                                  : `Alert ${index + 1}`}
                              </strong>
                              <p>{alert}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              className="wn-menu-button"
              onClick={() => setMobileMenuOpen((previous) => !previous)}
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="wn-mobile-menu">
            <a
              href="#overview"
              className={activeSection === "overview" ? "is-active" : ""}
              onClick={() => {
                setActiveSection("overview");
                setMobileMenuOpen(false);
              }}
            >
              <CloudSun size={17} />
              <span>{text.home}</span>
            </a>
            <a
              href="#forecast"
              className={activeSection === "forecast" ? "is-active" : ""}
              onClick={() => {
                setActiveSection("forecast");
                setMobileMenuOpen(false);
              }}
            >
              <CalendarDays size={17} />
              <span>{text.forecast}</span>
            </a>
            <a
              href="#weather-map"
              className={activeSection === "weather-map" ? "is-active" : ""}
              onClick={() => {
                setActiveSection("weather-map");
                setMobileMenuOpen(false);
              }}
            >
              <MapPin size={17} />
              <span>{text.map}</span>
            </a>
            <a
              href="#windy-storm"
              className={activeSection === "windy-storm" ? "is-active" : ""}
              onClick={() => {
                setActiveSection("windy-storm");
                setMobileMenuOpen(false);
              }}
            >
              <Wind size={17} />
              <span>
                {language === "vi" ? "Bão & Windy" : "Storm & Windy"}
              </span>
            </a>
          </nav>
        )}
      </header>

      <div className="wn-atmosphere wn-atmosphere--one" />
      <div className="wn-atmosphere wn-atmosphere--two" />

      <div className="wn-container">
        <section className="wn-search-row">
          <div className="wn-search">
            <Search size={20} />
            <input
              value={searchKeyword}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSearchKeyword(nextValue);

                if (!nextValue.trim()) {
                  setShowSearchResults(false);
                  setSearchResults([]);
                  return;
                }

                void handleSearch(nextValue);
              }}
              onFocus={() => {
                if (searchResults.length > 0 || searchKeyword.trim()) {
                  setShowSearchResults(true);
                }
              }}
              placeholder={text.searchPlaceholder}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => void handleSearch(searchKeyword)}
              disabled={searchLoading}
            >
              {searchLoading ? (
                <LoaderCircle className="spin" size={19} />
              ) : (
                <Search size={19} />
              )}
            </button>

            {showSearchResults && (
              <div className="wn-search-results">
                {searchLoading ? (
                  <div className="wn-search-results__message">
                    <LoaderCircle className="spin" size={19} />
                    {text.loading}
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => selectSearchLocation(location)}
                    >
                      <MapPin size={17} />
                      <span>
                        <strong>{location.name}</strong>
                        <small>
                          {[location.admin1, location.country]
                            .filter(Boolean)
                            .join(", ")}
                        </small>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="wn-search-results__message">
                    {text.searchEmpty}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="wn-location-button"
            onClick={handleCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <LoaderCircle className="spin" size={19} />
            ) : (
              <LocateFixed size={19} />
            )}
            <span>{text.currentLocation}</span>
          </button>
        </section>

        {error && <div className="wn-error">{error}</div>}

        <section id="overview" className="wn-overview">
          <article className={`wn-hero wn-hero--${weatherScene}`}>
            {weatherLoading && !weather ? (
              <div className="wn-loading">
                <LoaderCircle className="spin" size={36} />
                <p>{text.loading}</p>
              </div>
            ) : weather ? (
              <>
                <div className="wn-hero__sky" aria-hidden="true">
                  <span className="wn-hero__sun" />
                  <span className="wn-hero__moon" />
                  <span className="wn-hero__stars" />
                  <span className="wn-hero__cloud wn-hero__cloud--one" />
                  <span className="wn-hero__cloud wn-hero__cloud--two" />
                  <span className="wn-hero__cloud wn-hero__cloud--three" />
                  <span className="wn-hero__mist wn-hero__mist--one" />
                  <span className="wn-hero__mist wn-hero__mist--two" />
                  <span className="wn-hero__rain wn-hero__rain--one" />
                  <span className="wn-hero__rain wn-hero__rain--two" />
                  <span className="wn-hero__lightning" />
                  <span className="wn-hero__mountain wn-hero__mountain--one" />
                  <span className="wn-hero__mountain wn-hero__mountain--two" />
                  <span className="wn-hero__water" />
                </div>

                <div className="wn-hero__content">
                  <div className="wn-hero__location">
                    <div>
                      <span>
                        <MapPin size={18} />
                        {locationName}
                      </span>
                      <small>
                        {formatHourlyUpdateLabel(currentTime, language)}
                      </small>
                    </div>
                    <button
                      type="button"
                      onClick={saveCurrentFavorite}
                      aria-label="Lưu địa điểm"
                    >
                      <Heart size={20} />
                    </button>
                  </div>

                  <div className="wn-hero__main">
                    <div className="wn-hero__temperature">
                      {Math.round(weather.current.temperature_2m)}
                      <sup>°{temperatureUnit === "celsius" ? "C" : "F"}</sup>
                    </div>

                    <div className="wn-hero__condition">
                      <WeatherIcon
                        code={weather.current.weather_code}
                        size={55}
                      />
                      <div>
                        <h1>
                          {getWeatherDescription(
                            weather.current.weather_code,
                            language,
                          )}
                        </h1>
                        <p>
                          {text.feelsLike}{" "}
                          {Math.round(weather.current.apparent_temperature)}°
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="wn-hero__metrics">
                    {[
                      {
                        icon: Wind,
                        label: text.wind,
                        value: `${Math.round(
                          weather.current.wind_speed_10m,
                        )} ${windUnit === "kmh" ? "km/h" : "m/s"}`,
                      },
                      {
                        icon: Droplets,
                        label: text.humidity,
                        value: `${weather.current.relative_humidity_2m}%`,
                      },
                      {
                        icon: Gauge,
                        label: text.pressure,
                        value: `${Math.round(
                          weather.current.pressure_msl,
                        )} hPa`,
                      },
                      {
                        icon: Eye,
                        label: text.visibility,
                        value: `${(
                          weather.current.visibility / 1000
                        ).toFixed(1)} km`,
                      },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label}>
                        <span>
                          <Icon size={18} />
                        </span>
                        <p>
                          <small>{label}</small>
                          <strong>{value}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </article>

          <div className="wn-side-cards">
            <article
              className={`wn-panel wn-time-card ${
                selectedCalendarHolidayVisual ? "has-holiday-banner" : ""
              }`}
            >
              <div className="wn-time-card__top">
                <div className="wn-time-card__heading">
                  <div className="wn-time-card__eyebrow">
                    <span className="wn-time-card__status-dot" />
                    <span>
                      {isSelectedToday
                        ? language === "vi"
                          ? "Hôm nay"
                          : "Today"
                        : language === "vi"
                          ? "Ngày đã chọn"
                          : "Selected date"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="wn-calendar-button"
                    onClick={() => {
                      setCalendarMonth(
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          1,
                        ),
                      );
                      setIsCalendarOpen(true);
                    }}
                    aria-label={language === "vi" ? "Mở lịch" : "Open calendar"}
                  >
                    <CalendarDays size={19} />
                  </button>
                </div>

                <div className="wn-time-card__time">{formatTime(currentTime)}</div>

                <div className="wn-time-card__date">
                  {formatDate(selectedDate, language)}
                </div>

                <div className="wn-time-card__info-row">
                  <div className="wn-time-card__info-box wn-time-card__info-box--lunar">
                    <span className="wn-time-card__info-icon">
                      <Moon size={18} />
                    </span>
                    <div>
                      <small>
                        {language === "vi" ? "Âm lịch" : "Lunar date"}
                      </small>
                      <strong>{getLunarDate(selectedDate, language)}</strong>
                    </div>
                  </div>

                  {selectedCalendarHoliday && (
                    <div className="wn-time-card__info-box wn-time-card__info-box--holiday">
                      <span className="wn-time-card__holiday-symbol">✦</span>
                      <div>
                        <small>
                          {language === "vi" ? "Ngày lễ" : "Holiday"}
                        </small>
                        <strong>{selectedCalendarHoliday}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedCalendarHolidayVisual && (
                <div className="wn-time-card__banner">
                  <img
                    src={selectedCalendarHolidayVisual.src}
                    alt={selectedCalendarHolidayVisual.alt}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.parentElement?.classList.add(
                        "is-image-error",
                      );
                    }}
                  />
                  <span className="wn-time-card__banner-overlay" />
                </div>
              )}
            </article>

            <article className="wn-panel wn-aqi-card">
              <div className="wn-panel__heading">
                <span>
                  {language === "vi"
                    ? "Chất lượng không khí"
                    : "Air quality"}
                </span>
                <em>{getAqiLabel(currentAqi)}</em>
              </div>
              <div className="wn-aqi-card__body">
                <div>
                  <small>AQI</small>
                  <strong>{Math.round(currentAqi)}</strong>
                  <p>
                    PM2.5:{" "}
                    {Number(
                      airQuality?.hourly.pm2_5[currentAqiIndex] ?? 0,
                    ).toFixed(1)}{" "}
                    µg/m³
                  </p>
                </div>
                <span>
                  <Activity size={30} />
                </span>
              </div>
              <div className="wn-aqi-scale">
                <i />
              </div>
            </article>

            <article className="wn-panel wn-mini-card">
              <div>
                <span>{language === "vi" ? "Chỉ số UV" : "UV index"}</span>
                <strong>{currentUv.toFixed(1)}</strong>
                <small>
                  {currentUv >= 6
                    ? language === "vi"
                      ? "Cần chống nắng"
                      : "Sun protection"
                    : language === "vi"
                      ? "Mức an toàn"
                      : "Safe level"}
                </small>
              </div>
              <span className="wn-mini-card__icon wn-mini-card__icon--sun">
                <Sun size={28} />
              </span>
            </article>

            <article className="wn-panel wn-mini-card">
              <div>
                <span>
                  {language === "vi" ? "Khả năng mưa" : "Rain chance"}
                </span>
                <strong>
                  {Math.round(
                    Math.max(
                      ...nextHours
                        .slice(0, 6)
                        .map((item) => item.rainChance ?? 0),
                    ),
                  )}
                  %
                </strong>
                <small>
                  {language === "vi" ? "Trong 6 giờ tới" : "Next 6 hours"}
                </small>
              </div>
              <span className="wn-mini-card__icon">
                <CloudRain size={28} />
              </span>
            </article>
          </div>
        </section>

        {weather && (
          <section className="wn-metric-strip">
            {[
              {
                icon: Wind,
                label:
                  language === "vi" ? "Gió giật mạnh nhất" : "Max wind gust",
                value: `${Math.round(
                  weather.daily.wind_gusts_10m_max[0] ?? 0,
                )} ${windUnit === "kmh" ? "km/h" : "m/s"}`,
              },
              {
                icon: CloudRain,
                label: language === "vi" ? "Lượng mưa" : "Rain total",
                value: `${(
                  weather.daily.precipitation_sum[0] ?? 0
                ).toFixed(1)} mm`,
              },
              {
                icon: Droplets,
                label: text.humidity,
                value: `${weather.current.relative_humidity_2m}%`,
              },
              {
                icon: Thermometer,
                label: language === "vi" ? "Điểm sương" : "Dew point",
                value: `${Math.round(weather.current.dew_point_2m)}°`,
              },
              {
                icon: Eye,
                label: text.visibility,
                value: `${(weather.current.visibility / 1000).toFixed(1)} km`,
              },
              {
                icon: Gauge,
                label: text.pressure,
                value: `${Math.round(weather.current.pressure_msl)} hPa`,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <span>
                  <Icon size={19} />
                </span>
                <p>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </p>
              </div>
            ))}
          </section>
        )}

        <section id="forecast" className="wn-content-grid">
          <article className="wn-panel wn-forecast-card">
            <div className="wn-section-heading">
              <div>
                <span>24H</span>
                <h2>{text.hourlyForecast}</h2>
              </div>
            </div>

            <div className="wn-hourly">
              {nextHours.map((hour, index) => (
                <article
                  className={`wn-hour ${
                    index === 0 ? "wn-hour--active" : ""
                  }`}
                  key={hour.time}
                >
                  <span>
                    {index === 0
                      ? language === "vi"
                        ? "Hiện tại"
                        : "Now"
                      : formatApiTime(hour.time)}
                  </span>
                  <WeatherIcon code={hour.weatherCode} size={34} />
                  <strong>{Math.round(hour.temperature)}°</strong>
                  <small>
                    <Wind size={12} />
                    {Math.round(hour.windSpeed)}
                  </small>
                  <small>
                    <Droplets size={12} />
                    {hour.rainChance ?? 0}%
                  </small>
                </article>
              ))}
            </div>
          </article>

          <article className="wn-panel wn-windy-preview">
            <div className="wn-section-heading">
              <div>
                <span>
                  Windy <b>LIVE</b>
                </span>
                <h2>{language === "vi" ? "Bão & Windy" : "Storm & Windy"}</h2>
              </div>
              <a
                href={windyFullUrl.toString()}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} />
              </a>
            </div>

            <iframe
              title="Windy preview"
              src={windyEmbedUrl.toString()}
              loading="lazy"
              allowFullScreen
            />
          </article>
        </section>

        {weather && (
          <section className="wn-content-grid wn-content-grid--lower">
            <article className="wn-panel wn-daily-card">
              <div className="wn-section-heading">
                <div>
                  <span>7 DAYS</span>
                  <h2>{text.sevenDayForecast}</h2>
                </div>
              </div>

              <div className="wn-daily-list">
                {weather.daily.time.map((date, index) => (
                  <article
                    className={`wn-day ${index === 0 ? "wn-day--active" : ""}`}
                    key={date}
                  >
                    <strong>
                      {index === 0 ? text.today : formatDay(date, language)}
                    </strong>
                    <span>
                      {new Intl.DateTimeFormat(
                        language === "vi" ? "vi-VN" : "en-US",
                        { day: "2-digit", month: "2-digit" },
                      ).format(new Date(`${date}T12:00:00`))}
                    </span>
                    <WeatherIcon
                      code={weather.daily.weather_code[index]}
                      size={35}
                    />
                    <div>
                      <strong>
                        {Math.round(
                          weather.daily.temperature_2m_max[index],
                        )}
                        °
                      </strong>
                      <small>
                        {Math.round(
                          weather.daily.temperature_2m_min[index],
                        )}
                        °
                      </small>
                    </div>
                    <small>
                      <Droplets size={12} />
                      {weather.daily.precipitation_probability_max[index] ?? 0}%
                    </small>
                  </article>
                ))}
              </div>
            </article>

            <article className="wn-panel wn-map-preview">
              <div className="wn-section-heading">
                <div>
                  <span>OpenStreetMap</span>
                  <h2>{text.weatherMap}</h2>
                </div>
                <a href="#weather-map">
                  {language === "vi" ? "Xem bản đồ" : "View map"}
                </a>
              </div>
              <WeatherMap
                coordinates={coordinates}
                locationName={locationName}
                onSelectLocation={handleMapSelect}
              />
            </article>
          </section>
        )}

        <section className="wn-panel wn-suggestions">
          <div className="wn-section-heading">
            <div>
              <span>WEATHERNOW</span>
              <h2>
                {language === "vi"
                  ? "Gợi ý phù hợp hôm nay"
                  : "Today's suggestions"}
              </h2>
            </div>
          </div>
          <div className="wn-suggestion-grid">
            {activityTips.map(({ icon: Icon, title, value }) => (
              <div key={title}>
                <span>
                  <Icon size={21} />
                </span>
                <p>
                  <small>{title}</small>
                  <strong>{value}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="windy-storm" className="wn-panel wn-full-map">
          <div className="wn-section-heading wn-section-heading--wrap">
            <div>
              <span>WINDY</span>
              <h2>
                {language === "vi"
                  ? "Theo dõi mưa bão và thời tiết nguy hiểm"
                  : "Storm and severe weather tracking"}
              </h2>
            </div>
            <a
              href={windyFullUrl.toString()}
              target="_blank"
              rel="noreferrer"
              className="wn-outline-button"
            >
              <ExternalLink size={16} />
              {language === "vi" ? "Mở Windy" : "Open Windy"}
            </a>
          </div>

          <div className="wn-layer-tabs">
            {(Object.keys(windyLayerConfig) as WindyOverlay[]).map((layer) => (
              <button
                type="button"
                className={windyOverlay === layer ? "is-active" : ""}
                onClick={() => setWindyOverlay(layer)}
                key={layer}
              >
                {windyLayerConfig[layer][language]}
              </button>
            ))}
          </div>

          <iframe
            key={`${windyOverlay}-${coordinates.latitude}-${coordinates.longitude}-${windUnit}`}
            title={`Windy ${windyConfig[language]}`}
            src={windyEmbedUrl.toString()}
            loading="lazy"
            allowFullScreen
          />

          <p className="wn-map-note">
            <AlertTriangle size={17} />
            {language === "vi"
              ? "Dữ liệu Windy dùng để tham khảo. Khi có bão hoặc thời tiết nguy hiểm, hãy ưu tiên cảnh báo chính thức từ cơ quan khí tượng Việt Nam."
              : "Windy data is for reference. Follow official national warnings during severe weather."}
          </p>
        </section>

        <section id="weather-map" className="wn-panel wn-full-map">
          <div className="wn-section-heading wn-section-heading--wrap">
            <div>
              <span>MAP</span>
              <h2>{text.weatherMap}</h2>
            </div>
            <button
              type="button"
              className="wn-outline-button"
              onClick={handleCurrentLocation}
            >
              <LocateFixed size={16} />
              {text.currentLocation}
            </button>
          </div>

          <WeatherMap
            coordinates={coordinates}
            locationName={locationName}
            onSelectLocation={handleMapSelect}
          />
        </section>
      </div>

      <CalendarModal
        open={isCalendarOpen}
        language={language}
        selectedDate={selectedDate}
        displayMonth={calendarMonth}
        onDisplayMonthChange={setCalendarMonth}
        onSelectDate={(date) => {
          setSelectedDate(date);
        }}
        onClose={() => setIsCalendarOpen(false)}
      />

      <nav className="wn-bottom-nav">
        <a
          href="#overview"
          className={activeSection === "overview" ? "is-active" : ""}
          onClick={() => setActiveSection("overview")}
        >
          <CloudSun size={21} />
          <span>{text.home}</span>
        </a>
        <a
          href="#forecast"
          className={activeSection === "forecast" ? "is-active" : ""}
          onClick={() => setActiveSection("forecast")}
        >
          <CalendarDays size={21} />
          <span>{text.forecast}</span>
        </a>
        <a
          href="#weather-map"
          className={activeSection === "weather-map" ? "is-active" : ""}
          onClick={() => setActiveSection("weather-map")}
        >
          <MapPin size={21} />
          <span>{text.map}</span>
        </a>
        <a
          href="#windy-storm"
          className={activeSection === "windy-storm" ? "is-active" : ""}
          onClick={() => setActiveSection("windy-storm")}
        >
          <Wind size={21} />
          <span>Windy</span>
        </a>
      </nav>
    </main>
  );
}

type CalendarModalProps = {
  open: boolean;
  language: Language;
  selectedDate: Date;
  displayMonth: Date;
  onDisplayMonthChange: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
};

function CalendarModal({
  open,
  language,
  selectedDate,
  displayMonth,
  onDisplayMonthChange,
  onSelectDate,
  onClose,
}: CalendarModalProps) {
  if (!open) return null;

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    return new Date(year, month, index - firstDayIndex + 1);
  });

  const today = new Date();

  const weekdays =
    language === "vi"
      ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthLabel =
    language === "vi"
      ? `Tháng ${month + 1}, ${year}`
      : new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
        }).format(displayMonth);

  const selectedHoliday = getCalendarNote(selectedDate, language);
  const selectedHolidayVisual = getHolidayVisual(selectedDate, language);

  return (
    <div
      className="wn-calendar-light-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={language === "vi" ? "Chọn ngày" : "Select date"}
      onMouseDown={onClose}
    >
      <div
        className="wn-calendar-light-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="wn-calendar-light-header">
          <div>
            <span className="wn-calendar-light-kicker">
              {language === "vi" ? "Lịch vạn niên" : "Perpetual calendar"}
            </span>
            <h3>{monthLabel}</h3>
          </div>

          <button
            type="button"
            className="wn-calendar-light-close"
            onClick={onClose}
            aria-label={language === "vi" ? "Đóng" : "Close"}
          >
            <X size={24} />
          </button>
        </header>

        <div className="wn-calendar-light-body">
          <section className="wn-calendar-light-left">
            <div className="wn-calendar-light-controls">
              <button
                type="button"
                className="wn-calendar-light-arrow"
                onClick={() =>
                  onDisplayMonthChange(new Date(year, month - 1, 1))
                }
                aria-label={language === "vi" ? "Tháng trước" : "Previous month"}
              >
                <ChevronLeft size={22} />
              </button>

              <div className="wn-calendar-light-select-wrap">
                <CalendarDays size={18} />
                <select
                  value={month}
                  onChange={(event) =>
                    onDisplayMonthChange(
                      new Date(year, Number(event.target.value), 1),
                    )
                  }
                  aria-label={language === "vi" ? "Chọn tháng" : "Select month"}
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index} value={index}>
                      {language === "vi"
                        ? `Tháng ${index + 1}`
                        : new Intl.DateTimeFormat("en-US", {
                            month: "long",
                          }).format(new Date(2026, index, 1))}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>

              <div className="wn-calendar-light-select-wrap wn-calendar-light-select-wrap--year">
                <select
                  value={year}
                  onChange={(event) =>
                    onDisplayMonthChange(
                      new Date(Number(event.target.value), month, 1),
                    )
                  }
                  aria-label={language === "vi" ? "Chọn năm" : "Select year"}
                >
                  {Array.from({ length: 201 }, (_, index) => {
                    const optionYear = 1900 + index;

                    return (
                      <option key={optionYear} value={optionYear}>
                        {optionYear}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown size={16} />
              </div>

              <button
                type="button"
                className="wn-calendar-light-arrow"
                onClick={() =>
                  onDisplayMonthChange(new Date(year, month + 1, 1))
                }
                aria-label={language === "vi" ? "Tháng sau" : "Next month"}
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <button
              type="button"
              className="wn-calendar-light-today"
              onClick={() => {
                const now = new Date();
                onDisplayMonthChange(
                  new Date(now.getFullYear(), now.getMonth(), 1),
                );
                onSelectDate(now);
              }}
            >
              <CalendarDays size={20} />
              {language === "vi" ? "Về hôm nay" : "Go to today"}
            </button>

            <div className="wn-calendar-light-grid">
              <div className="wn-calendar-light-weekdays">
                {weekdays.map((day, index) => (
                  <span
                    key={day}
                    className={
                      index === 5
                        ? "is-saturday"
                        : index === 6
                          ? "is-sunday"
                          : ""
                    }
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="wn-calendar-light-days">
                {calendarDays.map((date) => {
                  const currentMonth = date.getMonth() === month;
                  const selected = isSameDate(date, selectedDate);
                  const currentDay = isSameDate(date, today);
                  const holiday = getCalendarNote(date, language);
                  const isSunday = date.getDay() === 0;
                  const isSaturday = date.getDay() === 6;

                  return (
                    <button
                      key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                      type="button"
                      title={holiday ?? undefined}
                      className={[
                        "wn-calendar-light-day",
                        selected ? "is-selected" : "",
                        currentDay ? "is-today" : "",
                        holiday ? "is-holiday" : "",
                        isSunday ? "is-sunday" : "",
                        isSaturday ? "is-saturday" : "",
                        !currentMonth ? "is-outside" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => {
                        onSelectDate(date);

                        if (
                          date.getMonth() !== month ||
                          date.getFullYear() !== year
                        ) {
                          onDisplayMonthChange(
                            new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              1,
                            ),
                          );
                        }
                      }}
                    >
                      <strong>{date.getDate()}</strong>
                      <small>{getLunarDayLabel(date)}</small>
                      {/* {holiday ? <i /> : null} */}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="wn-calendar-light-right">
            <div className="wn-calendar-light-selected-card">
              <span className="wn-calendar-light-selected-kicker">
                {language === "vi" ? "Ngày đang chọn" : "Selected date"}
              </span>

              <h4>{formatDate(selectedDate, language)}</h4>

              <div className="wn-calendar-light-lunar-chip">
                <Moon size={17} />
                <span>{getLunarDate(selectedDate, language)}</span>
              </div>

              {selectedHolidayVisual ? (
                <div className="wn-calendar-light-holiday-image">
                  <img
                    src={selectedHolidayVisual.src}
                    alt={selectedHolidayVisual.alt}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.parentElement?.classList.add(
                        "is-image-error",
                      );
                    }}
                  />
                </div>
              ) : (
                <div className="wn-calendar-light-empty-image">
                  <CalendarDays size={42} />
                </div>
              )}

              {selectedHoliday ? (
                <div className="wn-calendar-light-holiday-label">
                  <span>
                    <Star size={18} />
                  </span>
                  <strong>{selectedHoliday}</strong>
                </div>
              ) : (
                <div className="wn-calendar-light-no-holiday">
                  {language === "vi"
                    ? "Không có ngày lễ nổi bật trong ngày này."
                    : "No major holiday on this date."}
                </div>
              )}
            </div>

            <div className="wn-calendar-light-today-card">
              <span>
                <CalendarDays size={22} />
              </span>
              <div>
                <small>{language === "vi" ? "Hôm nay" : "Today"}</small>
                <strong>{formatDate(today, language)}</strong>
                <em>{getLunarDate(today, language)}</em>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const modalIconButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: 16,
  border: "1px solid rgba(103, 232, 249, 0.14)",
  background:
    "linear-gradient(145deg, rgba(16, 46, 78, 0.98), rgba(10, 29, 51, 0.98))",
  color: "#eef6ff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
} as const;

const modalSmallButtonStyle = {
  width: 40,
  height: 38,
  borderRadius: 12,
  border: "1px solid rgba(103, 232, 249, 0.12)",
  background: "rgba(18, 43, 70, 0.92)",
  color: "#e2eef9",
  fontSize: 20,
  fontWeight: 800,
  cursor: "pointer",
} as const;


const modalSecondaryButtonStyle = {
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(61, 220, 255, 0.24)",
  background:
    "linear-gradient(135deg, rgba(26, 151, 210, 0.28), rgba(22, 110, 197, 0.22))",
  color: "#82e7ff",
  padding: "0 16px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
} as const;
