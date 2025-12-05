import { TodayCollection, GarbageInfo } from './types';
import { DAY_NAMES } from './data';
import { DayOfWeek } from './types';

/**
 * 日付をフォーマット
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAY_NAMES[date.getDay() as DayOfWeek];
  return `${year}年${month}月${day}日（${dayOfWeek.replace('曜日', '')}）`;
}

/**
 * ゴミの種類リストをフォーマット
 */
export function formatGarbageList(garbageTypes: GarbageInfo[]): string {
  if (garbageTypes.length === 0) {
    return 'なし';
  }
  return garbageTypes.map((g) => `${g.emoji} ${g.name}`).join('、');
}

/**
 * 今日のゴミ通知メッセージを生成
 */
export function createTodayMessage(collection: TodayCollection): string {
  const dateStr = formatDate(collection.date);
  const garbageList = formatGarbageList(collection.garbageTypes);

  if (collection.garbageTypes.length === 0) {
    return `📅 ${dateStr}\n\n今日はゴミの日ではありません。`;
  }

  let message = `📅 ${dateStr}\n\n`;
  message += `🗑️ 今日のゴミ: ${garbageList}\n\n`;

  collection.garbageTypes.forEach((g) => {
    message += `${g.emoji} ${g.name}\n`;
    message += `   ${g.description}\n`;
    message += `   例: ${g.examples.slice(0, 3).join('、')}\n\n`;
  });

  message += '⏰ 朝8時までに出しましょう！';

  return message;
}

/**
 * 明日のゴミ通知メッセージを生成（前日リマインド用）
 */
export function createTomorrowMessage(collection: TodayCollection): string {
  const dateStr = formatDate(collection.date);
  const garbageList = formatGarbageList(collection.garbageTypes);

  if (collection.garbageTypes.length === 0) {
    return `📅 明日 ${dateStr}\n\n明日はゴミの日ではありません。`;
  }

  let message = `🔔 明日のゴミ出しリマインド\n\n`;
  message += `📅 ${dateStr}\n`;
  message += `🗑️ ゴミの種類: ${garbageList}\n\n`;

  collection.garbageTypes.forEach((g) => {
    message += `${g.emoji} ${g.name}: ${g.examples.slice(0, 3).join('、')}\n`;
  });

  message += '\n⏰ 今夜のうちに準備しておきましょう！';

  return message;
}

/**
 * 週間スケジュールメッセージを生成
 */
export function createWeekScheduleMessage(collections: TodayCollection[]): string {
  let message = `📆 今週のゴミ収集スケジュール\n`;
  message += `${'─'.repeat(30)}\n\n`;

  if (collections.length === 0) {
    message += '今週は収集日がありません。';
    return message;
  }

  collections.forEach((c) => {
    const dateStr = formatDate(c.date);
    const garbageList = formatGarbageList(c.garbageTypes);
    message += `📅 ${dateStr}\n`;
    message += `   ${garbageList}\n\n`;
  });

  return message;
}

/**
 * シンプルな通知メッセージ（Webhook用）
 */
export function createSimpleNotification(collection: TodayCollection, isTomorrow = false): string {
  const prefix = isTomorrow ? '【明日】' : '【今日】';
  const garbageList = formatGarbageList(collection.garbageTypes);

  if (collection.garbageTypes.length === 0) {
    return `${prefix} ゴミの日ではありません`;
  }

  return `${prefix} ${garbageList}`;
}
