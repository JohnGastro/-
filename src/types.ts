/**
 * ゴミの種類
 */
export enum GarbageType {
  BURNABLE = 'burnable',           // 燃えるゴミ（可燃ゴミ）
  NON_BURNABLE = 'non_burnable',   // 燃えないゴミ（不燃ゴミ）
  RECYCLABLE = 'recyclable',       // 資源ゴミ（缶・ビン・ペットボトル）
  PLASTIC = 'plastic',             // プラスチック
  PAPER = 'paper',                 // 紙類・古紙
  OVERSIZED = 'oversized',         // 粗大ゴミ
}

/**
 * 曜日
 */
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

/**
 * ゴミの種類ごとの表示情報
 */
export interface GarbageInfo {
  type: GarbageType;
  name: string;        // 日本語名
  emoji: string;       // 絵文字
  description: string; // 説明
  examples: string[];  // 出せるものの例
}

/**
 * 収集スケジュール
 */
export interface CollectionSchedule {
  garbageType: GarbageType;
  dayOfWeek: DayOfWeek;
  weekOfMonth?: number[];  // 第何週か（指定しなければ毎週）
}

/**
 * 今日の収集情報
 */
export interface TodayCollection {
  date: Date;
  garbageTypes: GarbageInfo[];
}
