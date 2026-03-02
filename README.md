# claudecode

Claude Code のカスタムスキル（スラッシュコマンド）や設定を管理するリポジトリ

## 構成

```
.
├── CLAUDE.md                    # プロジェクト指示ファイル
├── .claude/
│   └── commands/                # カスタムスラッシュコマンド
│       ├── review.md            # /review - コードレビュー
│       ├── refactor.md          # /refactor - リファクタリング提案
│       └── test.md              # /test - テスト生成
└── .gitignore
```

## 使い方

### カスタムスキルの追加

`.claude/commands/` ディレクトリにMarkdownファイルを追加すると、Claude Codeでスラッシュコマンドとして使えます。

```bash
# 例: /review コマンドを実行
/review
```

### プロジェクト指示

`CLAUDE.md` にはプロジェクト全体の指示を記述します。Claude Codeがリポジトリで作業する際に自動的に読み込まれます。

## カスタムコマンドの作り方

1. `.claude/commands/` に新しい `.md` ファイルを作成
2. プロンプトテンプレートを記述
3. `$ARGUMENTS` プレースホルダーで引数を受け取り可能

例:
```markdown
# .claude/commands/explain.md
以下のコードを日本語でわかりやすく説明してください:

$ARGUMENTS
```

## ライセンス

MIT
