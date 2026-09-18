declare module "lunar-javascript" {
  export class Lunar {
    /** Tạo ngày âm lịch; tháng nhuận dùng số âm (vd -2 cho tháng nhuận 2) */
    static fromYmd(year: number, month: number, day: number): Lunar;

    getDay(): number;
    getMonth(): number;
    getYear(): number;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getJieQi(): string;
    getPrevJieQi(wholeDay?: boolean): JieQi;
    getTimes(): LunarTime[];
    getDayTianShenType(): string;
    getDayTianShenLuck(): string;
    getDayYi(sect?: number): string[];
    getDayJi(sect?: number): string[];
    /** Hướng Hỷ thần (dạng 正北, 东南...) */
    getDayPositionXiDesc(): string;
    /** Hướng Tài thần (dạng 正北, 东南...) */
    getDayPositionCaiDesc(): string;
    /** Hướng Phúc thần (sect = 1 hoặc 2) */
    getDayPositionFuDesc(sect?: number): string;
    /** 12 Trực: 建/除/满/平/定/执/破/危/成/收/开/闭 */
    getZhiXing(): string;
    /** Chi bị xung với ngày (ví dụ 午) */
    getDayChong(): string;
    /** Con giáp bị xung với ngày (ví dụ 马) */
    getDayChongShengXiao(): string;
    /** Chi của năm âm lịch (ví dụ 辰) */
    getYearZhi(): string;
    /** Chi của ngày (ví dụ 未) */
    getDayZhi(): string;
    /** Ngày dương lịch tương ứng */
    getSolar(): Solar;
  }

  export type JieQi = {
    getName(): string;
    getSolar(): Solar;
  };

  export type LunarTime = {
    getMinHm(): string;
    getMaxHm(): string;
    getZhi(): string;
    getGanZhi(): string;
    getTianShenType(): string;
  };

  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    /** Chuỗi YYYY-MM-DD */
    toYmd(): string;
    getLunar(): Lunar;
  }
}
