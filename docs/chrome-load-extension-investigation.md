# Chrome 拡張ロード調査結果

`npm run inspect:chrome` で `--load-extension` が動作しなかった原因と対策の記録。

## 問題

Chrome 148（Dev/Canary チャンネル）では `--load-extension` CLI フラグが無視される。

## 試したこと

| 方法 | 結果 |
|------|------|
| `open -na "Google Chrome" --args --load-extension=...` | フラグが渡らない |
| Chrome バイナリを直接起動 | フラグは渡るが拡張が読み込まれない |
| `--no-first-run` 追加 | 変わらず |
| プロファイルの `Default/Preferences` に `developer_mode: true` を事前書き込み | Chrome 起動時に上書きされて無効 |
| `--disable-extensions-except` を削除して `--load-extension` 単独 | 変わらず |
| Playwright `launchPersistentContext` 経由 | 拡張は読み込める。ただし Chromium が不安定にクラッシュする |
| **Playwright Chromium バイナリを直接起動（detached）** | **拡張が読み込める・安定動作 ✅** |

## 現在の実装

`scripts/open-chrome-dev.js` で `chromium.executablePath()` により Playwright 同梱の Chromium（Chrome for Testing）バイナリを取得し、`child_process.spawn` で直接起動している。
Playwright の DevTools Protocol 接続を持たないため安定して動作する。

## 制約

Playwright Chromium（Chrome for Testing v147）はレンダリングが実際の Chrome と差があるため、**印刷レイアウトの最終確認には向かない**。

- `npm run inspect:chrome` は「拡張が動くか・コードの動作確認」用途に使う
- 印刷レイアウトの最終確認は実際の Chrome に手動でアンパック拡張を読み込んで確認する
