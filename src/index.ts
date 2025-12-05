import {
  getTodayCollection,
  getTomorrowCollection,
  getWeekSchedule,
  getCollectionForDate,
} from './calendar';
import {
  createTodayMessage,
  createTomorrowMessage,
  createWeekScheduleMessage,
} from './messenger';
import { notifyToday, notifyTomorrow } from './slack';
import {
  loadScheduleFromCSV,
  getCollectionForDateFromSchedule,
  generateSampleCSV,
} from './csv-loader';
import { TodayCollection } from './types';
import { GARBAGE_INFO } from './data';

// エクスポート（ライブラリとして使用する場合）
export * from './types';
export * from './data';
export * from './calendar';
export * from './messenger';
export * from './slack';
export * from './csv-loader';

/**
 * CSVファイルパスを環境変数から取得
 */
function getCSVPath(): string | undefined {
  return process.env.GARBAGE_CSV_PATH;
}

/**
 * CSVがある場合はそこから、なければデフォルトスケジュールから取得
 */
function getTodayCollectionAuto(): TodayCollection {
  const csvPath = getCSVPath();
  const today = new Date();

  if (csvPath) {
    try {
      const schedules = loadScheduleFromCSV(csvPath);
      const garbageTypes = getCollectionForDateFromSchedule(today, schedules);
      return { date: today, garbageTypes };
    } catch (e) {
      console.error(`CSVの読み込みに失敗しました: ${e}`);
    }
  }

  return getTodayCollection();
}

/**
 * CSVがある場合はそこから、なければデフォルトスケジュールから取得（明日）
 */
function getTomorrowCollectionAuto(): TodayCollection {
  const csvPath = getCSVPath();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (csvPath) {
    try {
      const schedules = loadScheduleFromCSV(csvPath);
      const garbageTypes = getCollectionForDateFromSchedule(tomorrow, schedules);
      return { date: tomorrow, garbageTypes };
    } catch (e) {
      console.error(`CSVの読み込みに失敗しました: ${e}`);
    }
  }

  return getTomorrowCollection();
}

/**
 * メイン関数
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || '--today';

  switch (command) {
    case '--today':
    case '-t': {
      const todayCollection = getTodayCollectionAuto();
      console.log(createTodayMessage(todayCollection));
      break;
    }

    case '--tomorrow':
    case '-m': {
      const tomorrowCollection = getTomorrowCollectionAuto();
      console.log(createTomorrowMessage(tomorrowCollection));
      break;
    }

    case '--week':
    case '-w': {
      const weekSchedule = getWeekSchedule();
      console.log(createWeekScheduleMessage(weekSchedule));
      break;
    }

    case '--slack-today':
    case '-st': {
      const todayCollection = getTodayCollectionAuto();
      console.log('Slackに今日のゴミ情報を送信中...');
      await notifyToday(todayCollection);
      console.log('送信完了!');
      break;
    }

    case '--slack-tomorrow':
    case '-sm': {
      const tomorrowCollection = getTomorrowCollectionAuto();
      console.log('Slackに明日のゴミ情報を送信中...');
      await notifyTomorrow(tomorrowCollection);
      console.log('送信完了!');
      break;
    }

    case '--generate-sample':
    case '-g': {
      console.log('サンプルCSV:');
      console.log(generateSampleCSV());
      break;
    }

    case '--help':
    case '-h': {
      console.log(`
🗑️ ゴミカレンダーBot

使い方:
  npm run today          今日のゴミ収集情報を表示
  npm run tomorrow       明日のゴミ収集情報を表示
  npm run week           今週のゴミ収集スケジュールを表示
  npm run slack:today    今日のゴミ情報をSlackに送信
  npm run slack:tomorrow 明日のゴミ情報をSlackに送信

オプション:
  --today, -t           今日のゴミ収集情報
  --tomorrow, -m        明日のゴミ収集情報（前日リマインド）
  --week, -w            今週のスケジュール
  --slack-today, -st    Slackに今日のゴミ情報を送信
  --slack-tomorrow, -sm Slackに明日のゴミ情報を送信
  --generate-sample, -g サンプルCSVを生成
  --help, -h            ヘルプを表示

環境変数:
  SLACK_WEBHOOK_URL     Slack Incoming WebhookのURL
  GARBAGE_CSV_PATH      ゴミ収集スケジュールCSVのパス

CSVフォーマット:
  日付,ゴミの種類
  2025-01-06,燃えるゴミ
  2025-01-07,資源ゴミ
`);
      break;
    }

    default:
      console.error(`不明なコマンド: ${command}`);
      console.log('--help でヘルプを表示');
      process.exit(1);
  }
}

// 直接実行された場合のみmain()を実行
if (require.main === module) {
  main().catch((e) => {
    console.error('エラー:', e.message);
    process.exit(1);
  });
}
