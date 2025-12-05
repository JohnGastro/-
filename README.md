# Garbage Calendar Bot

ゴミ収集日をリマインドしてくれるカレンダーBot

## 機能

- 今日・明日・今週のゴミ収集情報を表示
- Slack Webhookで通知
- CSVファイルからスケジュールを読み込み

## セットアップ

```bash
npm install
```

## 使い方

### コマンドラインで確認

```bash
# 今日のゴミ
npm run today

# 明日のゴミ
npm run tomorrow

# 今週のスケジュール
npm run week
```

### Slackに通知

1. Slack Incoming Webhookを作成
2. 環境変数を設定

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/xxx/yyy/zzz"
```

3. 通知を送信

```bash
# 今日のゴミをSlackに通知
npm run slack:today

# 明日のゴミをSlackに通知（前日リマインド用）
npm run slack:tomorrow
```

### CSVからスケジュールを読み込む

環境変数 `GARBAGE_CSV_PATH` にCSVファイルのパスを設定:

```bash
export GARBAGE_CSV_PATH="/path/to/schedule.csv"
```

CSVフォーマット:
```csv
日付,ゴミの種類
2025-01-06,燃えるゴミ
2025-01-07,資源ゴミ
2025-01-08,古紙
```

対応しているゴミの種類:
- 燃えるゴミ / 可燃ゴミ
- 燃えないゴミ / 不燃ゴミ
- 資源ゴミ / カン・ビン / ペットボトル
- プラスチック
- 古紙 / 紙類
- 粗大ゴミ

## 毎朝の自動通知（cron設定例）

```bash
# 毎朝7時に今日のゴミをSlackに通知
0 7 * * * cd /path/to/garbage-calendar-bot && SLACK_WEBHOOK_URL="xxx" npm run slack:today

# 毎晩21時に明日のゴミをSlackに通知（前日リマインド）
0 21 * * * cd /path/to/garbage-calendar-bot && SLACK_WEBHOOK_URL="xxx" npm run slack:tomorrow
```

## 開発

```bash
# TypeScriptをビルド
npm run build

# 開発モードで実行
npm run dev
```

## ライセンス

MIT
