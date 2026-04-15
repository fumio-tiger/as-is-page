# Chrome DevTools とスクリーンショット運用

## 目的

印刷レイアウトの見た目を、Chrome 拡張の実行に近い形で素早く確認するための手順です。

## 使い方

1. `npm install`
2. 別ターミナルで `npm run serve:fixtures`
3. 別ターミナルで `npm run inspect:chrome`
4. Chrome で `http://127.0.0.1:4173/` が開いたら、対象ページに移動

## DevTools で見るポイント

1. DevTools を開く
2. Command Menu で `Rendering` を開く
3. `Emulate CSS media type` を `print` に切り替える
4. Elements パネルで `style[data-screen-pdf="true"]` が入っているか確認する

## 拡張の実行方法

- ツールバーの拡張アイコンを押す
- または `Command+Shift+Y` / `Ctrl+Shift+Y` を押す

## Codex に渡すと分析しやすい情報

- 対象 URL
- 発生している見た目の問題
- `artifacts/print-screens/*.png` のスクリーンショット
- DevTools で確認した対象 DOM と適用 CSS

## スクリーンショットの作成

`npm run test:print` を実行すると、以下に画像が出ます。

- `artifacts/print-screens/article-print.png`
- `artifacts/print-screens/table-print.png`
- `artifacts/print-screens/media-print.png`

実サイトの相談時は、同じフォルダに手動で追加保存しても運用しやすいです。
