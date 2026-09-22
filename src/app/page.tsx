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
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Eye,
  ExternalLink,
  Gauge,
  Heart,
  Languages,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Plus,
  Menu,
  Moon,
  Search,
  Sun,
  Thermometer,
  Trash2,
  Umbrella,
  Wind,
  Star,
  X,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Lunar, Solar } from "lunar-javascript";
import HolidayModal from "@/components/HolidayModal";
import SnowEffect from "@/components/SnowEffect";
import AdvancedSnow from "@/components/AdvancedSnow";
import ConfettiSVG from "@/components/ConfettiSVG";
import Lanterns from "@/components/Lanterns";
import Fireworks from "@/components/Fireworks";
import HolidayEffectsSettings from "@/components/HolidayEffectsSettings";
import WeatherFX from "@/components/WeatherFX";
import SunCard, { type SunCardHour } from "@/components/SunCard";
import WindCompass from "@/components/WindCompass";
import HistoryChart, { type HistoryEntry } from "@/components/HistoryChart";
import ComparePanel from "@/components/ComparePanel";
import { Settings, Share2 } from "lucide-react";
import type { HolidayEffectsConfig } from "@/types/holiday-effects";
import { provinces, type Province } from "@/data/provinces";
import { getCityBackgroundSrc } from "@/data/city-backgrounds";

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
    src: "/holidays/tet-duong-lich.png",
    alt: {
      vi: "Tết Dương lịch",
      en: "New Year's Day",
    },
  },
  "01-09": {
    src: "/holidays/ngay-hoc-sinh-sinh-vien-viet-nam.png",
    alt: {
      vi: "Ngày Học sinh - Sinh viên Việt Nam",
      en: "Vietnamese Students' Day",
    },
  },
  "02-03": {
    src: "/holidays/ngay-thanh-lap-dang-cong-san-viet-nam.png",
    alt: {
      vi: "Ngày thành lập Đảng Cộng sản Việt Nam",
      en: "Communist Party of Vietnam Foundation Day",
    },
  },
  "02-14": {
    src: "/holidays/ngay-le-tinh-nhan.png",
    alt: {
      vi: "Ngày Lễ Tình nhân",
      en: "Valentine's Day",
    },
  },
  "02-27": {
    src: "/holidays/ngay-thay-thuoc-viet-nam.png",
    alt: {
      vi: "Ngày Thầy thuốc Việt Nam",
      en: "Vietnamese Doctors' Day",
    },
  },
  "03-08": {
    src: "/holidays/ngay-quoc-te-phu-nu.png",
    alt: {
      vi: "Ngày Quốc tế Phụ nữ",
      en: "International Women's Day",
    },
  },
  "03-20": {
    src: "/holidays/ngay-quoc-te-hanh-phuc.png",
    alt: {
      vi: "Ngày Quốc tế Hạnh phúc",
      en: "International Day of Happiness",
    },
  },
  "03-22": {
    src: "/holidays/ngay-nuoc-the-gioi.png",
    alt: {
      vi: "Ngày Nước Thế giới",
      en: "World Water Day",
    },
  },
  "03-26": {
    src: "/holidays/ngay-thanh-lap-doan-tncs-ho-chi-minh.png",
    alt: {
      vi: "Ngày thành lập Đoàn TNCS Hồ Chí Minh",
      en: "Ho Chi Minh Communist Youth Union Foundation Day",
    },
  },
  "04-01": {
    src: "/holidays/ngay-ca-thang-tu.png",
    alt: {
      vi: "Ngày Cá tháng Tư",
      en: "April Fools' Day",
    },
  },
  "04-07": {
    src: "/holidays/ngay-suc-khoe-the-gioi.png",
    alt: {
      vi: "Ngày Sức khỏe Thế giới",
      en: "World Health Day",
    },
  },
  "04-22": {
    src: "/holidays/ngay-trai-dat.png",
    alt: {
      vi: "Ngày Trái Đất",
      en: "Earth Day",
    },
  },
  "04-23": {
    src: "/holidays/ngay-sach-va-ban-quyen-the-gioi.png",
    alt: {
      vi: "Ngày Sách và Bản quyền Thế giới",
      en: "World Book and Copyright Day",
    },
  },
  "04-30": {
    src: "/holidays/ngay-giai-phong-mien-nam-thong-nhat-dat-nuoc.png",
    alt: {
      vi: "Ngày Giải phóng miền Nam, thống nhất đất nước",
      en: "Reunification Day",
    },
  },
  "05-01": {
    src: "/holidays/ngay-quoc-te-lao-dong.png",
    alt: {
      vi: "Ngày Quốc tế Lao động",
      en: "International Workers' Day",
    },
  },
  "05-07": {
    src: "/holidays/ngay-chien-thang-dien-bien-phu.png",
    alt: {
      vi: "Ngày Chiến thắng Điện Biên Phủ",
      en: "Dien Bien Phu Victory Day",
    },
  },
  "05-15": {
    src: "/holidays/ngay-quoc-te-gia-dinh.png",
    alt: {
      vi: "Ngày Quốc tế Gia đình",
      en: "International Day of Families",
    },
  },
  "05-19": {
    src: "/holidays/ngay-sinh-chu-tich-ho-chi-minh.png",
    alt: {
      vi: "Ngày sinh Chủ tịch Hồ Chí Minh",
      en: "President Ho Chi Minh's Birthday",
    },
  },
  "05-31": {
    src: "/holidays/ngay-the-gioi-khong-thuoc-la.png",
    alt: {
      vi: "Ngày Thế giới Không thuốc lá",
      en: "World No Tobacco Day",
    },
  },
  "06-01": {
    src: "/holidays/ngay-quoc-te-thieu-nhi.png",
    alt: {
      vi: "Ngày Quốc tế Thiếu nhi",
      en: "International Children's Day",
    },
  },
  "06-05": {
    src: "/holidays/ngay-moi-truong-the-gioi.png",
    alt: {
      vi: "Ngày Môi trường Thế giới",
      en: "World Environment Day",
    },
  },
  "06-08": {
    src: "/holidays/ngay-dai-duong-the-gioi.png",
    alt: {
      vi: "Ngày Đại dương Thế giới",
      en: "World Oceans Day",
    },
  },
  "06-21": {
    src: "/holidays/ngay-bao-chi-cach-mang-viet-nam.png",
    alt: {
      vi: "Ngày Báo chí Cách mạng Việt Nam",
      en: "Vietnam Revolutionary Press Day",
    },
  },
  "06-26": {
    src: "/holidays/ngay-quoc-te-phong-chong-ma-tuy.png",
    alt: {
      vi: "Ngày Quốc tế phòng, chống ma túy",
      en: "International Day against Drug Abuse and Illicit Trafficking",
    },
  },
  "06-28": {
    src: "/holidays/ngay-gia-dinh-viet-nam.png",
    alt: {
      vi: "Ngày Gia đình Việt Nam",
      en: "Vietnamese Family Day",
    },
  },
  "07-11": {
    src: "/holidays/ngay-dan-so-the-gioi.png",
    alt: {
      vi: "Ngày Dân số Thế giới",
      en: "World Population Day",
    },
  },
  "07-27": {
    src: "/holidays/ngay-thuong-binh-liet-si.png",
    alt: {
      vi: "Ngày Thương binh - Liệt sĩ",
      en: "Vietnam War Invalids and Martyrs Day",
    },
  },
  "07-28": {
    src: "/holidays/ngay-viem-gan-the-gioi.png",
    alt: {
      vi: "Ngày Viêm gan Thế giới",
      en: "World Hepatitis Day",
    },
  },
  "08-12": {
    src: "/holidays/ngay-quoc-te-thanh-nien.png",
    alt: {
      vi: "Ngày Quốc tế Thanh niên",
      en: "International Youth Day",
    },
  },
  "08-19": {
    src: "/holidays/ngay-cach-mang-thang-tam.png",
    alt: {
      vi: "Ngày Cách mạng Tháng Tám",
      en: "August Revolution Day",
    },
  },
  "09-02": {
    src: "/holidays/quoc-khanh-nuoc-cong-hoa-xa-hoi-chu-nghia-viet-nam.png",
    alt: {
      vi: "Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam",
      en: "Vietnam National Day",
    },
  },
  "09-05": {
    src: "/holidays/ngay-quoc-te-tu-thien.png",
    alt: {
      vi: "Ngày Quốc tế Từ thiện",
      en: "International Day of Charity",
    },
  },
  "09-08": {
    src: "/holidays/ngay-quoc-te-xoa-mu-chu.png",
    alt: {
      vi: "Ngày Quốc tế Xóa mù chữ",
      en: "International Literacy Day",
    },
  },
  "09-21": {
    src: "/holidays/ngay-quoc-te-hoa-binh.png",
    alt: {
      vi: "Ngày Quốc tế Hòa bình",
      en: "International Day of Peace",
    },
  },
  "09-27": {
    src: "/holidays/ngay-du-lich-the-gioi.png",
    alt: {
      vi: "Ngày Du lịch Thế giới",
      en: "World Tourism Day",
    },
  },
  "10-01": {
    src: "/holidays/ngay-quoc-te-nguoi-cao-tuoi.png",
    alt: {
      vi: "Ngày Quốc tế Người cao tuổi",
      en: "International Day of Older Persons",
    },
  },
  "10-05": {
    src: "/holidays/ngay-nha-giao-the-gioi.png",
    alt: {
      vi: "Ngày Nhà giáo Thế giới",
      en: "World Teachers' Day",
    },
  },
  "10-10": {
    src: "/holidays/ngay-giai-phong-thu-do.png",
    alt: {
      vi: "Ngày Giải phóng Thủ đô",
      en: "Hanoi Liberation Day",
    },
  },
  "10-13": {
    src: "/holidays/ngay-doanh-nhan-viet-nam.png",
    alt: {
      vi: "Ngày Doanh nhân Việt Nam",
      en: "Vietnamese Entrepreneurs' Day",
    },
  },
  "10-16": {
    src: "/holidays/ngay-luong-thuc-the-gioi.png",
    alt: {
      vi: "Ngày Lương thực Thế giới",
      en: "World Food Day",
    },
  },
  "10-20": {
    src: "/holidays/ngay-phu-nu-viet-nam.png",
    alt: {
      vi: "Ngày Phụ nữ Việt Nam",
      en: "Vietnamese Women's Day",
    },
  },
  "10-24": {
    src: "/holidays/ngay-lien-hop-quoc.png",
    alt: {
      vi: "Ngày Liên Hợp Quốc",
      en: "United Nations Day",
    },
  },
  "10-31": {
    src: "/holidays/le-hoi-halloween.png",
    alt: {
      vi: "Lễ hội Halloween",
      en: "Halloween",
    },
  },
  "11-09": {
    src: "/holidays/ngay-phap-luat-viet-nam.png",
    alt: {
      vi: "Ngày Pháp luật Việt Nam",
      en: "Vietnam Law Day",
    },
  },
  "11-14": {
    src: "/holidays/ngay-dai-thao-duong-the-gioi.png",
    alt: {
      vi: "Ngày Đái tháo đường Thế giới",
      en: "World Diabetes Day",
    },
  },
  "11-19": {
    src: "/holidays/ngay-quoc-te-nam-gioi.png",
    alt: {
      vi: "Ngày Quốc tế Nam giới",
      en: "International Men's Day",
    },
  },
  "11-20": {
    src: "/holidays/ngay-nha-giao-viet-nam.png",
    alt: {
      vi: "Ngày Nhà giáo Việt Nam",
      en: "Vietnamese Teachers' Day",
    },
  },
  "11-25": {
    src: "/holidays/ngay-quoc-te-xoa-bo-bao-luc-doi-voi-phu-nu.png",
    alt: {
      vi: "Ngày Quốc tế xóa bỏ bạo lực đối với phụ nữ",
      en: "International Day for the Elimination of Violence against Women",
    },
  },
  "12-01": {
    src: "/holidays/ngay-the-gioi-phong-chong-aids.png",
    alt: {
      vi: "Ngày Thế giới phòng, chống AIDS",
      en: "World AIDS Day",
    },
  },
  "12-03": {
    src: "/holidays/ngay-quoc-te-nguoi-khuyet-tat.png",
    alt: {
      vi: "Ngày Quốc tế Người khuyết tật",
      en: "International Day of Persons with Disabilities",
    },
  },
  "12-05": {
    src: "/holidays/ngay-tinh-nguyen-vien-quoc-te.png",
    alt: {
      vi: "Ngày Tình nguyện viên Quốc tế",
      en: "International Volunteer Day",
    },
  },
  "12-10": {
    src: "/holidays/ngay-nhan-quyen-quoc-te.png",
    alt: {
      vi: "Ngày Nhân quyền Quốc tế",
      en: "Human Rights Day",
    },
  },
  "12-22": {
    src: "/holidays/ngay-thanh-lap-quan-doi-nhan-dan-viet-nam.png",
    alt: {
      vi: "Ngày thành lập Quân đội Nhân dân Việt Nam",
      en: "Vietnam People's Army Foundation Day",
    },
  },
  "12-24": {
    src: "/holidays/dem-giang-sinh.png",
    alt: {
      vi: "Đêm Giáng sinh",
      en: "Christmas Eve",
    },
  },
  "12-25": {
    src: "/holidays/le-giang-sinh.png",
    alt: {
      vi: "Lễ Giáng sinh",
      en: "Christmas Day",
    },
  },
  "12-31": {
    src: "/holidays/dem-giao-thua-duong-lich.png",
    alt: {
      vi: "Đêm Giao thừa Dương lịch",
      en: "New Year's Eve",
    },
  },
};

const LUNAR_NEW_YEAR_EVE_IMAGE: HolidayVisual = {
  src: "/holidays/dem-giao-thua-am-lich.png",
  alt: {
    vi: "Đêm Giao thừa Âm lịch",
    en: "Lunar New Year's Eve",
  },
};

const LUNAR_HOLIDAY_IMAGES: Record<string, HolidayVisual> = {
  "01-01": {
    src: "/holidays/tet-mung-1.png",
    alt: {
      vi: "Tết Nguyên Đán",
      en: "Lunar New Year",
    },
  },
  "01-02": {
    src: "/holidays/tet-mung-2.png",
    alt: {
      vi: "Mùng 2 Tết Nguyên Đán",
      en: "Second day of Lunar New Year",
    },
  },
  "01-03": {
    src: "/holidays/tet-mung-3.png",
    alt: {
      vi: "Mùng 3 Tết Nguyên Đán",
      en: "Third day of Lunar New Year",
    },
  },
  "01-10": {
    src: "/holidays/via-than-tai.png",
    alt: {
      vi: "Ngày Vía Thần Tài",
      en: "God of Wealth Day",
    },
  },
  "01-15": {
    src: "/holidays/tet-nguyen-tieu.png",
    alt: {
      vi: "Tết Nguyên Tiêu",
      en: "Lantern Festival",
    },
  },
  "03-03": {
    src: "/holidays/tet-han-thuc.png",
    alt: {
      vi: "Tết Hàn Thực",
      en: "Cold Food Festival",
    },
  },
  "03-10": {
    src: "/holidays/gio-to-hung-vuong.png",
    alt: {
      vi: "Giỗ Tổ Hùng Vương",
      en: "Hung Kings Commemoration Day",
    },
  },
  "04-15": {
    src: "/holidays/le-phat-dan.png",
    alt: {
      vi: "Lễ Phật Đản",
      en: "Vesak Day",
    },
  },
  "05-05": {
    src: "/holidays/tet-doan-ngo.png",
    alt: {
      vi: "Tết Đoan Ngọ",
      en: "Dragon Boat Festival",
    },
  },
  "07-07": {
    src: "/holidays/le-that-tich.png",
    alt: {
      vi: "Lễ Thất Tịch",
      en: "Qixi Festival",
    },
  },
  "07-15": {
    src: "/holidays/le-vu-lan.png",
    alt: {
      vi: "Lễ Vu Lan",
      en: "Vu Lan Festival",
    },
  },
  "08-15": {
    src: "/holidays/tet-trung-thu.png",
    alt: {
      vi: "Tết Trung Thu",
      en: "Mid-Autumn Festival",
    },
  },
  "09-09": {
    src: "/holidays/tet-trung-cuu.png",
    alt: {
      vi: "Tết Trùng Cửu",
      en: "Double Ninth Festival",
    },
  },
  "10-10": {
    src: "/holidays/tet-trung-thap.png",
    alt: {
      vi: "Tết Trùng Thập",
      en: "Double Tenth Festival",
    },
  },
  "12-23": {
    src: "/holidays/tet-ong-cong-ong-tao.png",
    alt: {
      vi: "Tết Ông Công Ông Táo",
      en: "Kitchen Gods Festival",
    },
  },
};

const DYNAMIC_HOLIDAY_IMAGES: Record<string, HolidayVisual> = {
  easter: {
    src: "/holidays/le-phuc-sinh.png",
    alt: {
      vi: "Lễ Phục Sinh",
      en: "Easter Sunday",
    },
  },
  "mothers-day": {
    src: "/holidays/ngay-cua-me.png",
    alt: {
      vi: "Ngày của Mẹ",
      en: "Mother's Day",
    },
  },
  "fathers-day": {
    src: "/holidays/ngay-cua-cha.png",
    alt: {
      vi: "Ngày của Cha",
      en: "Father's Day",
    },
  },
  "earth-hour": {
    src: "/holidays/gio-trai-dat.png",
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

function getHolidayVisual(date: Date): HolidayVisual | null {
  // Kiểm tra Giao thừa âm lịch trước
  if (isLunarNewYearEve(date)) {
    return {
      src: LUNAR_NEW_YEAR_EVE_IMAGE.src,
      alt: {
        vi: LUNAR_NEW_YEAR_EVE_IMAGE.alt.vi,
        en: LUNAR_NEW_YEAR_EVE_IMAGE.alt.en,
      },
    };
  }

  const lunarVisual = LUNAR_HOLIDAY_IMAGES[getLunarKey(date)];

  if (lunarVisual) {
    return {
      src: lunarVisual.src,
      alt: {
        vi: lunarVisual.alt.vi,
        en: lunarVisual.alt.en,
      },
    };
  }

  const solarVisual = SOLAR_HOLIDAY_IMAGES[getDateKey(date)];

  if (solarVisual) {
    return {
      src: solarVisual.src,
      alt: {
        vi: solarVisual.alt.vi,
        en: solarVisual.alt.en,
      },
    };
  }

  const dynamicKey = getDynamicHolidayImageKey(date);

  const dynamicVisual = dynamicKey
    ? DYNAMIC_HOLIDAY_IMAGES[dynamicKey]
    : undefined;

  if (dynamicVisual) {
    return {
      src: dynamicVisual.src,
      alt: {
        vi: dynamicVisual.alt.vi,
        en: dynamicVisual.alt.en,
      },
    };
  }

  return null;
}

const SOLAR_HOLIDAYS: Record<string, HolidayName[]> = {
  "01-01": [{ vi: "Tết Dương lịch", en: "New Year's Day" }],
  "01-09": [
    {
      vi: "Ngày Học sinh - Sinh viên Việt Nam",
      en: "Vietnamese Students' Day",
    },
  ],
  "02-03": [
    {
      vi: "Ngày thành lập Đảng Cộng sản Việt Nam",
      en: "Communist Party of Vietnam Foundation Day",
    },
  ],
  "02-14": [{ vi: "Ngày Lễ Tình nhân", en: "Valentine's Day" }],
  "02-27": [{ vi: "Ngày Thầy thuốc Việt Nam", en: "Vietnamese Doctors' Day" }],
  "03-08": [{ vi: "Ngày Quốc tế Phụ nữ", en: "International Women's Day" }],
  "03-20": [
    { vi: "Ngày Quốc tế Hạnh phúc", en: "International Day of Happiness" },
  ],
  "03-22": [{ vi: "Ngày Nước Thế giới", en: "World Water Day" }],
  "03-26": [
    {
      vi: "Ngày thành lập Đoàn TNCS Hồ Chí Minh",
      en: "Ho Chi Minh Communist Youth Union Foundation Day",
    },
  ],
  "04-01": [{ vi: "Ngày Cá tháng Tư", en: "April Fools' Day" }],
  "04-07": [{ vi: "Ngày Sức khỏe Thế giới", en: "World Health Day" }],
  "04-22": [{ vi: "Ngày Trái Đất", en: "Earth Day" }],
  "04-23": [
    {
      vi: "Ngày Sách và Bản quyền Thế giới",
      en: "World Book and Copyright Day",
    },
  ],
  "04-30": [
    {
      vi: "Ngày Giải phóng miền Nam, thống nhất đất nước",
      en: "Reunification Day",
    },
  ],
  "05-01": [{ vi: "Ngày Quốc tế Lao động", en: "International Workers' Day" }],
  "05-07": [
    { vi: "Ngày Chiến thắng Điện Biên Phủ", en: "Dien Bien Phu Victory Day" },
  ],
  "05-15": [
    { vi: "Ngày Quốc tế Gia đình", en: "International Day of Families" },
  ],
  "05-19": [
    {
      vi: "Ngày sinh Chủ tịch Hồ Chí Minh",
      en: "President Ho Chi Minh's Birthday",
    },
  ],
  "05-31": [{ vi: "Ngày Thế giới Không thuốc lá", en: "World No Tobacco Day" }],
  "06-01": [
    { vi: "Ngày Quốc tế Thiếu nhi", en: "International Children's Day" },
  ],
  "06-05": [{ vi: "Ngày Môi trường Thế giới", en: "World Environment Day" }],
  "06-08": [{ vi: "Ngày Đại dương Thế giới", en: "World Oceans Day" }],
  "06-21": [
    {
      vi: "Ngày Báo chí Cách mạng Việt Nam",
      en: "Vietnam Revolutionary Press Day",
    },
  ],
  "06-26": [
    {
      vi: "Ngày Quốc tế phòng, chống ma túy",
      en: "International Day against Drug Abuse and Illicit Trafficking",
    },
  ],
  "06-28": [{ vi: "Ngày Gia đình Việt Nam", en: "Vietnamese Family Day" }],
  "07-11": [{ vi: "Ngày Dân số Thế giới", en: "World Population Day" }],
  "07-27": [
    {
      vi: "Ngày Thương binh - Liệt sĩ",
      en: "Vietnam War Invalids and Martyrs Day",
    },
  ],
  "07-28": [{ vi: "Ngày Viêm gan Thế giới", en: "World Hepatitis Day" }],
  "08-12": [{ vi: "Ngày Quốc tế Thanh niên", en: "International Youth Day" }],
  "08-19": [{ vi: "Ngày Cách mạng Tháng Tám", en: "August Revolution Day" }],
  "09-02": [
    {
      vi: "Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam",
      en: "Vietnam National Day",
    },
  ],
  "09-05": [
    { vi: "Ngày Quốc tế Từ thiện", en: "International Day of Charity" },
  ],
  "09-08": [
    { vi: "Ngày Quốc tế Xóa mù chữ", en: "International Literacy Day" },
  ],
  "09-21": [{ vi: "Ngày Quốc tế Hòa bình", en: "International Day of Peace" }],
  "09-27": [{ vi: "Ngày Du lịch Thế giới", en: "World Tourism Day" }],
  "10-01": [
    {
      vi: "Ngày Quốc tế Người cao tuổi",
      en: "International Day of Older Persons",
    },
  ],
  "10-05": [{ vi: "Ngày Nhà giáo Thế giới", en: "World Teachers' Day" }],
  "10-10": [
    { vi: "Ngày Giải phóng Thủ đô", en: "Hanoi Liberation Day" },
    { vi: "Ngày Sức khỏe Tâm thần Thế giới", en: "World Mental Health Day" },
  ],
  "10-13": [
    { vi: "Ngày Doanh nhân Việt Nam", en: "Vietnamese Entrepreneurs' Day" },
  ],
  "10-16": [{ vi: "Ngày Lương thực Thế giới", en: "World Food Day" }],
  "10-20": [{ vi: "Ngày Phụ nữ Việt Nam", en: "Vietnamese Women's Day" }],
  "10-24": [{ vi: "Ngày Liên Hợp Quốc", en: "United Nations Day" }],
  "10-31": [{ vi: "Lễ hội Halloween", en: "Halloween" }],
  "11-09": [{ vi: "Ngày Pháp luật Việt Nam", en: "Vietnam Law Day" }],
  "11-14": [{ vi: "Ngày Đái tháo đường Thế giới", en: "World Diabetes Day" }],
  "11-19": [{ vi: "Ngày Quốc tế Nam giới", en: "International Men's Day" }],
  "11-20": [
    { vi: "Ngày Nhà giáo Việt Nam", en: "Vietnamese Teachers' Day" },
    { vi: "Ngày Trẻ em Thế giới", en: "World Children's Day" },
  ],
  "11-25": [
    {
      vi: "Ngày Quốc tế xóa bỏ bạo lực đối với phụ nữ",
      en: "International Day for the Elimination of Violence against Women",
    },
  ],
  "12-01": [{ vi: "Ngày Thế giới phòng, chống AIDS", en: "World AIDS Day" }],
  "12-03": [
    {
      vi: "Ngày Quốc tế Người khuyết tật",
      en: "International Day of Persons with Disabilities",
    },
  ],
  "12-05": [
    { vi: "Ngày Tình nguyện viên Quốc tế", en: "International Volunteer Day" },
  ],
  "12-10": [{ vi: "Ngày Nhân quyền Quốc tế", en: "Human Rights Day" }],
  "12-22": [
    {
      vi: "Ngày thành lập Quân đội Nhân dân Việt Nam",
      en: "Vietnam People's Army Foundation Day",
    },
  ],
  "12-24": [{ vi: "Đêm Giáng sinh", en: "Christmas Eve" }],
  "12-25": [{ vi: "Lễ Giáng sinh", en: "Christmas Day" }],
  "12-31": [{ vi: "Đêm Giao thừa Dương lịch", en: "New Year's Eve" }],
};

const LUNAR_HOLIDAYS: Record<string, HolidayName[]> = {
  "01-01": [{ vi: "Tết Nguyên Đán", en: "Lunar New Year" }],
  "01-02": [
    { vi: "Mùng 2 Tết Nguyên Đán", en: "Second day of Lunar New Year" },
  ],
  "01-03": [{ vi: "Mùng 3 Tết Nguyên Đán", en: "Third day of Lunar New Year" }],
  "01-10": [{ vi: "Ngày Vía Thần Tài", en: "God of Wealth Day" }],
  "01-15": [{ vi: "Tết Nguyên Tiêu", en: "Lantern Festival" }],
  "03-03": [{ vi: "Tết Hàn Thực", en: "Cold Food Festival" }],
  "03-10": [{ vi: "Giỗ Tổ Hùng Vương", en: "Hung Kings Commemoration Day" }],
  "04-15": [{ vi: "Lễ Phật Đản", en: "Vesak Day" }],
  "05-05": [{ vi: "Tết Đoan Ngọ", en: "Dragon Boat Festival" }],
  "07-07": [{ vi: "Lễ Thất Tịch", en: "Qixi Festival" }],
  "07-15": [{ vi: "Lễ Vu Lan", en: "Vu Lan Festival" }],
  "08-15": [{ vi: "Tết Trung Thu", en: "Mid-Autumn Festival" }],
  "09-09": [{ vi: "Tết Trùng Cửu", en: "Double Ninth Festival" }],
  "10-10": [{ vi: "Tết Trùng Thập", en: "Double Tenth Festival" }],
  "12-23": [{ vi: "Tết Ông Công Ông Táo", en: "Kitchen Gods Festival" }],
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

// Những ngày lễ "quan trọng" được hiển thị modal chúc mừng kèm bóng bay + pháo hoa.
// Ngày lễ thường vẫn hiện modal thông thường (chỉ có bóng bay) như cũ.
const IMPORTANT_SOLAR_HOLIDAYS = new Set([
  "01-01", // Tết Dương lịch
  "04-30", // Ngày Giải phóng miền Nam, thống nhất đất nước
  "05-01", // Ngày Quốc tế Lao động
  "09-02", // Quốc khánh nước CHXHCN Việt Nam
  "12-24", // Đêm Giáng sinh
  "12-25", // Lễ Giáng sinh
  "12-31", // Đêm Giao thừa Dương lịch
]);

const IMPORTANT_LUNAR_HOLIDAYS = new Set([
  "01-01", // Tết Nguyên Đán (mùng 1)
  "01-02", // Mùng 2 Tết Nguyên Đán
  "01-03", // Mùng 3 Tết Nguyên Đán
  "01-15", // Tết Nguyên Tiêu
  "03-10", // Giỗ Tổ Hùng Vương
  "08-15", // Tết Trung Thu
  "12-23", // Tết Ông Công Ông Táo
]);

function isImportantHoliday(date: Date) {
  if (isLunarNewYearEve(date)) return true; // Đêm Giao thừa âm lịch

  if (IMPORTANT_SOLAR_HOLIDAYS.has(getDateKey(date))) return true;

  return IMPORTANT_LUNAR_HOLIDAYS.has(getLunarKey(date));
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

function getCalendarHolidays(date: Date, language: "vi" | "en"): string[] {
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

function getSolarHoliday(date: Date, language: "vi" | "en" = "vi") {
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

// Bỏ dấu tiếng Việt + viết thường để so khớp tên tỉnh/thành khi tìm kiếm
function normalizeVietnameseText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .trim();
}

// ----- Gợi ý địa chỉ Việt Nam qua API Nominatim (OSM) -----
// Có dữ liệu đường/phố + phường/xã + tỉnh/thành MỚI (sau sáp nhập 2025), miễn phí, không cần key.
type AddressResult = {
  id: string;
  name: string;
  detail: string;
  latitude: number;
  longitude: number;
  category: "road" | "admin" | "poi";
};

type NominatimResult = {
  place_id: number;
  name?: string;
  display_name: string;
  lat: string;
  lon: string;
  addresstype?: string;
  type?: string;
};

const ADDRESS_ROAD_TYPES = [
  "road",
  "residential",
  "pedestrian",
  "living_street",
  "footway",
  "cycleway",
  "path",
  "service",
  "track",
  "primary",
  "secondary",
  "tertiary",
  "trunk",
  "unclassified",
];

const ADDRESS_ADMIN_TYPES = [
  "province",
  "state",
  "city",
  "town",
  "municipality",
  "county",
  "borough",
  "suburb",
  "quarter",
  "village",
  "city_district",
];

function toAddressResult(item: NominatimResult): AddressResult {
  const kind = item.addresstype ?? item.type ?? "";

  const category: AddressResult["category"] = ADDRESS_ROAD_TYPES.includes(kind)
    ? "road"
    : ADDRESS_ADMIN_TYPES.includes(kind)
      ? "admin"
      : "poi";

  const parts = item.display_name
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    id: String(item.place_id),
    name: item.name || parts[0] || item.display_name,
    // Các phần sau tên chính: phường/xã, tỉnh/thành... để làm mô tả nhỏ
    detail: parts.slice(1, 4).join(", "),
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    category,
  };
}

// ----- Đơn vị hành chính Việt Nam MỚI (34 tỉnh/thành + ~3.321 xã/phường, sau 1/7/2025) -----
// Nguồn: zuydd/vn-geo (tải sẵn vào public/data/admin/), nạp lười 1 lần rồi cache.
type NewAdminProvince = {
  code: string;
  name: string;
  slug: string;
  type: string;
  fullName: string;
};

type NewAdminWard = {
  code: string;
  name: string;
  fullName: string;
  slug: string;
  type: string;
  provinceCode: string;
};

type AdminData = {
  provinces: NewAdminProvince[];
  wards: NewAdminWard[];
};

let adminDataCache: Promise<AdminData> | null = null;

function loadAdminData(): Promise<AdminData> {
  if (!adminDataCache) {
    adminDataCache = Promise.all([
      fetch("/data/admin/provinces.json").then((response) => response.json()),
      fetch("/data/admin/wards.json").then((response) => response.json()),
    ]).then(([provinceList, wardList]) => ({
      provinces: provinceList as NewAdminProvince[],
      wards: wardList as NewAdminWard[],
    }));
  }

  return adminDataCache;
}

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

// Dự báo 16 ngày rút gọn dùng cho icon thời tiết trên ô lịch
type CalendarDailyForecast = {
  key: string;
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
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

  const time = new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(roundedHour);

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

// =========================================================
// VẠN NIÊN - CAN CHI, TIẾT KHÍ, GIỜ HOÀNG ĐẠO, PHA TRĂNG
// =========================================================

const GAN_HAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const GAN_VIET = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
];

const ZHI_HAN = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];
const ZHI_VIET = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];

// Chuyển Can Chi chữ Hán (ví dụ "甲子") sang tiếng Việt ("Giáp Tý")
function toVietnameseCanChi(ganZhi: string) {
  return ganZhi
    .split("")
    .map((char) => {
      const ganIndex = GAN_HAN.indexOf(char);
      if (ganIndex >= 0) return GAN_VIET[ganIndex];
      const zhiIndex = ZHI_HAN.indexOf(char);
      if (zhiIndex >= 0) return ZHI_VIET[zhiIndex];
      return char;
    })
    .join(" ");
}

// 24 tiết khí: tên Hán → tên Việt
const JIE_QI_VIET: Record<string, string> = {
  立春: "Lập xuân",
  雨水: "Vũ thủy",
  惊蛰: "Kinh trập",
  春分: "Xuân phân",
  清明: "Thanh minh",
  谷雨: "Cốc vũ",
  立夏: "Lập hạ",
  小满: "Tiểu mãn",
  芒种: "Mang chủng",
  夏至: "Hạ chí",
  小暑: "Tiểu thử",
  大暑: "Đại thử",
  立秋: "Lập thu",
  处暑: "Xử thử",
  白露: "Bạch lộ",
  秋分: "Thu phân",
  寒露: "Hàn lộ",
  霜降: "Sương giáng",
  立冬: "Lập đông",
  小雪: "Tiểu tuyết",
  大雪: "Đại tuyết",
  冬至: "Đông chí",
  小寒: "Tiểu hàn",
  大寒: "Đại hàn",
};

// Thông tin vạn niên cho một ngày: can chi, tiết khí, pha trăng, giờ hoàng đạo
// Bảng dịch các mục 宜 (nên làm) / 忌 (kiêng làm) sang tiếng Việt
const YI_JI_VIET: Record<string, string> = {
  祭祀: "Cúng lễ",
  祈福: "Cầu phước",
  求嗣: "Cầu con",
  开光: "Khai quang",
  出行: "Đi xa",
  嫁娶: "Cưới hỏi",
  纳采: "Dâng lễ cầu hôn",
  订盟: "Đính ương",
  订婚: "Đính ương",
  领证: "Đăng ký kết hôn",
  搬家: "Chuyển nhà",
  移徙: "Di chuyển",
  安床: "Đặt giường",
  入宅: "Về nhà mới",
  动土: "Động thổ",
  起基: "Dựng móng",
  上梁: "Đặt rường cột",
  竖柱: "Dựng cột",
  修造: "Sửa chữa nhà",
  装修: "Tu bổ nhà",
  盖屋: "Lợp mái nhà",
  破土: "Phá đất",
  安葬: "An táng",
  立碑: "Dựng bia",
  开市: "Khai trương",
  交易: "Mua bán",
  纳财: "Thu tiền của",
  挂匾: "Treo biển hiệu",
  栽种: "Trồng trọt",
  纳畜: "Mua súc vật",
  牧养: "Chăn nuôi",
  治病: "Chữa bệnh",
  求医: "Tìm thầy chữa bệnh",
  探病: "Thăm bệnh",
  破屋: "Phá dỡ nhà",
  拆卸: "Tháo dỡ",
  修坟: "Sửa mộ",
  作灶: "Làm bếp",
  扫舍: "Dọn nhà",
  修路: "Làm đường",
  伐木: "Chặt cây",
  畋猎: "Săn bắn",
  取渔: "Đánh cá",
  开池: "Đào ao",
  穿井: "Đào giếng",
  补垣: "Vá tường",
  造仓: "Xây kho",
  理发: "Cắt tóc",
  沐浴: "Tắm gội",
  词讼: "Kiện tụng",
  乘船: "Đi thuyền",
  无: "Không",
};

// Hướng xuất hành: dịch mô tả hướng (正北, 东南...) sang Việt/Anh
const DIRECTION_VIET: Record<string, string> = {
  正北: "Chính Bắc",
  东北: "Đông Bắc",
  正东: "Chính Đông",
  东南: "Đông Nam",
  正南: "Chính Nam",
  西南: "Tây Nam",
  正西: "Chính Tây",
  西北: "Tây Bắc",
  中: "Trung cung",
};

const DIRECTION_EN: Record<string, string> = {
  正北: "North",
  东北: "Northeast",
  正东: "East",
  东南: "Southeast",
  正南: "South",
  西南: "Southwest",
  正西: "West",
  西北: "Northwest",
  中: "Center",
};

// 12 Trực (建除十二神): tên + ý nghĩa ngắn gọn
const TRUC_DATA: Record<
  string,
  { vi: string; viDesc: string; en: string; enDesc: string }
> = {
  建: {
    vi: "Kiến",
    viDesc: "Tốt cho khởi sự, khai trương, cầu phước",
    en: "Jian (Establish)",
    enDesc: "Good for starting new ventures",
  },
  除: {
    vi: "Trừ",
    viDesc: "Tốt cho dọn dẹp, chữa bệnh, gỡ bỏ điều xấu",
    en: "Chu (Remove)",
    enDesc: "Good for cleansing and removing bad luck",
  },
  满: {
    vi: "Mãn",
    viDesc: "Tốt cho lễ tạ, cầu phước; hạn chế khởi sự",
    en: "Man (Full)",
    enDesc: "Good for offerings; avoid big starts",
  },
  平: {
    vi: "Bình",
    viDesc: "Ngày ổn định — hợp hòa giải, sửa sang",
    en: "Ping (Level)",
    enDesc: "Stable day; good for reconciliation",
  },
  定: {
    vi: "Định",
    viDesc: "Tốt cho ký kết, đặt đáy, an định",
    en: "Ding (Settle)",
    enDesc: "Good for agreements and foundations",
  },
  执: {
    vi: "Chấp",
    viDesc: "Tốt cho thi cử, củng cố; tránh tranh chấp",
    en: "Zhi (Hold)",
    enDesc: "Good for exams; avoid disputes",
  },
  破: {
    vi: "Phá",
    viDesc: "Chỉ hợp phá dỡ, tháo gỡ; không khởi sự",
    en: "Po (Break)",
    enDesc: "Only for demolition; avoid new starts",
  },
  危: {
    vi: "Nguy",
    viDesc: "Nên thận trọng, hạn chế việc lớn",
    en: "Wei (Peril)",
    enDesc: "Be cautious; avoid major actions",
  },
  成: {
    vi: "Thành",
    viDesc: "Tốt cho thành lập, cưới hỏi, khai trương",
    en: "Cheng (Complete)",
    enDesc: "Good for weddings and openings",
  },
  收: {
    vi: "Thu",
    viDesc: "Tốt cho thu hoạch, tích trữ, an táng",
    en: "Shou (Harvest)",
    enDesc: "Good for harvest and storage",
  },
  开: {
    vi: "Khai",
    viDesc: "Tốt cho khai trương, khai quang, khởi công",
    en: "Kai (Open)",
    enDesc: "Good for openings and beginnings",
  },
  闭: {
    vi: "Bế",
    viDesc: "Hợp an táng, đắp nền; hạn chế việc khác",
    en: "Bi (Close)",
    enDesc: "Good for burial; avoid other matters",
  },
};

// Con giáp cho mục "tuổi xung khắc ngày"
const SHENG_XIAO_VIET: Record<string, string> = {
  鼠: "Chuột",
  牛: "Trâu",
  虎: "Hổ",
  兔: "Mèo",
  龙: "Rồng",
  蛇: "Rắn",
  马: "Ngựa",
  羊: "Dê",
  猴: "Khỉ",
  鸡: "Gà",
  狗: "Chó",
  猪: "Lợn",
};

const SHENG_XIAO_EN: Record<string, string> = {
  鼠: "Rat",
  牛: "Ox",
  虎: "Tiger",
  兔: "Rabbit",
  龙: "Dragon",
  蛇: "Snake",
  马: "Horse",
  羊: "Goat",
  猴: "Monkey",
  鸡: "Rooster",
  狗: "Dog",
  猪: "Pig",
};

// Phiên âm chi địa cho bản tiếng Anh
const ZHI_PINYIN: Record<string, string> = {
  子: "Zi",
  丑: "Chou",
  寅: "Yin",
  卯: "Mao",
  辰: "Chen",
  巳: "Si",
  午: "Wu",
  未: "Wei",
  申: "Shen",
  酉: "You",
  戌: "Xu",
  亥: "Hai",
};

function getAlmanacInfo(date: Date, language: Language) {
  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const lunar = solar.getLunar();

  const canChi =
    language === "vi"
      ? `${toVietnameseCanChi(lunar.getDayInGanZhi())} · ${toVietnameseCanChi(lunar.getMonthInGanZhi())} · ${toVietnameseCanChi(lunar.getYearInGanZhi())}`
      : `${lunar.getDayInGanZhi()} · ${lunar.getMonthInGanZhi()} · ${lunar.getYearInGanZhi()}`;

  let jieQi = language === "vi" ? "—" : "—";
  try {
    const raw = lunar.getPrevJieQi(true).getName();
    jieQi = language === "vi" ? (JIE_QI_VIET[raw] ?? raw) : raw;
  } catch {
    // bỏ qua lỗi đọc tiết khí
  }

  const day = lunar.getDay();
  let moonIcon = "🌑";
  let moonLabel = language === "vi" ? "Trăng mới (Sóc)" : "New moon";
  if (day >= 2 && day <= 6) {
    moonIcon = "🌒";
    moonLabel =
      language === "vi" ? "Trăng lưỡi liềm đầu tháng" : "Waxing crescent";
  } else if (day >= 7 && day <= 9) {
    moonIcon = "🌓";
    moonLabel = language === "vi" ? "Trăng thượng huyền" : "First quarter";
  } else if (day >= 10 && day <= 13) {
    moonIcon = "🌔";
    moonLabel = language === "vi" ? "Trăng gần tròn" : "Waxing gibbous";
  } else if (day >= 14 && day <= 17) {
    moonIcon = "🌕";
    moonLabel = language === "vi" ? "Trăng tròn (Vọng)" : "Full moon";
  } else if (day >= 18 && day <= 21) {
    moonIcon = "🌖";
    moonLabel =
      language === "vi" ? "Trăng khuyết cuối tháng" : "Waning gibbous";
  } else if (day >= 22 && day <= 23) {
    moonIcon = "🌗";
    moonLabel = language === "vi" ? "Trăng hạ huyền" : "Last quarter";
  } else if (day >= 24 && day <= 28) {
    moonIcon = "🌘";
    moonLabel =
      language === "vi" ? "Trăng lưỡi liềm cuối tháng" : "Waning crescent";
  }

  // Giờ hoàng đạo: các giờ có thiên thần loại "黄道" (hoàng đạo)
  const luckyHours = lunar
    .getTimes()
    .filter((time) => time.getTianShenType() === "黄道")
    .map(
      (time) =>
        `${toVietnameseCanChi(time.getZhi())} (${time.getMinHm()}–${time.getMaxHm()})`,
    );

  // Ngày hoàng đạo / hắc đạo (thiên thần của ngày)
  let dayLuck: "hoangDao" | "heiDao" = "hoangDao";
  let dayLuckLabel =
    language === "vi" ? "Ngày hoàng đạo — tốt" : "Yellow-path day — auspicious";
  try {
    const tianShenType = lunar.getDayTianShenType() ?? "";
    if (tianShenType.includes("黑")) {
      dayLuck = "heiDao";
      dayLuckLabel =
        language === "vi"
          ? "Ngày hắc đạo — nên hạn chế"
          : "Black-path day — be cautious";
    }
  } catch {
    // bỏ qua lỗi
  }

  // Nên làm / Kiêng làm (dịch các mục 宜 / 忌 sang tiếng Việt)
  const translateYiJi = (items: string[]) =>
    items
      .slice(0, 6)
      .map((item) => YI_JI_VIET[item] ?? item)
      .join(" · ");

  let yi = "";
  let ji = "";
  try {
    yi = translateYiJi(lunar.getDayYi());
    ji = translateYiJi(lunar.getDayJi());
  } catch {
    // bỏ qua lỗi
  }

  // Hướng xuất hành: Hỷ thần / Tài thần / Phúc thần
  let directions = "";
  try {
    if (language === "vi") {
      directions = `Hỷ thần: ${
        DIRECTION_VIET[lunar.getDayPositionXiDesc()] ??
        lunar.getDayPositionXiDesc()
      } · Tài thần: ${
        DIRECTION_VIET[lunar.getDayPositionCaiDesc()] ??
        lunar.getDayPositionCaiDesc()
      } · Phúc thần: ${
        DIRECTION_VIET[lunar.getDayPositionFuDesc(1)] ??
        lunar.getDayPositionFuDesc(1)
      }`;
    } else {
      directions = `Luck God: ${
        DIRECTION_EN[lunar.getDayPositionXiDesc()] ??
        lunar.getDayPositionXiDesc()
      } · Wealth God: ${
        DIRECTION_EN[lunar.getDayPositionCaiDesc()] ??
        lunar.getDayPositionCaiDesc()
      } · Fortune God: ${
        DIRECTION_EN[lunar.getDayPositionFuDesc(1)] ??
        lunar.getDayPositionFuDesc(1)
      }`;
    }
  } catch {
    // bỏ qua lỗi
  }

  // 12 Trực (Trực Kiến, Trực Trừ, ...)
  let truc = "";
  try {
    const data = TRUC_DATA[lunar.getZhiXing()];
    if (data) {
      truc =
        language === "vi"
          ? `Trực ${data.vi} — ${data.viDesc}`
          : `${data.en} — ${data.enDesc}`;
    }
  } catch {
    // bỏ qua lỗi
  }

  // Tuổi xung khắc với ngày
  let chong = "";
  try {
    const zhi = lunar.getDayChong();
    const animal = lunar.getDayChongShengXiao();
    if (language === "vi") {
      const zhiVi = ZHI_VIET[ZHI_HAN.indexOf(zhi)] ?? zhi;
      chong = `Xung tuổi ${zhiVi} (con ${SHENG_XIAO_VIET[animal] ?? animal})`;
    } else {
      chong = `Clash: ${SHENG_XIAO_EN[animal] ?? animal} (${
        ZHI_PINYIN[zhi] ?? zhi
      })`;
    }
  } catch {
    // bỏ qua lỗi
  }

  return {
    canChi,
    jieQi,
    moonIcon,
    moonLabel,
    luckyHours,
    dayLuck,
    dayLuckLabel,
    yi,
    ji,
    directions,
    truc,
    chong,
  };
}

// Chi của tuổi người dùng theo năm sinh (lấy giữa năm để thuộc năm âm chính xác)
function getZhiFromBirthYear(birthYear: number): string | null {
  try {
    return Solar.fromYmd(birthYear, 6, 1).getLunar().getYearZhi();
  } catch {
    return null;
  }
}

// So sánh ngày với tuổi người dùng:
// - "clash": ngày xung với chi tuổi → nên hạn chế
// - "good": ngày hoàng đạo và không xung tuổi
// - null: trung tính / chưa nhập năm sinh
function getDayUserCompat(
  date: Date,
  userZhi: string | null,
): "clash" | "good" | null {
  if (!userZhi) return null;
  try {
    const lunar = Solar.fromYmd(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ).getLunar();
    if (lunar.getDayChong() === userZhi) return "clash";
    if (lunar.getDayTianShenType() === "黄道") return "good";
  } catch {
    // bỏ qua lỗi
  }
  return null;
}

// Khóa ngày dạng YYYY-MM-DD để tra dự báo theo ngày
function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Danh sách mọi ngày lễ trong một năm (dương lịch), sắp theo ngày
type YearHolidayItem = {
  key: string;
  date: Date;
  label: string;
  lunar: string;
  names: string;
};

function getYearHolidayList(
  year: number,
  language: "vi" | "en",
): YearHolidayItem[] {
  const list: YearHolidayItem[] = [];
  for (let m = 0; m < 12; m += 1) {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(year, m, d);
      const names = getCalendarHolidays(date, language);
      if (names.length > 0) {
        list.push({
          key: `${m + 1}-${d}`,
          date,
          label: `${d}/${m + 1}`,
          lunar: getLunarDayLabel(date),
          names: names.join(" · "),
        });
      }
    }
  }
  return list;
}

// Tách tên sự kiện đầu tiên và phần mô tả còn lại từ chuỗi tên ngày lễ
function firstEventName(names: string) {
  return names.split(" · ")[0] ?? names;
}

function firstEventDesc(names: string, language: "vi" | "en") {
  const rest = names.split(" · ").slice(1).join(" · ");

  return rest || (language === "vi" ? "Ngày đáng nhớ" : "A day to remember");
}

// Tìm ngày lễ quan trọng kế tiếp (kể cả hôm nay), tìm tối đa 400 ngày tới
function getUpcomingImportantHoliday(from: Date, language: Language) {
  for (let i = 0; i < 400; i += 1) {
    const date = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + i,
    );
    if (!isImportantHoliday(date)) continue;

    const name =
      getSolarHoliday(date, language) ??
      getCalendarNote(date, language) ??
      getHolidayVisual(date)?.alt?.[language] ??
      "";

    return { date, name, daysUntil: i };
  }
  return null;
}

function getCalendarNote(date: Date, language: Language) {
  return getCalendarHolidays(date, language).join(" • ");
}

function getDateCountdownLabel(date: Date, language: Language) {
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return language === "vi" ? "Hôm nay" : "Today";
  }

  if (diffDays > 0) {
    return language === "vi"
      ? `Còn ${diffDays} ngày`
      : `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
  }

  return language === "vi"
    ? `Đã qua ${Math.abs(diffDays)} ngày`
    : `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`;
}

async function fetchPlaceName(
  latitude: number,
  longitude: number,
  language: Language,
) {
  const fallback = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=${language}`,
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();
    const address = data.address ?? {};

    // Ưu tiên địa chỉ theo đơn vị hành chính MỚI (xã/phường + 34 tỉnh/thành)
    let adminData: AdminData | null = null;

    try {
      adminData = await loadAdminData();
    } catch {
      adminData = null;
    }

    if (adminData) {
      const stateName = normalizeVietnameseText(address.state ?? "");
      const newProvince = stateName
        ? adminData.provinces.find((province) => {
            const provinceName = normalizeVietnameseText(province.fullName);

            return (
              stateName.includes(provinceName) ||
              provinceName.includes(stateName)
            );
          })
        : undefined;

      const wardCandidates = [
        address.quarter,
        address.suburb,
        address.city_district,
        address.borough,
        address.village,
        address.town,
        address.municipality,
      ];

      const matchedWard = adminData.wards.find((ward) => {
        const wardName = normalizeVietnameseText(ward.name);

        return (
          wardName.length > 0 &&
          wardCandidates.some(
            (candidate) =>
              candidate && normalizeVietnameseText(candidate) === wardName,
          )
        );
      });

      if (matchedWard) {
        return matchedWard.fullName;
      }

      const wardName =
        address.quarter ||
        address.suburb ||
        address.city_district ||
        address.borough ||
        address.village ||
        address.town ||
        "";

      if (wardName && newProvince) {
        return `${wardName}, ${newProvince.fullName}`;
      }

      if (newProvince) {
        return newProvince.fullName;
      }
    }

    return (
      address.city ||
      address.town ||
      address.county ||
      address.state ||
      address.village ||
      data.display_name?.split(",")[0] ||
      fallback
    );
  } catch {
    return fallback;
  }
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("vi");
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [readAlertSignature, setReadAlertSignature] = useState("");
  const [windyOverlay, setWindyOverlay] = useState<WindyOverlay>("wind");
  // Chế độ xem cho khu bản đồ gộp: bản đồ Việt Nam (Leaflet) hoặc Windy
  const [mapView, setMapView] = useState<"vn" | "windy">("vn");
  const [notifyPermission, setNotifyPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [shareBusy, setShareBusy] = useState(false);
  const [weatherHistory, setWeatherHistory] = useState<HistoryEntry[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      return JSON.parse(
        window.localStorage.getItem("weather-history") ?? "[]",
      ) as HistoryEntry[];
    } catch {
      return [];
    }
  });
  const lastNotifiedSignatureRef = useRef<string | null>(null);

  const [coordinates, setCoordinates] =
    useState<Coordinates>(defaultCoordinates);
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
  // Gợi ý địa chỉ VN (đường, phường/xã, tỉnh/thành) từ API Nominatim
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const searchBlurTimerRef = useRef<number | null>(null);
  const searchDebounceRef = useRef<number | null>(null);
  const addressRequestRef = useRef(0);

  // Dọn hẹn giờ debounce khi component unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current !== null) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Ảnh nền thành phố cho hero: ẩn tạm khi thiếu file, reset khi đổi địa điểm
  const [cityPhotoFailed, setCityPhotoFailed] = useState(false);
  const [cityPhotoLocation, setCityPhotoLocation] = useState(locationName);

  // Reset cờ lỗi ảnh khi đổi địa điểm (điều chỉnh state trong lúc render thay vì useEffect)
  if (cityPhotoLocation !== locationName) {
    setCityPhotoLocation(locationName);
    setCityPhotoFailed(false);
  }

  // Danh mục hành chính mới (34 tỉnh + xã/phường) + tỉnh đang bung danh sách xã/phường
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [expandedProvinceCode, setExpandedProvinceCode] = useState<
    string | null
  >(null);

  // Nạp danh mục hành chính mới 1 lần khi mở trang
  useEffect(() => {
    let cancelled = false;

    void loadAdminData()
      .then((data) => {
        if (!cancelled) {
          setAdminData(data);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const [currentTime, setCurrentTime] = useState<Date>(
    () => new Date("2000-01-01T00:00:00.000Z"),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  // Dự báo 16 ngày rút gọn cho icon thời tiết trên ô lịch
  const [calendarDaily, setCalendarDaily] =
    useState<CalendarDailyForecast | null>(null);

  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [todayHolidayVisual, setTodayHolidayVisual] =
    useState<HolidayVisual | null>(null);
  const [todayHolidayTitle, setTodayHolidayTitle] = useState<string | null>(
    null,
  );
  const [todayHolidayImportant, setTodayHolidayImportant] = useState(false);
  const [effectsConfig, setEffectsConfig] =
    useState<HolidayEffectsConfig | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const text = translations[language];
  const isSelectedToday = isSameDate(selectedDate, currentTime);

  // Đếm ngược đến ngày lễ quan trọng kế tiếp (chỉ tính lại khi sang ngày mới)
  const todayStamp = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`;
  const upcomingHoliday = useMemo(
    () => getUpcomingImportantHoliday(new Date(), language),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayStamp, language],
  );

  const openHolidayModal = useCallback(
    (visual: HolidayVisual, title: string, important = false) => {
      setTodayHolidayVisual(visual);
      setTodayHolidayTitle(title);
      setTodayHolidayImportant(important);
      setHolidayModalOpen(true);
    },
    [],
  );

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

      try {
        const savedEffects = window.localStorage.getItem(
          "holiday-effects-config",
        );
        if (savedEffects) setEffectsConfig(JSON.parse(savedEffects));
      } catch {}

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

  // Holiday modal: show on holiday dates unless user already dismissed for today
  useEffect(() => {
    if (!hasMounted) return;

    const today = new Date();
    const visual = getHolidayVisual(today);

    if (!visual) return;

    const dateKey = getDateKey(today);
    const dismissedKey = `holiday-dismissed-${dateKey}`;

    const title =
      getSolarHoliday(today, language) ??
      getCalendarNote(today, language) ??
      visual.alt?.[language] ??
      "";
    const important = isImportantHoliday(today);
    let timerId = 0;

    try {
      const dismissed = window.localStorage.getItem(dismissedKey);

      if (dismissed !== "1") {
        // Chỉ hiển thị 1 lần: nếu người dùng đã đóng (được lưu localStorage)
        // thì không tự mở lại nữa cho đến khi sang ngày hôm sau.
        // Dùng setTimeout để tránh gọi setState đồng bộ trong effect.
        timerId = window.setTimeout(
          () => openHolidayModal(visual, title, important),
          0,
        );
      }
    } catch {
      // ignore localStorage errors
      timerId = window.setTimeout(
        () => openHolidayModal(visual, title, important),
        0,
      );
    }

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [hasMounted, language, openHolidayModal]);

  // Tải dự báo 16 ngày (nhẹ) khi mở lịch để vẽ icon thời tiết lên từng ô
  useEffect(() => {
    if (!isCalendarOpen) return;
    const key = `${coordinates.latitude},${coordinates.longitude}`;
    if (calendarDaily && calendarDaily.key === key) return;

    let cancelled = false;
    const run = async () => {
      try {
        const params = new URLSearchParams({
          latitude: String(coordinates.latitude),
          longitude: String(coordinates.longitude),
          timezone: "auto",
          forecast_days: "16",
          temperature_unit: temperatureUnit,
          daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
          ].join(","),
        });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
        );
        if (!response.ok) throw new Error("Forecast request failed");
        const data = (await response.json()) as {
          daily: {
            time: string[];
            weather_code: number[];
            temperature_2m_max: number[];
            temperature_2m_min: number[];
          };
        };
        if (cancelled) return;
        setCalendarDaily({
          key,
          time: data.daily.time,
          weatherCode: data.daily.weather_code,
          tempMax: data.daily.temperature_2m_max,
          tempMin: data.daily.temperature_2m_min,
        });
      } catch {
        // Không tải được thì lịch vẫn dùng được (chỉ thiếu icon thời tiết)
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [isCalendarOpen, coordinates, temperatureUnit, calendarDaily]);

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

    const hourlyTimer = window.setInterval(
      () => {
        void loadWeather();
      },
      60 * 60 * 1000,
    );

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

  // Keyboard shortcuts: T = theme, L = language, R = refresh, G = forecast
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === "t") {
        setTheme((previous) => (previous === "light" ? "dark" : "light"));
      } else if (key === "l") {
        setLanguage((previous) => (previous === "vi" ? "en" : "vi"));
      } else if (key === "r") {
        void loadWeather();
      } else if (key === "g") {
        document
          .getElementById("forecast")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadWeather]);

  async function handleMapSelect(selected: Coordinates) {
    setCoordinates(selected);
    setLocationLoading(true);
    setSearchResults([]);
    setAddressResults([]);
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

    // Bấm nút tìm kiếm làm input mất focus -> hủy hẹn giờ đóng dropdown
    if (searchBlurTimerRef.current !== null) {
      window.clearTimeout(searchBlurTimerRef.current);
      searchBlurTimerRef.current = null;
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
    setSearchResults([]);
    setAddressResults([]);
    setShowSearchResults(false);

    localStorage.setItem(
      "weather-location",
      JSON.stringify({
        ...selected,
        name,
      }),
    );
  }

  // Gọi API Nominatim lấy gợi ý địa chỉ Việt Nam (đường/phố, phường/xã, tỉnh/thành mới 2025)
  async function fetchAddressSuggestions(keyword: string) {
    const requestId = ++addressRequestRef.current;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=vn&accept-language=${language}&limit=8&q=${encodeURIComponent(keyword)}`,
      );

      if (!response.ok) {
        throw new Error("Address search failed");
      }

      const data = (await response.json()) as NominatimResult[];

      // Kết quả cũ của từ khóa trước đó -> bỏ qua (chống race condition)
      if (requestId !== addressRequestRef.current) {
        return;
      }

      setAddressResults(data.map((item) => toAddressResult(item)));
    } catch {
      if (requestId === addressRequestRef.current) {
        setAddressResults([]);
      }
    }
  }

  // Chạy tìm kiếm trên cả 2 nguồn: Open-Meteo (địa điểm) + Nominatim (địa chỉ VN)
  function runSearch(keyword: string) {
    void handleSearch(keyword);

    if (!keyword.trim()) {
      addressRequestRef.current += 1; // vô hiệu hóa kết quả đang chờ
      setAddressResults([]);
      return;
    }

    void fetchAddressSuggestions(keyword.trim());
  }

  // Chọn 1 gợi ý địa chỉ -> dùng handleMapSelect (tự gọi fetchPlaceName
  // để hiển thị tên theo đơn vị hành chính MỚI: "Phường X, Tỉnh Y")
  function selectAddressResult(item: AddressResult) {
    setSearchKeyword("");
    setSearchResults([]);
    setAddressResults([]);
    setShowSearchResults(false);

    void handleMapSelect({
      latitude: item.latitude,
      longitude: item.longitude,
    });
  }

  // Chọn nhanh 1 trong 34 tỉnh/thành Việt Nam sau sáp nhập 2025
  function selectProvince(province: Province) {
    const selected = {
      latitude: province.latitude,
      longitude: province.longitude,
    };

    setCoordinates(selected);
    setLocationName(province.name);
    setSearchKeyword("");
    setSearchResults([]);
    setAddressResults([]);
    setShowSearchResults(false);

    localStorage.setItem(
      "weather-location",
      JSON.stringify({
        ...selected,
        name: province.name,
      }),
    );
  }

  // Lọc tỉnh/thành theo từ khóa (không phân biệt dấu); ô trống = hiện toàn bộ 34 tỉnh
  const provinceMatches = useMemo(() => {
    const keyword = normalizeVietnameseText(searchKeyword);

    if (!keyword) {
      return provinces;
    }

    return provinces.filter((province) =>
      normalizeVietnameseText(province.name).includes(keyword),
    );
  }, [searchKeyword]);

  // Ảnh nền thành phố (bạn tự thêm vào public/images/cities/ — xem HUONG-DAN-ANH-NEN-THANH-PHO.md)
  const cityPhotoSrc = getCityBackgroundSrc(locationName);

  // Ghép 34 tỉnh (có tọa độ) với danh mục hành chính mới (để lấy code + fullName)
  const adminProvinceByCenter = useMemo(() => {
    const map = new Map<string, NewAdminProvince>();

    if (!adminData) {
      return map;
    }

    for (const adminProvince of adminData.provinces) {
      const adminName = normalizeVietnameseText(adminProvince.name);
      const match = provinces.find((province) => {
        const centerName = normalizeVietnameseText(province.name);

        return centerName.includes(adminName) || adminName.includes(centerName);
      });

      if (match) {
        map.set(match.name, adminProvince);
      }
    }

    return map;
  }, [adminData]);

  // Gom xã/phường theo mã tỉnh
  const wardsByProvinceCode = useMemo(() => {
    const map = new Map<string, NewAdminWard[]>();

    if (!adminData) {
      return map;
    }

    for (const ward of adminData.wards) {
      const list = map.get(ward.provinceCode);

      if (list) {
        list.push(ward);
      } else {
        map.set(ward.provinceCode, [ward]);
      }
    }

    return map;
  }, [adminData]);

  // Khi mở rộng 1 tỉnh để chọn xã/phường, cuộn dropdown tới đúng danh sách đó
  // (trước đây danh sách nằm dưới cùng nên người dùng tưởng "chọn không được")
  useEffect(() => {
    if (!expandedProvinceCode || !showSearchResults) {
      return;
    }

    const timerId = window.setTimeout(() => {
      document
        .getElementById("wn-ward-expanded")
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 80);

    return () => window.clearTimeout(timerId);
  }, [expandedProvinceCode, showSearchResults]);

  // Tìm xã/phường khớp từ khóa tìm kiếm
  const wardMatches = useMemo(() => {
    const keyword = normalizeVietnameseText(searchKeyword);

    if (!adminData || !keyword) {
      return [];
    }

    return adminData.wards
      .filter(
        (ward) =>
          normalizeVietnameseText(ward.name).includes(keyword) ||
          normalizeVietnameseText(ward.fullName).includes(keyword),
      )
      .slice(0, 40);
  }, [adminData, searchKeyword]);

  // Chọn 1 xã/phường mới: lấy tọa độ chính xác (Nominatim), fallback về trung tâm tỉnh
  async function selectCommune(ward: NewAdminWard) {
    setSearchLoading(true);

    const adminProvince = adminData?.provinces.find(
      (province) => province.code === ward.provinceCode,
    );
    let coords: Coordinates = defaultCoordinates;

    if (adminProvince) {
      const center = provinces.find((province) => {
        const centerName = normalizeVietnameseText(province.name);
        const adminName = normalizeVietnameseText(adminProvince.name);

        return centerName.includes(adminName) || adminName.includes(centerName);
      });

      if (center) {
        coords = { latitude: center.latitude, longitude: center.longitude };
      }
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
          `${ward.fullName}, Việt Nam`,
        )}`,
      );

      if (response.ok) {
        const results = (await response.json()) as Array<{
          lat?: string;
          lon?: string;
        }>;
        const first = results[0];

        if (first?.lat && first?.lon) {
          coords = {
            latitude: Number(first.lat),
            longitude: Number(first.lon),
          };
        }
      }
    } catch {
      // Giữ tọa độ trung tâm tỉnh nếu không định vị được xã/phường
    }

    setCoordinates(coords);
    setLocationName(ward.fullName);
    setSearchKeyword("");
    setSearchResults([]);
    setAddressResults([]);
    setShowSearchResults(false);
    setExpandedProvinceCode(null);
    setSearchLoading(false);

    localStorage.setItem(
      "weather-location",
      JSON.stringify({
        ...coords,
        name: ward.fullName,
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

  const next48Hours = useMemo<SunCardHour[]>(() => {
    if (!weather) return [];
    const now = currentTime.getTime();
    const startIndex = weather.hourly.time.findIndex(
      (time) => new Date(time).getTime() >= now,
    );
    const safeStartIndex = startIndex >= 0 ? startIndex : 0;

    return weather.hourly.time
      .slice(safeStartIndex, safeStartIndex + 48)
      .map((time, relativeIndex) => {
        const index = safeStartIndex + relativeIndex;
        return {
          time,
          temperature: weather.hourly.temperature_2m[index],
          rainChance: weather.hourly.precipitation_probability[index] ?? 0,
          uvIndex: weather.hourly.uv_index[index] ?? 0,
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

  // Desktop notifications: push a notification when new weather alerts appear
  useEffect(() => {
    if (notifyPermission !== "granted") return;
    if (weatherAlerts.length === 0) return;

    const signature = currentAlertSignature;
    if (lastNotifiedSignatureRef.current === signature) return;
    lastNotifiedSignatureRef.current = signature;

    try {
      const body =
        weatherAlerts.length === 1
          ? weatherAlerts[0]
          : language === "vi"
            ? `${weatherAlerts.length} cảnh báo thời tiết mới`
            : `${weatherAlerts.length} new weather alerts`;
      const notification = new Notification(
        language === "vi"
          ? "WeatherNow — Cảnh báo thời tiết"
          : "WeatherNow — Weather alert",
        { body },
      );
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch {
      // Notifications unavailable
    }
  }, [currentAlertSignature, weatherAlerts, notifyPermission, language]);

  // Ghi lịch sử nhiệt độ hằng ngày vào localStorage (tối đa 60 ngày)
  useEffect(() => {
    if (!weather) return;

    const timer = window.setTimeout(() => {
      try {
        const now = new Date();
        const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const saved = JSON.parse(
          window.localStorage.getItem("weather-history") ?? "[]",
        ) as HistoryEntry[];
        const next = saved.filter((entry) => entry.date !== key);
        next.push({
          date: key,
          max: weather.daily.temperature_2m_max[0] ?? 0,
          min: weather.daily.temperature_2m_min[0] ?? 0,
        });
        next.sort((a, b) => a.date.localeCompare(b.date));
        const trimmed = next.slice(-60);
        setWeatherHistory(trimmed);
        window.localStorage.setItem("weather-history", JSON.stringify(trimmed));
      } catch {
        // bỏ qua lỗi
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [weather]);

  // Build a shareable weather card image
  const shareWeatherCard = useCallback(async () => {
    if (!weather || shareBusy) return;
    setShareBusy(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 675;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isNight = weather.current.is_day !== 1;
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isNight) {
        sky.addColorStop(0, "#0f172a");
        sky.addColorStop(1, "#1e3a5f");
      } else {
        sky.addColorStop(0, "#38bdf8");
        sky.addColorStop(1, "#0ea5e9");
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(1020, 130, 60, 0, Math.PI * 2);
      ctx.fillStyle = isNight
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(253, 230, 138, 0.95)";
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.font = "600 30px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(locationName, 80, 120);
      ctx.font = "400 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillText(
        new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(currentTime),
        80,
        158,
      );

      ctx.font = "700 150px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${Math.round(weather.current.temperature_2m)}°`, 80, 340);

      ctx.font = "500 34px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillText(
        getWeatherDescription(weather.current.weather_code, language),
        80,
        400,
      );

      ctx.font = "400 24px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      const hi =
        weather.daily.temperature_2m_max[0] ?? weather.current.temperature_2m;
      const lo =
        weather.daily.temperature_2m_min[0] ?? weather.current.temperature_2m;
      const rain = weather.daily.precipitation_probability_max[0] ?? 0;
      const sunriseText = weather.daily.sunrise[0]?.slice(11, 16) ?? "--:--";
      const sunsetText = weather.daily.sunset[0]?.slice(11, 16) ?? "--:--";
      ctx.fillText(
        `↑${Math.round(hi)}°  ↓${Math.round(lo)}°   ·   ☔ ${rain}%   ·   ☀ ${sunriseText} → ${sunsetText}`,
        80,
        470,
      );

      ctx.font = "400 20px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillText("WeatherNow", 80, 620);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return;

      const fileName = `weathernow-${locationName.replace(/\s+/g, "-").toLowerCase()}.png`;

      if (
        typeof navigator.canShare === "function" &&
        typeof navigator.share === "function"
      ) {
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "WeatherNow",
            text: `${locationName} — ${Math.round(weather.current.temperature_2m)}°`,
          });
          return;
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setShareBusy(false);
    }
  }, [weather, shareBusy, locationName, language, currentTime]);

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

  // Hero mockup mới: nhãn đơn vị + tên đơn vị lớn (bỏ tiền tố) + khẩu hiệu
  const heroCityName =
    (locationName.split(",").pop() ?? locationName).trim() || locationName;
  const heroCityIsProvince = /^tỉnh/i.test(heroCityName);
  const heroCityLabel =
    language === "vi"
      ? heroCityIsProvince
        ? "TỈNH"
        : "THÀNH PHỐ"
      : heroCityName.toLowerCase().startsWith("province")
        ? "PROVINCE"
        : "CITY";
  const heroCityTitle =
    heroCityName
      .replace(/^tỉnh\s+/i, "")
      .replace(/^thành phố\s+/i, "")
      .replace(/^province of\s+/i, "")
      .replace(/^city of\s+/i, "")
      .trim() || heroCityName;

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
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          );

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

  const selectedCalendarHoliday = getCalendarNote(selectedDate, language);
  const selectedCalendarHolidayVisual = getHolidayVisual(selectedDate);

  const bubbleData = Array.from({ length: 14 }, (_, index) => {
    const size = 18 + (index % 6) * 12;
    const left = 26 + ((index * 11) % 48);
    const top = 52 + (index % 5) * 9;
    const drift = (index % 2 === 0 ? 1 : -1) * (18 + (index % 5) * 12);

    return {
      id: index,
      size,
      left,
      top,
      delay: index * 0.7,
      duration: 9 + (index % 5) * 2.2,
      drift,
    };
  });

  return (
    <main className="wn-app">
      {weather && <WeatherFX scene={weatherScene} />}
      <div className="wn-bubble-scene" aria-hidden="true">
        {bubbleData.map((bubble) => {
          const bubbleStyle: CSSProperties = {
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            ["--bubble-drift" as string]: `${bubble.drift}px`,
          };

          return (
            <span key={bubble.id} className="wn-bubble" style={bubbleStyle} />
          );
        })}
      </div>

      <header className="wn-header">
        <div className="wn-header__inner">
          <a className="wn-brand" href="#overview" aria-label="WeatherNow">
            <span className="wn-brand__icon">
              <CloudSun size={27} />
            </span>
            <span
              className={`wn-brand__copy ${todayHolidayVisual ? "is-holiday" : ""}`}
            >
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
              href="#weather-map"
              className={activeSection === "windy-storm" ? "is-active" : ""}
              onClick={() => setActiveSection("windy-storm")}
            >
              <Wind size={17} />
              <span>{language === "vi" ? "Bão & Windy" : "Storm & Windy"}</span>
            </a>
          </nav>

          <div className="wn-actions">
            <div
              className={`wn-actions-settings ${actionsMenuOpen ? "is-open" : ""}`}
            >
              <div className="wn-action-row">
                <span className="wn-actions-label">
                  {language === "vi" ? "Nhiệt độ" : "Temperature"}
                </span>
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
              </div>

              <div className="wn-action-row">
                <span className="wn-actions-label">
                  {language === "vi" ? "Gió" : "Wind"}
                </span>
                <select
                  className="wn-select wn-select--wind"
                  value={windUnit}
                  onChange={(event) =>
                    setWindUnit(event.target.value as WindUnit)
                  }
                  aria-label="Wind unit"
                >
                  <option value="kmh">km/h</option>
                  <option value="ms">m/s</option>
                </select>
              </div>

              <button
                type="button"
                className="wn-icon-button wn-language"
                onClick={() =>
                  setLanguage((previous) => (previous === "vi" ? "en" : "vi"))
                }
                aria-label="Đổi ngôn ngữ"
              >
                <Languages size={18} />
                <span className="wn-actions-label">
                  {language === "vi" ? "Ngôn ngữ" : "Language"}
                </span>
                <span>{language.toUpperCase()}</span>
              </button>

              <button
                type="button"
                className={`wn-icon-button ${notifyPermission === "granted" ? "wn-icon-button--on" : ""}`}
                onClick={async () => {
                  if (notifyPermission === "unsupported") return;
                  if (notifyPermission === "granted") return;
                  try {
                    const result = await Notification.requestPermission();
                    setNotifyPermission(result);
                    if (result === "granted") {
                      new Notification(
                        language === "vi"
                          ? "WeatherNow — Đã bật thông báo!"
                          : "WeatherNow — Notifications enabled!",
                        {
                          body:
                            language === "vi"
                              ? "Bạn sẽ nhận cảnh báo thời tiết ngay khi có."
                              : "You will receive weather alerts as they happen.",
                        },
                      );
                    }
                  } catch {
                    // ignore
                  }
                }}
                title={
                  notifyPermission === "granted"
                    ? language === "vi"
                      ? "Thông báo đã bật"
                      : "Notifications on"
                    : notifyPermission === "unsupported"
                      ? language === "vi"
                        ? "Trình duyệt không hỗ trợ thông báo"
                        : "Notifications not supported"
                      : language === "vi"
                        ? "Bật thông báo cảnh báo thời tiết"
                        : "Enable weather alerts"
                }
                aria-label="Bật thông báo thời tiết"
              >
                <Bell size={18} />
                <span className="wn-actions-label">
                  {notifyPermission === "granted"
                    ? language === "vi"
                      ? "Đã bật thông báo"
                      : "Notifications on"
                    : language === "vi"
                      ? "Bật thông báo"
                      : "Enable alerts"}
                </span>
              </button>

              <button
                type="button"
                className="wn-icon-button"
                onClick={() => void shareWeatherCard()}
                disabled={shareBusy || !weather}
                title={
                  language === "vi"
                    ? "Tạo ảnh chia sẻ thời tiết"
                    : "Create shareable weather image"
                }
                aria-label="Chia sẻ ảnh thời tiết"
              >
                <Share2 size={18} />
                <span className="wn-actions-label">
                  {language === "vi" ? "Chia sẻ ảnh" : "Share image"}
                </span>
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
                title={
                  language === "vi" ? "Đổi giao diện (T)" : "Toggle theme (T)"
                }
              >
                {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
                <span className="wn-actions-label">
                  {language === "vi" ? "Giao diện" : "Theme"}
                </span>
                <span className="wn-actions-value">
                  {theme === "light"
                    ? language === "vi"
                      ? "Sáng"
                      : "Light"
                    : language === "vi"
                      ? "Tối"
                      : "Dark"}
                </span>
              </button>

              {holidayModalOpen && todayHolidayVisual && todayHolidayTitle ? (
                <>
                  <HolidayModal
                    src={todayHolidayVisual.src}
                    alt={
                      todayHolidayVisual.alt?.[language] ?? todayHolidayTitle
                    }
                    title={todayHolidayTitle}
                    celebration={todayHolidayImportant}
                    greeting={
                      language === "vi"
                        ? `Chúc mừng ${todayHolidayTitle}!`
                        : `Happy ${todayHolidayTitle}!`
                    }
                    subtitle={
                      language === "vi"
                        ? "Chúc bạn và gia đình một ngày lễ thật vui vẻ, an lành và tràn ngập hạnh phúc!"
                        : "Wishing you and your family a joyful, peaceful and happy holiday!"
                    }
                    onClose={() => {
                      const key = `holiday-dismissed-${getDateKey(new Date())}`;
                      try {
                        window.localStorage.setItem(key, "1");
                      } catch {}
                      setHolidayModalOpen(false);
                    }}
                  />

                  {/* Snow for Christmas-like days */}
                  {(() => {
                    const k = getDateKey(new Date());
                    const snowDays = new Set([
                      "12-24",
                      "12-25",
                      "12-31",
                      "01-01",
                    ]);
                    // If effectsConfig exists, prefer its settings per holiday
                    const cfgKey = `holiday-effects-config`;
                    let cfg: HolidayEffectsConfig | null = null;
                    try {
                      cfg =
                        effectsConfig ??
                        (window.localStorage.getItem(cfgKey)
                          ? (JSON.parse(
                              window.localStorage.getItem(cfgKey) as string,
                            ) as HolidayEffectsConfig)
                          : null);
                    } catch {
                      cfg = effectsConfig;
                    }

                    // Người dùng tắt riêng ngày này → không hiện hiệu ứng
                    const entry = cfg?.holidays?.[k];
                    if (entry && !entry.enabled) return null;

                    // Chế độ cài chung: dùng một bộ hiệu ứng duy nhất cho mọi
                    // ngày lễ; ngược lại dùng cài đặt riêng của từng ngày.
                    const e =
                      cfg?.global?.enabled && cfg.global
                        ? cfg.global.effects
                        : entry?.effects;

                    if (e) {
                      const snow = e.snow || {
                        density: 1,
                        wind: 0.3,
                        layers: 3,
                      };
                      const confetti = e.confetti || { count: 0, colors: [] };
                      const fireworks = e.fireworks || { enabled: false };
                      const lanterns = e.lanterns || { enabled: false };

                      return (
                        <>
                          {snow ? (
                            <AdvancedSnow
                              density={snow.density}
                              wind={snow.wind}
                              layers={snow.layers}
                            />
                          ) : null}
                          {confetti && confetti.count > 0 ? (
                            <ConfettiSVG
                              count={confetti.count}
                              colors={confetti.colors}
                            />
                          ) : null}
                          {fireworks && fireworks.enabled ? (
                            <Fireworks max={4} />
                          ) : null}
                          {lanterns && lanterns.enabled ? (
                            <Lanterns count={8} />
                          ) : null}
                        </>
                      );
                    }

                    return snowDays.has(k) ? <SnowEffect count={80} /> : null;
                  })()}
                </>
              ) : null}

              <button
                type="button"
                className="wn-icon-button"
                aria-label="Cài đặt hiệu ứng"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings size={18} />
                <span className="wn-actions-label">
                  {language === "vi" ? "Hiệu ứng ngày lễ" : "Holiday effects"}
                </span>
              </button>
            </div>

            <div className="wn-popover-anchor wn-more-anchor">
              {actionsMenuOpen && (
                <button
                  type="button"
                  className="wn-popover-backdrop"
                  onClick={() => setActionsMenuOpen(false)}
                  aria-label="Đóng menu cài đặt"
                />
              )}

              <button
                type="button"
                className={`wn-more-button ${actionsMenuOpen ? "is-open" : ""}`}
                onClick={() => setActionsMenuOpen((previous) => !previous)}
                aria-label={
                  language === "vi" ? "Mở menu cài đặt" : "Open settings menu"
                }
                aria-expanded={actionsMenuOpen}
              >
                <ChevronDown className="chevron" size={20} />
              </button>
            </div>

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
              href="#weather-map"
              className={activeSection === "windy-storm" ? "is-active" : ""}
              onClick={() => {
                setActiveSection("windy-storm");
                setMobileMenuOpen(false);
              }}
            >
              <Wind size={17} />
              <span>{language === "vi" ? "Bão & Windy" : "Storm & Windy"}</span>
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

                if (searchDebounceRef.current !== null) {
                  window.clearTimeout(searchDebounceRef.current);
                  searchDebounceRef.current = null;
                }

                if (!nextValue.trim()) {
                  setSearchResults([]);
                  setAddressResults([]);
                  // Ô trống: hiển thị danh sách 34 tỉnh/thành để chọn nhanh
                  setShowSearchResults(true);
                  return;
                }

                // Chờ người dùng ngừng gõ 350ms rồi mới gọi API (tránh gọi liên tục từng ký tự)
                searchDebounceRef.current = window.setTimeout(() => {
                  searchDebounceRef.current = null;
                  runSearch(nextValue);
                }, 350);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setShowSearchResults(false);
                  event.currentTarget.blur();
                  return;
                }

                if (event.key === "Enter") {
                  event.preventDefault();

                  if (searchDebounceRef.current !== null) {
                    window.clearTimeout(searchDebounceRef.current);
                    searchDebounceRef.current = null;
                  }

                  runSearch(searchKeyword);
                }
              }}
              onFocus={() => {
                if (searchBlurTimerRef.current !== null) {
                  window.clearTimeout(searchBlurTimerRef.current);
                  searchBlurTimerRef.current = null;
                }

                setShowSearchResults(true);
              }}
              onBlur={() => {
                if (searchBlurTimerRef.current !== null) {
                  window.clearTimeout(searchBlurTimerRef.current);
                }

                searchBlurTimerRef.current = window.setTimeout(() => {
                  setShowSearchResults(false);
                }, 250);
              }}
              placeholder={text.searchPlaceholder}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => {
                if (searchDebounceRef.current !== null) {
                  window.clearTimeout(searchDebounceRef.current);
                  searchDebounceRef.current = null;
                }

                runSearch(searchKeyword);
              }}
              disabled={searchLoading}
            >
              {searchLoading ? (
                <LoaderCircle className="spin" size={19} />
              ) : (
                <Search size={19} />
              )}
            </button>

            {showSearchResults && (
              <div
                className="wn-search-results"
                onMouseDown={(event) => {
                  // Giữ focus trên ô tìm kiếm khi bấm vào mục gợi ý — nếu không
                  // input sẽ bị blur và dropdown tự đóng sau 180-250ms, khiến
                  // người dùng thấy "bấm vào địa điểm không ăn" (đặc biệt mobile).
                  event.preventDefault();

                  if (searchBlurTimerRef.current !== null) {
                    window.clearTimeout(searchBlurTimerRef.current);
                    searchBlurTimerRef.current = null;
                  }
                }}
              >
                {searchLoading && provinceMatches.length === 0 ? (
                  <div className="wn-search-results__message">
                    <LoaderCircle className="spin" size={19} />
                    {text.loading}
                  </div>
                ) : (
                  <>
                    <div className="wn-search-results__label">
                      {searchKeyword.trim()
                        ? language === "vi"
                          ? "Tỉnh/thành Việt Nam"
                          : "Vietnam provinces"
                        : language === "vi"
                          ? "34 tỉnh/thành sau sáp nhập (2025)"
                          : "Vietnam's 34 provinces (2025)"}
                    </div>

                    {provinceMatches.map((province) => {
                      const adminProvince = adminProvinceByCenter.get(
                        province.name,
                      );
                      const wardList = adminProvince
                        ? (wardsByProvinceCode.get(adminProvince.code) ?? [])
                        : [];
                      const isExpanded =
                        adminProvince !== undefined &&
                        expandedProvinceCode === adminProvince.code;

                      return (
                        <Fragment key={province.name}>
                          <button
                            type="button"
                            onClick={() => {
                              if (wardList.length > 0) {
                                setExpandedProvinceCode(
                                  isExpanded
                                    ? null
                                    : (adminProvince?.code ?? null),
                                );
                              } else {
                                selectProvince(province);
                              }
                            }}
                          >
                            <MapPin size={17} />
                            <span>
                              <strong>{province.name}</strong>
                              <small>
                                {wardList.length > 0
                                  ? language === "vi"
                                    ? `${wardList.length} xã/phường mới — bấm để chọn`
                                    : `${wardList.length} wards — tap to pick`
                                  : language === "vi"
                                    ? "Tỉnh/thành Việt Nam"
                                    : "Vietnam province"}
                              </small>
                            </span>
                          </button>

                          {isExpanded && adminProvince && (
                            <>
                              <div
                                id="wn-ward-expanded"
                                className="wn-search-results__label"
                              >
                                {language === "vi"
                                  ? `Xã/phường của ${adminProvince.fullName}`
                                  : `Wards of ${adminProvince.fullName}`}
                              </div>

                              <button
                                type="button"
                                className="wn-ward-option"
                                onClick={() => selectProvince(province)}
                              >
                                <MapPin size={15} />
                                <span>
                                  <strong>
                                    {language === "vi"
                                      ? "Cả tỉnh/thành phố"
                                      : "Whole province/city"}
                                  </strong>
                                  <small>
                                    {adminProvince.fullName} —{" "}
                                    {language === "vi"
                                      ? "dự báo tại trung tâm"
                                      : "forecast at center"}
                                  </small>
                                </span>
                              </button>

                              {wardList.map((ward) => (
                                <button
                                  key={ward.code}
                                  type="button"
                                  className="wn-ward-option"
                                  onClick={() => void selectCommune(ward)}
                                >
                                  <MapPin size={15} />
                                  <span>
                                    <strong>{ward.fullName}</strong>
                                    <small>
                                      {ward.type === "ward"
                                        ? language === "vi"
                                          ? "Phường"
                                          : "Ward"
                                        : language === "vi"
                                          ? "Xã/Đặc khu"
                                          : "Commune"}
                                    </small>
                                  </span>
                                </button>
                              ))}
                            </>
                          )}
                        </Fragment>
                      );
                    })}

                    {wardMatches.length > 0 && (
                      <>
                        <div className="wn-search-results__label">
                          {language === "vi" ? "Xã/phường" : "Wards"}
                        </div>
                        {wardMatches.map((ward) => (
                          <button
                            key={ward.code}
                            type="button"
                            className="wn-ward-option"
                            onClick={() => void selectCommune(ward)}
                          >
                            <MapPin size={15} />
                            <span>
                              <strong>{ward.fullName}</strong>
                              <small>
                                {language === "vi"
                                  ? "Xã/phường (đơn vị hành chính mới)"
                                  : "New administrative unit"}
                              </small>
                            </span>
                          </button>
                        ))}
                      </>
                    )}

                    {addressResults.length > 0 && (
                      <>
                        <div className="wn-search-results__label">
                          {language === "vi"
                            ? "Địa chỉ (đường, phường/xã, tỉnh/thành...)"
                            : "Addresses (streets, wards, provinces...)"}
                        </div>
                        {addressResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="wn-ward-option"
                            onClick={() => selectAddressResult(item)}
                          >
                            <MapPin size={15} />
                            <span>
                              <strong>{item.name}</strong>
                              <small>
                                {item.category === "road"
                                  ? language === "vi"
                                    ? "Đường/phố"
                                    : "Street"
                                  : item.category === "admin"
                                    ? language === "vi"
                                      ? "Hành chính"
                                      : "Administrative"
                                    : language === "vi"
                                      ? "Địa điểm"
                                      : "Place"}
                                {item.detail ? ` • ${item.detail}` : ""}
                              </small>
                            </span>
                          </button>
                        ))}
                      </>
                    )}

                    {searchKeyword.trim() && searchResults.length > 0 && (
                      <>
                        {provinceMatches.length > 0 && (
                          <div className="wn-search-results__label">
                            {language === "vi"
                              ? "Kết quả khác"
                              : "Other results"}
                          </div>
                        )}
                        {searchResults.map((location) => (
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
                        ))}
                      </>
                    )}

                    {searchKeyword.trim() &&
                    !searchLoading &&
                    searchResults.length === 0 &&
                    addressResults.length === 0 &&
                    provinceMatches.length === 0 ? (
                      <div className="wn-search-results__message">
                        {text.searchEmpty}
                      </div>
                    ) : null}
                  </>
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
                {cityPhotoSrc && !cityPhotoFailed && (
                  <>
                    <img
                      key={`backdrop-${cityPhotoSrc}`}
                      className="wn-hero__city-photo-backdrop"
                      src={cityPhotoSrc}
                      alt=""
                      aria-hidden="true"
                      onError={() => setCityPhotoFailed(true)}
                    />
                    <img
                      key={cityPhotoSrc}
                      className="wn-hero__city-photo"
                      src={cityPhotoSrc}
                      alt=""
                      aria-hidden="true"
                      onError={() => setCityPhotoFailed(true)}
                    />
                    <span
                      className="wn-hero__city-photo-scrim"
                      aria-hidden="true"
                    />
                  </>
                )}

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
                    <div className="wn-hero__location-actions">
                      <span className="wn-hero__script">WeatherNow</span>
                      <button
                        type="button"
                        onClick={saveCurrentFavorite}
                        aria-label="Lưu địa điểm"
                      >
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="wn-hero__branding">
                    <span className="wn-hero__eyebrow">{heroCityLabel}</span>
                    <p className="wn-hero__city">{heroCityTitle}</p>
                    <p className="wn-hero__slogan">
                      {language === "vi"
                        ? "Vùng vàng bản sắc — Vươn tầm thế giới"
                        : "Golden identity — Rising to the world"}
                    </p>
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
                        value: `${(weather.current.visibility / 1000).toFixed(
                          1,
                        )} km`,
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

                <div className="wn-time-card__time">
                  {formatTime(currentTime)}
                </div>

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
                <button
                  type="button"
                  className="wn-time-card__banner"
                  onClick={() => {
                    const title =
                      selectedCalendarHoliday ??
                      selectedCalendarHolidayVisual.alt[language] ??
                      "";
                    openHolidayModal(selectedCalendarHolidayVisual, title);
                  }}
                  aria-label={
                    language === "vi"
                      ? "Xem chi tiết ngày lễ"
                      : "View holiday details"
                  }
                >
                  <img
                    src={selectedCalendarHolidayVisual.src}
                    alt={selectedCalendarHolidayVisual.alt[language]}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.parentElement?.classList.add(
                        "is-image-error",
                      );
                    }}
                  />
                  <span className="wn-time-card__banner-overlay" />
                </button>
              )}
            </article>

            <article className="wn-panel wn-aqi-card">
              <div className="wn-panel__heading">
                <span>
                  {language === "vi" ? "Chất lượng không khí" : "Air quality"}
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
                value: `${(weather.daily.precipitation_sum[0] ?? 0).toFixed(
                  1,
                )} mm`,
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
              {
                icon: Wind,
                label: language === "vi" ? "Gió hiện tại" : "Current wind",
                value: `${Math.round(
                  weather.current.wind_speed_10m,
                )} ${windUnit === "kmh" ? "km/h" : "m/s"} ${getWindDirection(
                  weather.current.wind_direction_10m,
                )}`,
                compass: true,
                degrees: weather.current.wind_direction_10m,
              },
            ].map(
              ({
                icon: Icon,
                label,
                value,
                compass,
                degrees,
              }: {
                icon: typeof Wind;
                label: string;
                value: string;
                compass?: boolean;
                degrees?: number;
              }) => (
                <div key={label}>
                  <span>
                    {compass ? (
                      <WindCompass degrees={degrees ?? 0} size={24} />
                    ) : (
                      <Icon size={19} />
                    )}
                  </span>
                  <p>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </p>
                </div>
              ),
            )}
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
                  className={`wn-hour ${index === 0 ? "wn-hour--active" : ""}`}
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

          {weather && (
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
                        {Math.round(weather.daily.temperature_2m_max[index])}°
                      </strong>
                      <small>
                        {Math.round(weather.daily.temperature_2m_min[index])}°
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
          )}
        </section>

        {upcomingHoliday && (
          <section className="wn-holiday-soon">
            <button
              type="button"
              className="wn-holiday-soon__inner"
              onClick={() => {
                const visual = getHolidayVisual(upcomingHoliday.date);
                if (visual) {
                  openHolidayModal(visual, upcomingHoliday.name, true);
                }
              }}
              aria-label={
                language === "vi" ? "Xem trước ngày lễ" : "Preview holiday"
              }
              title={
                language === "vi"
                  ? "Bấm để xem modal chúc mừng"
                  : "Preview celebration modal"
              }
            >
              <span className="wn-holiday-soon__icon" aria-hidden="true">
                📅
              </span>
              <span className="wn-holiday-soon__text">
                <strong>
                  {upcomingHoliday.daysUntil === 0
                    ? language === "vi"
                      ? "Hôm nay! 🎉"
                      : "Today! 🎉"
                    : upcomingHoliday.daysUntil === 1
                      ? language === "vi"
                        ? "Ngày mai! 🎉"
                        : "Tomorrow! 🎉"
                      : language === "vi"
                        ? `Còn ${upcomingHoliday.daysUntil} ngày`
                        : `In ${upcomingHoliday.daysUntil} days`}
                </strong>
                <small>{upcomingHoliday.name}</small>
              </span>
            </button>
          </section>
        )}

        {weather &&
          next48Hours.length > 1 &&
          weather.daily.sunrise[0] &&
          weather.daily.sunset[0] && (
            <SunCard
              sunrise={weather.daily.sunrise[0]}
              sunset={weather.daily.sunset[0]}
              uvIndex={currentUv}
              hours={next48Hours}
              currentTime={currentTime}
              language={language}
            />
          )}

        {weather && weatherHistory.length >= 0 && (
          <section className="wn-panel wn-history-card">
            <div className="wn-section-heading">
              <div>
                <span>HISTORY</span>
                <h2>
                  {language === "vi"
                    ? "Lịch sử nhiệt độ gần đây"
                    : "Recent temperature history"}
                </h2>
              </div>
              <small className="wn-history-sub">
                {language === "vi"
                  ? `${weatherHistory.length} ngày đã ghi nhận (tối đa 60)`
                  : `${weatherHistory.length} days recorded`}
              </small>
            </div>
            <HistoryChart entries={weatherHistory} language={language} />
          </section>
        )}

        {weather && (
          <section className="wn-panel wn-compare-card">
            <div className="wn-section-heading">
              <div>
                <span>COMPARE</span>
                <h2>
                  {language === "vi"
                    ? "So sánh hai địa điểm"
                    : "Compare two locations"}
                </h2>
              </div>
            </div>

            <ComparePanel
              favorites={favorites}
              current={{
                name: locationName,
                temperature: weather.current.temperature_2m,
                feels: weather.current.apparent_temperature,
                humidity: weather.current.relative_humidity_2m,
                windSpeed: weather.current.wind_speed_10m,
                weatherCode: weather.current.weather_code,
              }}
              windUnit={windUnit}
              language={language}
            />
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

        <section id="weather-map" className="wn-panel wn-full-map">
          <div className="wn-section-heading wn-section-heading--wrap">
            <div>
              <span>MAP</span>
              <h2>
                {mapView === "windy"
                  ? language === "vi"
                    ? "Theo dõi mưa bão và thời tiết nguy hiểm"
                    : "Storm and severe weather tracking"
                  : text.weatherMap}
              </h2>
            </div>
            {mapView === "windy" ? (
              <a
                href={windyFullUrl.toString()}
                target="_blank"
                rel="noreferrer"
                className="wn-outline-button"
              >
                <ExternalLink size={16} />
                {language === "vi" ? "Mở Windy" : "Open Windy"}
              </a>
            ) : (
              <button
                type="button"
                className="wn-outline-button"
                onClick={handleCurrentLocation}
              >
                <LocateFixed size={16} />
                {text.currentLocation}
              </button>
            )}
          </div>

          <div className="wn-map-view-tabs">
            <button
              type="button"
              className={mapView === "vn" ? "is-active" : ""}
              onClick={() => setMapView("vn")}
            >
              {language === "vi" ? "Bản đồ Việt Nam" : "Vietnam map"}
            </button>
            <button
              type="button"
              className={mapView === "windy" ? "is-active" : ""}
              onClick={() => setMapView("windy")}
            >
              Windy
            </button>
          </div>

          {mapView === "windy" ? (
            <>
              <div className="wn-layer-tabs">
                {(Object.keys(windyLayerConfig) as WindyOverlay[]).map(
                  (layer) => (
                    <button
                      type="button"
                      className={windyOverlay === layer ? "is-active" : ""}
                      onClick={() => setWindyOverlay(layer)}
                      key={layer}
                    >
                      {windyLayerConfig[layer][language]}
                    </button>
                  ),
                )}
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
            </>
          ) : (
            <WeatherMap
              coordinates={coordinates}
              locationName={locationName}
              onSelectLocation={handleMapSelect}
            />
          )}
        </section>
      </div>

      <CalendarModal
        open={isCalendarOpen}
        language={language}
        dailyForecast={calendarDaily}
        upcomingHoliday={upcomingHoliday}
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
          href="#weather-map"
          className={activeSection === "windy-storm" ? "is-active" : ""}
          onClick={() => setActiveSection("windy-storm")}
        >
          <Wind size={21} />
          <span>Windy</span>
        </a>
      </nav>
      <HolidayEffectsSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
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
  dailyForecast: CalendarDailyForecast | null;
  upcomingHoliday: {
    date: Date;
    name: string;
    daysUntil: number;
  } | null;
};

function CalendarModal({
  open,
  language,
  selectedDate,
  displayMonth,
  onDisplayMonthChange,
  onSelectDate,
  onClose,
  dailyForecast,
  upcomingHoliday,
}: CalendarModalProps) {
  const [previewHoliday, setPreviewHoliday] = useState<{
    visual: HolidayVisual;
    title: string;
    dateLabel: string;
  } | null>(null);

  // ----- Điểm hợp tuổi: năm sinh lưu localStorage ("wn-birth-year") -----
  const [birthYearInput, setBirthYearInput] = useState<string>(() => {
    try {
      return window.localStorage.getItem("wn-birth-year") ?? "";
    } catch {
      return "";
    }
  });

  // ----- Công cụ: máy chuyển đổi Âm↔Dương + ngày lễ trong năm -----
  const [toolView, setToolView] = useState<"none" | "convert" | "holidays">(
    "none",
  );
  const [convertMode, setConvertMode] = useState<"lunar" | "solar">("lunar");
  const [convertDay, setConvertDay] = useState(1);
  const [convertMonth, setConvertMonth] = useState(1);
  const [convertYear, setConvertYear] = useState(() =>
    new Date().getFullYear(),
  );
  const [convertLeap, setConvertLeap] = useState(false);
  const [convertSolarDate, setConvertSolarDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [convertResult, setConvertResult] = useState<{
    text: string;
    date?: Date;
    error?: boolean;
  } | null>(null);

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
  const selectedHolidayVisual = getHolidayVisual(selectedDate);
  const countdownLabel = getDateCountdownLabel(selectedDate, language);

  // Thông tin vạn niên cho ngày đang chọn (can chi, tiết khí, pha trăng, giờ hoàng đạo)
  const almanacYear = selectedDate.getFullYear();
  const almanacMonth = selectedDate.getMonth();
  const almanacDay = selectedDate.getDate();
  const almanac = useMemo(
    () =>
      getAlmanacInfo(new Date(almanacYear, almanacMonth, almanacDay), language),
    [almanacYear, almanacMonth, almanacDay, language],
  );

  // Chi tuổi của người dùng (từ năm sinh) + trạng thái ngày đang chọn
  const userZhi = useMemo(
    () => (birthYearInput ? getZhiFromBirthYear(Number(birthYearInput)) : null),
    [birthYearInput],
  );

  const selectedCompat = useMemo(
    () => getDayUserCompat(selectedDate, userZhi),
    [selectedDate, userZhi],
  );

  // Danh sách mọi ngày lễ trong năm đang xem (đã sắp theo ngày)
  const yearHolidays = getYearHolidayList(year, language);

  // Sự kiện nổi bật của tháng đang xem (cho section dưới lưới lịch)
  const monthEvents = yearHolidays
    .filter((item) => item.date.getMonth() === month)
    .map((item) => ({
      ...item,
      labelFull:
        language === "vi"
          ? `${String(item.date.getDate()).padStart(2, "0")}/${String(item.date.getMonth() + 1).padStart(2, "0")}/${year}`
          : `${new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(item.date)}`,
    }));

  const monthLabelEn = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(displayMonth);

  const [mobilePane, setMobilePane] = useState<"grid" | "detail">("grid");

  function pickDate(date: Date) {
    onSelectDate(date);
    setMobilePane("detail");
    if (typeof window !== "undefined") {
      // Chỉ cuộn lên đầu trên mobile (nơi màn chi tiết thay thế lưới lịch)
      const isMobile = window.matchMedia("(max-width: 720px)").matches;
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document
          .querySelector(".wn-calendar-page")
          ?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }

  function goToDate(date: Date) {
    onDisplayMonthChange(new Date(date.getFullYear(), date.getMonth(), 1));
    pickDate(date);
  }

  function runLunarToSolar() {
    try {
      const lunar = Lunar.fromYmd(
        convertYear,
        convertLeap ? -convertMonth : convertMonth,
        convertDay,
      );
      const solar = lunar.getSolar();
      const date = new Date(
        solar.getYear(),
        solar.getMonth() - 1,
        solar.getDay(),
      );
      setConvertResult({
        text:
          language === "vi"
            ? `→ Dương lịch: ${formatDate(date, language)}`
            : `→ Solar: ${formatDate(date, language)}`,
        date,
      });
    } catch {
      setConvertResult({
        text:
          language === "vi"
            ? "Ngày âm lịch không hợp lệ (số ngày/tháng nhuận không tồn tại)."
            : "Invalid lunar date.",
        error: true,
      });
    }
  }

  function runSolarToLunar() {
    const parts = convertSolarDate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => !n)) {
      setConvertResult({
        text: language === "vi" ? "Chưa chọn ngày." : "Pick a date first.",
        error: true,
      });
      return;
    }
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    setConvertResult({
      text:
        language === "vi"
          ? `→ Âm lịch: ${getLunarDate(date, language)}`
          : `→ Lunar: ${getLunarDate(date, language)}`,
      date,
    });
  }

  // Mobile: luôn mở ở màn lưới lịch khi vừa mở trang lịch (mặc định là "grid")

  // Đóng bằng phím Escape + khóa cuộn nền khi đang xem trang lịch
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`wn-calendar-page${
        mobilePane === "detail" ? " wn-calendar-page--m-detail" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={language === "vi" ? "Xem lịch" : "Calendar"}
    >
      <div className="wn-calendar-page__inner">
        <header className="wn-calendar-page__header">
          <div className="wn-calendar-page__title">
            <span className="wn-calendar-light-kicker">
              {language === "vi" ? "Lịch vạn niên" : "Perpetual calendar"}
            </span>
            <h2>{monthLabel}</h2>
            <p className="wn-calendar-page__quote">
              {language === "vi"
                ? "“Thời gian trôi đi, giá trị tốt đẹp luôn ở lại.”"
                : "“Time passes, good values remain.”"}
            </p>
          </div>

          <div className="wn-calendar-page__controls">
            <button
              type="button"
              className="wn-calendar-light-arrow"
              onClick={() => onDisplayMonthChange(new Date(year, month - 1, 1))}
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
              onClick={() => onDisplayMonthChange(new Date(year, month + 1, 1))}
              aria-label={language === "vi" ? "Tháng sau" : "Next month"}
            >
              <ChevronRight size={22} />
            </button>

            <button
              type="button"
              className="wn-calendar-page__today"
              onClick={() => {
                const now = new Date();
                onDisplayMonthChange(
                  new Date(now.getFullYear(), now.getMonth(), 1),
                );
                pickDate(now);
              }}
            >
              <CalendarDays size={18} />
              {language === "vi" ? "Hôm nay" : "Today"}
            </button>
          </div>

          <button
            type="button"
            className="wn-calendar-page__close"
            onClick={onClose}
            aria-label={language === "vi" ? "Đóng" : "Close"}
          >
            <X size={22} />
          </button>
        </header>

        <div className="wn-calendar-page__body">
          <section className="wn-calendar-light-left">
            <div className="wn-calendar-page__legend" aria-hidden="true">
              <span>
                <i className="is-good" />{" "}
                {language === "vi" ? "Ngày tốt" : "Good day"}
              </span>
              <span>
                <i className="is-clash" />{" "}
                {language === "vi" ? "Ngày xấu" : "Bad day"}
              </span>
              <span>
                <i className="is-hoangdao" />{" "}
                {language === "vi" ? "Ngày hoàng đạo" : "Auspicious"}
              </span>
              <span>
                <i className="is-hacdao" />{" "}
                {language === "vi" ? "Ngày hắc đạo" : "Inauspicious"}
              </span>
              <span>
                <i className="is-le" />{" "}
                {language === "vi" ? "Ngày lễ" : "Holiday"}
              </span>
              <span>
                <i className="is-event" />{" "}
                {language === "vi" ? "Sự kiện" : "Event"}
              </span>
            </div>

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

                  // Thời tiết mini (16 ngày dự báo) + trạng thái so với tuổi
                  let weatherCode: number | null = null;
                  let weatherMax: number | null = null;
                  if (dailyForecast) {
                    const index = dailyForecast.time.indexOf(toDateKey(date));
                    if (index >= 0) {
                      weatherCode = dailyForecast.weatherCode[index];
                      weatherMax = dailyForecast.tempMax[index];
                    }
                  }
                  const compat = getDayUserCompat(date, userZhi);

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
                        pickDate(date);
                        setPreviewHoliday(null);

                        if (
                          date.getMonth() !== month ||
                          date.getFullYear() !== year
                        ) {
                          onDisplayMonthChange(
                            new Date(date.getFullYear(), date.getMonth(), 1),
                          );
                        }
                      }}
                    >
                      <strong>{date.getDate()}</strong>
                      <small>{getLunarDayLabel(date)}</small>
                      {weatherCode !== null ? (
                        <span
                          className="wn-calendar-light-day__weather"
                          title={getWeatherDescription(weatherCode, language)}
                        >
                          <WeatherIcon code={weatherCode} size={12} />
                          <em>{Math.round(weatherMax ?? 0)}°</em>
                        </span>
                      ) : null}
                      {compat ? (
                        <i
                          className={
                            compat === "clash" ? "is-clash" : "is-compatible"
                          }
                          title={
                            compat === "clash"
                              ? language === "vi"
                                ? "Ngày xung với tuổi của bạn"
                                : "Clashes with your zodiac"
                              : language === "vi"
                                ? "Ngày hoàng đạo hợp tuổi"
                                : "Auspicious for your zodiac"
                          }
                        />
                      ) : null}
                      {holiday ? (
                        <span
                          className="wn-calendar-light-day__bubble"
                          aria-hidden="true"
                        >
                          ✦
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="wn-calendar-page__events">
              <div className="wn-calendar-page__events-head">
                <h3>
                  {language === "vi"
                    ? `Sự kiện nổi bật tháng ${month + 1}`
                    : `Featured events in ${monthLabelEn}`}
                </h3>
                <button type="button" onClick={() => setToolView("holidays")}>
                  {language === "vi" ? "Xem tất cả" : "View all"}{" "}
                  <ChevronRight size={15} />
                </button>
              </div>

              {monthEvents.length > 0 ? (
                <div className="wn-calendar-page__events-grid">
                  {monthEvents.map((item) => {
                    const visual = getHolidayVisual(item.date);

                    return (
                      <button
                        key={item.key}
                        type="button"
                        className="wn-calendar-page__event-card"
                        onClick={() => goToDate(item.date)}
                      >
                        <span className="wn-calendar-page__event-thumb">
                          {visual ? (
                            <img
                              src={visual.src}
                              alt={visual.alt[language]}
                              loading="lazy"
                            />
                          ) : (
                            <span aria-hidden="true">🎉</span>
                          )}
                        </span>
                        <span className="wn-calendar-page__event-info">
                          <small>{item.labelFull}</small>
                          <strong>{firstEventName(item.names)}</strong>
                          <em>{firstEventDesc(item.names, language)}</em>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="wn-calendar-light-tools__empty">
                  {language === "vi"
                    ? "Tháng này không có sự kiện nổi bật."
                    : "No featured events this month."}
                </p>
              )}
            </div>

            <div className="wn-calendar-light-tools">
              <div className="wn-calendar-light-tools__tabs">
                <button
                  type="button"
                  className={toolView === "convert" ? "is-active" : ""}
                  onClick={() =>
                    setToolView(toolView === "convert" ? "none" : "convert")
                  }
                >
                  {language === "vi"
                    ? "🔄 Máy chuyển đổi Âm ↔ Dương"
                    : "🔄 Lunar ↔ Solar converter"}
                </button>
                <button
                  type="button"
                  className={toolView === "holidays" ? "is-active" : ""}
                  onClick={() =>
                    setToolView(toolView === "holidays" ? "none" : "holidays")
                  }
                >
                  {language === "vi"
                    ? `⭐ Ngày lễ năm ${year}`
                    : `⭐ Holidays in ${year}`}
                </button>
              </div>

              {/* TOOL_PANELS */}
              {toolView === "convert" ? (
                <div className="wn-calendar-light-tools__panel">
                  <div className="wn-calendar-light-tools__modes">
                    <button
                      type="button"
                      className={convertMode === "lunar" ? "is-active" : ""}
                      onClick={() => {
                        setConvertMode("lunar");
                        setConvertResult(null);
                      }}
                    >
                      {language === "vi" ? "Âm → Dương" : "Lunar → Solar"}
                    </button>
                    <button
                      type="button"
                      className={convertMode === "solar" ? "is-active" : ""}
                      onClick={() => {
                        setConvertMode("solar");
                        setConvertResult(null);
                      }}
                    >
                      {language === "vi" ? "Dương → Âm" : "Solar → Lunar"}
                    </button>
                  </div>

                  {convertMode === "lunar" ? (
                    <div className="wn-calendar-light-tools__form">
                      <select
                        value={convertDay}
                        onChange={(e) => setConvertDay(Number(e.target.value))}
                      >
                        {Array.from({ length: 30 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {language === "vi"
                              ? `Ngày ${i + 1}`
                              : `Day ${i + 1}`}
                          </option>
                        ))}
                      </select>
                      <select
                        value={convertMonth}
                        onChange={(e) =>
                          setConvertMonth(Number(e.target.value))
                        }
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {language === "vi"
                              ? `Tháng ${i + 1}`
                              : `Month ${i + 1}`}
                          </option>
                        ))}
                      </select>
                      <select
                        value={convertYear}
                        onChange={(e) => setConvertYear(Number(e.target.value))}
                      >
                        {Array.from({ length: 201 }, (_, i) => {
                          const optionYear = 1900 + i;
                          return (
                            <option key={optionYear} value={optionYear}>
                              {optionYear}
                            </option>
                          );
                        })}
                      </select>
                      <label className="wn-calendar-light-tools__leap">
                        <input
                          type="checkbox"
                          checked={convertLeap}
                          onChange={(e) => setConvertLeap(e.target.checked)}
                        />
                        {language === "vi" ? "Tháng nhuận" : "Leap month"}
                      </label>
                      <button
                        type="button"
                        className="wn-calendar-light-tools__run"
                        onClick={runLunarToSolar}
                      >
                        {language === "vi" ? "Chuyển đổi" : "Convert"}
                      </button>
                    </div>
                  ) : (
                    <div className="wn-calendar-light-tools__form">
                      <input
                        type="date"
                        value={convertSolarDate}
                        onChange={(e) => setConvertSolarDate(e.target.value)}
                      />
                      <button
                        type="button"
                        className="wn-calendar-light-tools__run"
                        onClick={runSolarToLunar}
                      >
                        {language === "vi" ? "Chuyển đổi" : "Convert"}
                      </button>
                    </div>
                  )}

                  {convertResult ? (
                    <div
                      className={`wn-calendar-light-tools__result ${
                        convertResult.error ? "is-error" : ""
                      }`}
                    >
                      <span>{convertResult.text}</span>
                      {convertResult.date ? (
                        <button
                          type="button"
                          onClick={() => goToDate(convertResult.date as Date)}
                        >
                          {language === "vi" ? "Xem trên lịch" : "View"}
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {toolView === "holidays" ? (
                <div className="wn-calendar-light-tools__panel">
                  {yearHolidays.length > 0 ? (
                    <div className="wn-calendar-light-holiday-list">
                      {yearHolidays.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => goToDate(item.date)}
                          title={item.names}
                        >
                          <strong>{item.label}</strong>
                          <small>{item.lunar}</small>
                          <span>{item.names}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="wn-calendar-light-tools__empty">
                      {language === "vi"
                        ? `Không có ngày lễ nổi bật trong năm ${year}.`
                        : `No major holidays in ${year}.`}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </section>

          <aside className="wn-calendar-light-right">
            <button
              type="button"
              className="wn-calendar-page__mback"
              onClick={() => setMobilePane("grid")}
              aria-label={
                language === "vi" ? "Quay lại lịch tháng" : "Back to month"
              }
            >
              <span aria-hidden="true">‹</span>
              {language === "vi" ? "Quay lại lịch tháng" : "Back to month"}
            </button>
            {upcomingHoliday ? (
              <button
                type="button"
                className="wn-calendar-page__upcoming"
                onClick={() => goToDate(upcomingHoliday.date)}
              >
                <span
                  className="wn-calendar-page__upcoming-icon"
                  aria-hidden="true"
                >
                  🎉
                </span>
                <span className="wn-calendar-page__upcoming-info">
                  <small>
                    {language === "vi" ? "Ngày lễ sắp tới" : "Upcoming holiday"}
                  </small>
                  <strong>{upcomingHoliday.name}</strong>
                  <em>
                    {upcomingHoliday.daysUntil === 0
                      ? language === "vi"
                        ? "Hôm nay! 🎉"
                        : "Today! 🎉"
                      : upcomingHoliday.daysUntil === 1
                        ? language === "vi"
                          ? "Ngày mai! 🎉"
                          : "Tomorrow! 🎉"
                        : language === "vi"
                          ? `Còn ${upcomingHoliday.daysUntil} ngày`
                          : `In ${upcomingHoliday.daysUntil} days`}
                  </em>
                </span>
              </button>
            ) : null}

            <div className="wn-calendar-light-selected-card">
              <span className="wn-calendar-light-selected-kicker">
                {language === "vi" ? "Ngày đang chọn" : "Selected date"}
              </span>

              <h4>{formatDate(selectedDate, language)}</h4>

              <div className="wn-calendar-light-lunar-chip">
                <Moon size={17} />
                <span>{getLunarDate(selectedDate, language)}</span>
              </div>

              <div className="wn-calendar-page__badges">
                <span
                  className={`wn-calendar-page__badge ${
                    almanac.dayLuck === "hoangDao" ? "is-good" : "is-bad"
                  }`}
                >
                  {almanac.dayLuck === "hoangDao" ? "☀️" : "🌑"}{" "}
                  {almanac.dayLuck === "hoangDao"
                    ? language === "vi"
                      ? "Ngày hoàng đạo"
                      : "Auspicious day"
                    : language === "vi"
                      ? "Ngày hắc đạo"
                      : "Inauspicious day"}
                </span>

                {userZhi ? (
                  <span
                    className={`wn-calendar-page__badge ${
                      selectedCompat === "clash"
                        ? "is-clash"
                        : selectedCompat === "good"
                          ? "is-good"
                          : "is-neutral"
                    }`}
                  >
                    {selectedCompat === "clash"
                      ? "⚠️"
                      : selectedCompat === "good"
                        ? "✅"
                        : "➖"}{" "}
                    {selectedCompat === "clash"
                      ? language === "vi"
                        ? `Xung tuổi ${
                            ZHI_VIET[ZHI_HAN.indexOf(userZhi)] ?? userZhi
                          }`
                        : "Clashes zodiac"
                      : selectedCompat === "good"
                        ? language === "vi"
                          ? "Hợp tuổi"
                          : "Zodiac match"
                        : language === "vi"
                          ? "Trung tính"
                          : "Neutral"}
                  </span>
                ) : null}
              </div>

              <div className="wn-calendar-light-almanac">
                <div className="wn-calendar-page__stats">
                  <div className="wn-calendar-page__stat is-wide">
                    <small>Can chi</small>
                    <strong>{almanac.canChi}</strong>
                  </div>
                  <div className="wn-calendar-page__stat">
                    <small>Tiết khí</small>
                    <strong>{almanac.jieQi}</strong>
                  </div>
                  <div className="wn-calendar-page__stat">
                    <small>Pha trăng</small>
                    <strong>
                      {almanac.moonIcon} {almanac.moonLabel}
                    </strong>
                  </div>
                </div>
                {almanac.directions ? (
                  <div className="wn-calendar-light-almanac__hours">
                    <small>Hướng xuất hành</small>
                    <span>{almanac.directions}</span>
                  </div>
                ) : null}

                {almanac.truc ? (
                  <div className="wn-calendar-light-almanac__hours">
                    <small>12 Trực</small>
                    <span>{almanac.truc}</span>
                  </div>
                ) : null}

                {almanac.chong && !(userZhi && selectedCompat === "clash") ? (
                  <div className="wn-calendar-light-almanac__row">
                    <small>Tuổi xung khắc</small>
                    <strong>{almanac.chong}</strong>
                  </div>
                ) : null}

                <div className="wn-calendar-light-almanac__row wn-calendar-light-birthyear">
                  <small>Tuổi của bạn</small>
                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    inputMode="numeric"
                    placeholder={language === "vi" ? "Năm sinh" : "Birth year"}
                    value={birthYearInput}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 4);
                      setBirthYearInput(value);
                      try {
                        window.localStorage.setItem("wn-birth-year", value);
                      } catch {
                        // bỏ qua lỗi localStorage
                      }
                    }}
                  />
                </div>

                {almanac.luckyHours.length > 0 ? (
                  <div className="wn-calendar-light-almanac__hours">
                    <small>Giờ hoàng đạo</small>
                    <span>{almanac.luckyHours.join(" · ")}</span>
                  </div>
                ) : null}

                {almanac.yi ? (
                  <div className="wn-calendar-light-almanac__hours">
                    <small>Nên làm</small>
                    <span>{almanac.yi}</span>
                  </div>
                ) : null}

                {almanac.ji ? (
                  <div className="wn-calendar-light-almanac__hours">
                    <small>Kiêng làm</small>
                    <span>{almanac.ji}</span>
                  </div>
                ) : null}
              </div>

              {countdownLabel !== (language === "vi" ? "Hôm nay" : "Today") ? (
                <div className="wn-calendar-light-countdown">
                  <span>{countdownLabel}</span>
                </div>
              ) : null}

              {selectedHolidayVisual ? (
                <button
                  type="button"
                  className="wn-calendar-light-holiday-image"
                  onClick={() =>
                    setPreviewHoliday({
                      visual: selectedHolidayVisual,
                      title:
                        selectedHoliday ||
                        (language === "vi" ? "Ngày lễ" : "Holiday"),
                      dateLabel: formatDate(selectedDate, language),
                    })
                  }
                >
                  <img
                    src={selectedHolidayVisual.src}
                    alt={selectedHolidayVisual.alt[language]}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.parentElement?.classList.add(
                        "is-image-error",
                      );
                    }}
                  />
                </button>
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

      {previewHoliday ? (
        <div
          className="wn-holiday-preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={
            language === "vi" ? "Xem ảnh ngày lễ" : "View holiday image"
          }
          onMouseDown={() => setPreviewHoliday(null)}
        >
          <div
            className="wn-holiday-preview-card"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="wn-holiday-preview-close"
              onClick={() => setPreviewHoliday(null)}
              aria-label={
                language === "vi" ? "Đóng ảnh lễ" : "Close holiday image"
              }
            >
              <X size={20} />
            </button>

            <div className="wn-holiday-preview-badge">
              <Star size={16} />
              <span>
                {language === "vi" ? "Ngày lễ nổi bật" : "Featured holiday"}
              </span>
            </div>

            <div className="wn-holiday-preview-image">
              <img
                src={previewHoliday.visual.src}
                alt={previewHoliday.visual.alt[language]}
                loading="lazy"
              />
            </div>

            <div className="wn-holiday-preview-meta">
              <small>{previewHoliday.dateLabel}</small>
              <strong>{previewHoliday.title}</strong>
              <p>{countdownLabel}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
