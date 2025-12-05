import * as fs from 'fs';
import * as path from 'path';
import { GarbageType, GarbageInfo, CollectionSchedule } from './types';
import { GARBAGE_INFO } from './data';

/**
 * CSVから日付ベースのスケジュールを読み込む形式
 * フォーマット: 日付,ゴミの種類
 * 例: 2025-01-06,燃えるゴミ
 */
export interface DateBasedSchedule {
  date: Date;
  garbageTypes: GarbageType[];
}

/**
 * ゴミの種類名からGarbageTypeへのマッピング
 */
const GARBAGE_TYPE_MAP: Record<string, GarbageType> = {
  // 燃えるゴミ
  '燃えるゴミ': GarbageType.BURNABLE,
  '可燃ゴミ': GarbageType.BURNABLE,
  '可燃': GarbageType.BURNABLE,
  '燃える': GarbageType.BURNABLE,
  'もえるごみ': GarbageType.BURNABLE,
  '燃やせるごみ': GarbageType.BURNABLE,

  // 燃えないゴミ
  '燃えないゴミ': GarbageType.NON_BURNABLE,
  '不燃ゴミ': GarbageType.NON_BURNABLE,
  '不燃': GarbageType.NON_BURNABLE,
  '燃えない': GarbageType.NON_BURNABLE,
  'もえないごみ': GarbageType.NON_BURNABLE,
  '燃やせないごみ': GarbageType.NON_BURNABLE,

  // 資源ゴミ
  '資源ゴミ': GarbageType.RECYCLABLE,
  '資源': GarbageType.RECYCLABLE,
  'カン・ビン': GarbageType.RECYCLABLE,
  '缶・ビン': GarbageType.RECYCLABLE,
  'ペットボトル': GarbageType.RECYCLABLE,
  'びん・かん': GarbageType.RECYCLABLE,
  'びん': GarbageType.RECYCLABLE,
  'かん': GarbageType.RECYCLABLE,

  // プラスチック
  'プラスチック': GarbageType.PLASTIC,
  'プラ': GarbageType.PLASTIC,
  'プラスチック製容器包装': GarbageType.PLASTIC,
  '容器包装プラスチック': GarbageType.PLASTIC,

  // 古紙・紙類
  '古紙': GarbageType.PAPER,
  '紙類': GarbageType.PAPER,
  '古紙・紙類': GarbageType.PAPER,
  '新聞': GarbageType.PAPER,
  '段ボール': GarbageType.PAPER,
  '紙・布類': GarbageType.PAPER,

  // 粗大ゴミ
  '粗大ゴミ': GarbageType.OVERSIZED,
  '粗大': GarbageType.OVERSIZED,
  '大型ゴミ': GarbageType.OVERSIZED,
};

/**
 * ゴミの種類名をGarbageTypeに変換
 */
export function parseGarbageType(name: string): GarbageType | null {
  const normalized = name.trim();
  return GARBAGE_TYPE_MAP[normalized] || null;
}

/**
 * 日付文字列をDateに変換
 * 対応フォーマット: YYYY-MM-DD, YYYY/MM/DD, MM/DD
 */
export function parseDate(dateStr: string, year?: number): Date | null {
  const normalized = dateStr.trim();

  // YYYY-MM-DD または YYYY/MM/DD
  let match = normalized.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }

  // MM/DD または MM-DD (年は引数または現在の年)
  match = normalized.match(/^(\d{1,2})[-\/](\d{1,2})$/);
  if (match) {
    const y = year || new Date().getFullYear();
    return new Date(y, parseInt(match[1]) - 1, parseInt(match[2]));
  }

  return null;
}

/**
 * CSVファイルを読み込んで日付ベースのスケジュールを返す
 * フォーマット: 日付,ゴミの種類1,ゴミの種類2,...
 */
export function loadScheduleFromCSV(filePath: string): DateBasedSchedule[] {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CSVファイルが見つかりません: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  const lines = content.split('\n').filter((line) => line.trim());

  const schedules: DateBasedSchedule[] = [];

  // ヘッダー行をスキップ（日付で始まらない行）
  const startIndex = lines[0].match(/^\d/) ? 0 : 1;

  for (let i = startIndex; i < lines.length; i++) {
    const columns = lines[i].split(',').map((col) => col.trim());

    if (columns.length < 2) continue;

    const date = parseDate(columns[0]);
    if (!date) continue;

    const garbageTypes: GarbageType[] = [];

    for (let j = 1; j < columns.length; j++) {
      const type = parseGarbageType(columns[j]);
      if (type) {
        garbageTypes.push(type);
      }
    }

    if (garbageTypes.length > 0) {
      schedules.push({ date, garbageTypes });
    }
  }

  return schedules;
}

/**
 * 日付ベースのスケジュールから指定日のゴミ情報を取得
 */
export function getCollectionForDateFromSchedule(
  targetDate: Date,
  schedules: DateBasedSchedule[]
): GarbageInfo[] {
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const schedule = schedules.find((s) => {
    const scheduleDate = new Date(
      s.date.getFullYear(),
      s.date.getMonth(),
      s.date.getDate()
    );
    return scheduleDate.getTime() === target.getTime();
  });

  if (!schedule) {
    return [];
  }

  return schedule.garbageTypes.map((type) => GARBAGE_INFO[type]);
}

/**
 * サンプルCSVを生成
 */
export function generateSampleCSV(): string {
  const lines = [
    '日付,ゴミの種類',
    '2025-01-06,燃えるゴミ',
    '2025-01-07,資源ゴミ',
    '2025-01-08,古紙',
    '2025-01-09,燃えるゴミ',
    '2025-01-10,プラスチック',
    '2025-01-13,燃えるゴミ',
    '2025-01-14,資源ゴミ',
    '2025-01-15,燃えないゴミ',
    '2025-01-16,燃えるゴミ',
    '2025-01-17,プラスチック',
  ];
  return lines.join('\n');
}
