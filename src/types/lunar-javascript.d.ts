declare module "lunar-javascript" {
  export type Lunar = {
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
  };

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
    getLunar(): Lunar;
  }
}
