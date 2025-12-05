import { DayOfWeek, GarbageInfo, CollectionSchedule, TodayCollection } from './types';
import { GARBAGE_INFO, DEFAULT_SCHEDULE } from './data';

/**
 * 指定された日付が月の第何週目かを計算
 */
export function getWeekOfMonth(date: Date): number {
  const day = date.getDate();
  return Math.ceil(day / 7);
}

/**
 * 指定された日付のゴミ収集情報を取得
 */
export function getCollectionForDate(
  date: Date,
  schedule: CollectionSchedule[] = DEFAULT_SCHEDULE
): GarbageInfo[] {
  const dayOfWeek = date.getDay() as DayOfWeek;
  const weekOfMonth = getWeekOfMonth(date);

  const todaySchedule = schedule.filter((s) => {
    // 曜日が一致するか
    if (s.dayOfWeek !== dayOfWeek) {
      return false;
    }
    // 週の指定がある場合はチェック
    if (s.weekOfMonth && !s.weekOfMonth.includes(weekOfMonth)) {
      return false;
    }
    return true;
  });

  return todaySchedule.map((s) => GARBAGE_INFO[s.garbageType]);
}

/**
 * 今日のゴミ収集情報を取得
 */
export function getTodayCollection(
  schedule: CollectionSchedule[] = DEFAULT_SCHEDULE
): TodayCollection {
  const today = new Date();
  return {
    date: today,
    garbageTypes: getCollectionForDate(today, schedule),
  };
}

/**
 * 明日のゴミ収集情報を取得
 */
export function getTomorrowCollection(
  schedule: CollectionSchedule[] = DEFAULT_SCHEDULE
): TodayCollection {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    date: tomorrow,
    garbageTypes: getCollectionForDate(tomorrow, schedule),
  };
}

/**
 * 今週のゴミ収集スケジュールを取得
 */
export function getWeekSchedule(
  schedule: CollectionSchedule[] = DEFAULT_SCHEDULE
): TodayCollection[] {
  const result: TodayCollection[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const collection = getCollectionForDate(date, schedule);
    if (collection.length > 0) {
      result.push({ date, garbageTypes: collection });
    }
  }

  return result;
}

/**
 * 指定した日数先までのスケジュールを取得
 */
export function getUpcomingSchedule(
  days: number,
  schedule: CollectionSchedule[] = DEFAULT_SCHEDULE
): TodayCollection[] {
  const result: TodayCollection[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const collection = getCollectionForDate(date, schedule);
    if (collection.length > 0) {
      result.push({ date, garbageTypes: collection });
    }
  }

  return result;
}
