# claudecode

Claude Code のカスタムスキルと設定を管理するリポジトリです。

## プロジェクト構成

- `.claude/commands/` - カスタムスラッシュコマンド（スキル）
- 各コマンドは Markdown ファイルとして定義
- `$ARGUMENTS` でユーザーからの引数を受け取る

## コーディング規約

- 日本語でコメントやドキュメントを記述
- Markdown ファイルは UTF-8 エンコーディング
- ファイル名は小文字のケバブケース（例: `my-command.md`）
