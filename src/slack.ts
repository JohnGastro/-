import https from 'https';
import { URL } from 'url';
import { TodayCollection } from './types';
import { formatDate, formatGarbageList } from './messenger';

/**
 * Slack Webhook URLの環境変数名
 */
const SLACK_WEBHOOK_URL_ENV = 'SLACK_WEBHOOK_URL';

/**
 * Slackメッセージのブロック形式
 */
interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  elements?: Array<{
    type: string;
    text: string;
    emoji?: boolean;
  }>;
}

/**
 * Slackメッセージペイロード
 */
interface SlackPayload {
  text: string;
  blocks?: SlackBlock[];
}

/**
 * Slack用のリッチメッセージを生成
 */
export function createSlackMessage(
  collection: TodayCollection,
  isTomorrow = false
): SlackPayload {
  const prefix = isTomorrow ? '明日' : '今日';
  const dateStr = formatDate(collection.date);

  if (collection.garbageTypes.length === 0) {
    return {
      text: `${prefix}はゴミの日ではありません`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${prefix}のゴミ*\n${dateStr}\n\nゴミの日ではありません :relieved:`,
          },
        },
      ],
    };
  }

  const garbageList = collection.garbageTypes
    .map((g) => `${g.emoji} *${g.name}*`)
    .join('\n');

  const details = collection.garbageTypes
    .map((g) => `• ${g.name}: ${g.examples.slice(0, 3).join('、')}`)
    .join('\n');

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${isTomorrow ? '🔔 明日' : '🗑️ 今日'}のゴミ出し`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${dateStr}*\n\n${garbageList}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*出せるもの*\n${details}`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: isTomorrow
            ? ':clock8: 今夜のうちに準備しておきましょう！'
            : ':clock8: 朝8時までに出しましょう！',
        },
      ],
    },
  ];

  return {
    text: `${prefix}のゴミ: ${formatGarbageList(collection.garbageTypes)}`,
    blocks,
  };
}

/**
 * Slack Webhookにメッセージを送信
 */
export async function sendToSlack(
  payload: SlackPayload,
  webhookUrl?: string
): Promise<void> {
  const url = webhookUrl || process.env[SLACK_WEBHOOK_URL_ENV];

  if (!url) {
    throw new Error(
      `Slack Webhook URLが設定されていません。環境変数 ${SLACK_WEBHOOK_URL_ENV} を設定してください。`
    );
  }

  const parsedUrl = new URL(url);
  const data = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Slack API error: ${res.statusCode}`));
        }
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * 今日のゴミ情報をSlackに送信
 */
export async function notifyToday(
  collection: TodayCollection,
  webhookUrl?: string
): Promise<void> {
  const payload = createSlackMessage(collection, false);
  await sendToSlack(payload, webhookUrl);
}

/**
 * 明日のゴミ情報をSlackに送信（前日リマインド）
 */
export async function notifyTomorrow(
  collection: TodayCollection,
  webhookUrl?: string
): Promise<void> {
  const payload = createSlackMessage(collection, true);
  await sendToSlack(payload, webhookUrl);
}
