import { GarbageType, GarbageInfo, DayOfWeek, CollectionSchedule } from './types';

/**
 * ゴミの種類ごとの詳細情報
 */
export const GARBAGE_INFO: Record<GarbageType, GarbageInfo> = {
  [GarbageType.BURNABLE]: {
    type: GarbageType.BURNABLE,
    name: '燃えるゴミ',
    emoji: '🔥',
    description: '可燃ゴミ・生ゴミなど',
    examples: ['生ゴミ', '紙くず', '布類', 'プラスチック製品（汚れているもの）', 'ゴム・革製品'],
  },
  [GarbageType.NON_BURNABLE]: {
    type: GarbageType.NON_BURNABLE,
    name: '燃えないゴミ',
    emoji: '🪨',
    description: '不燃ゴミ・金属類など',
    examples: ['金属類', '陶器', 'ガラス', '小型家電', '傘'],
  },
  [GarbageType.RECYCLABLE]: {
    type: GarbageType.RECYCLABLE,
    name: '資源ゴミ',
    emoji: '♻️',
    description: '缶・ビン・ペットボトル',
    examples: ['アルミ缶', 'スチール缶', 'ガラスビン', 'ペットボトル'],
  },
  [GarbageType.PLASTIC]: {
    type: GarbageType.PLASTIC,
    name: 'プラスチック',
    emoji: '🧴',
    description: 'プラスチック製容器包装',
    examples: ['食品トレー', 'レジ袋', 'ペットボトルのキャップ・ラベル', '発泡スチロール'],
  },
  [GarbageType.PAPER]: {
    type: GarbageType.PAPER,
    name: '古紙・紙類',
    emoji: '📰',
    description: '新聞・段ボール・雑誌など',
    examples: ['新聞紙', '段ボール', '雑誌', '牛乳パック', 'その他の紙'],
  },
  [GarbageType.OVERSIZED]: {
    type: GarbageType.OVERSIZED,
    name: '粗大ゴミ',
    emoji: '🛋️',
    description: '大型ゴミ（要予約）',
    examples: ['家具', '自転車', '布団', '電子レンジ'],
  },
};

/**
 * 曜日の日本語名
 */
export const DAY_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: '日曜日',
  [DayOfWeek.MONDAY]: '月曜日',
  [DayOfWeek.TUESDAY]: '火曜日',
  [DayOfWeek.WEDNESDAY]: '水曜日',
  [DayOfWeek.THURSDAY]: '木曜日',
  [DayOfWeek.FRIDAY]: '金曜日',
  [DayOfWeek.SATURDAY]: '土曜日',
};

/**
 * デフォルトの収集スケジュール（サンプル）
 * ※実際のスケジュールは地域によって異なります
 */
export const DEFAULT_SCHEDULE: CollectionSchedule[] = [
  // 燃えるゴミ: 月曜・木曜
  { garbageType: GarbageType.BURNABLE, dayOfWeek: DayOfWeek.MONDAY },
  { garbageType: GarbageType.BURNABLE, dayOfWeek: DayOfWeek.THURSDAY },

  // 燃えないゴミ: 第2・第4水曜
  { garbageType: GarbageType.NON_BURNABLE, dayOfWeek: DayOfWeek.WEDNESDAY, weekOfMonth: [2, 4] },

  // 資源ゴミ: 火曜
  { garbageType: GarbageType.RECYCLABLE, dayOfWeek: DayOfWeek.TUESDAY },

  // プラスチック: 金曜
  { garbageType: GarbageType.PLASTIC, dayOfWeek: DayOfWeek.FRIDAY },

  // 古紙・紙類: 第1・第3水曜
  { garbageType: GarbageType.PAPER, dayOfWeek: DayOfWeek.WEDNESDAY, weekOfMonth: [1, 3] },
];
