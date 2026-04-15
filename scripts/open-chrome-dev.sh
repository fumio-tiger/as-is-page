#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
PROFILE_DIR="$ROOT_DIR/.tmp/chrome-dev-profile"
FIXTURES_PORT=4173

mkdir -p "$PROFILE_DIR/Default"

# デベロッパーモードが有効なプロファイル設定を初回のみ作成
# （developer_mode=ON でないと --load-extension が新規プロファイルで無視される）
PREFS_FILE="$PROFILE_DIR/Default/Preferences"
if [ ! -f "$PREFS_FILE" ]; then
  printf '{"extensions":{"ui":{"developer_mode":true}}}' > "$PREFS_FILE"
  echo "プロファイルを初期化しました（デベロッパーモード有効）"
fi

# ポート4173 が既に使用中かチェックしてから、未使用であればサーバーを起動
if lsof -ti tcp:"$FIXTURES_PORT" > /dev/null 2>&1; then
  echo "ポート $FIXTURES_PORT は既に起動中です。既存サーバーを使用します。"
else
  echo "ローカルフィクスチャサーバーをポート $FIXTURES_PORT で起動中..."
  python3 -m http.server "$FIXTURES_PORT" --directory "$ROOT_DIR/tests/fixtures" &
  SERVER_PID=$!
  echo "  PID: $SERVER_PID"

  # サーバーが起動するまで最大3秒待機
  for i in $(seq 1 10); do
    if lsof -ti tcp:"$FIXTURES_PORT" > /dev/null 2>&1; then
      break
    fi
    sleep 0.3
  done
fi

# Chromeのバイナリを探す（複数の候補を試す）
CHROME_BIN=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
do
  if [ -f "$candidate" ]; then
    CHROME_BIN="$candidate"
    break
  fi
done

if [ -z "$CHROME_BIN" ]; then
  echo "エラー: Google Chrome が見つかりません。インストールされているか確認してください。" >&2
  exit 1
fi

echo "Chrome を拡張付きで起動中..."
echo "  プロファイル: $PROFILE_DIR"
echo "  拡張: $ROOT_DIR"
echo "  URL: http://127.0.0.1:$FIXTURES_PORT/"

# open -na の代わりにバイナリを直接呼び出すことで --load-extension が確実に渡る
# --no-first-run: 初回起動ウィザードをスキップ（拡張読み込みの妨害を防ぐ）
"$CHROME_BIN" \
  --user-data-dir="$PROFILE_DIR" \
  --no-first-run \
  --load-extension="$ROOT_DIR" \
  "http://127.0.0.1:$FIXTURES_PORT/" &

echo "起動しました。Ctrl+C でこのターミナルを終了するとサーバーも停止します。"

# サーバープロセスが存在する場合は待機（Ctrl+C で終了）
if [ -n "${SERVER_PID:-}" ]; then
  trap 'echo "\nサーバーを停止中..."; kill "$SERVER_PID" 2>/dev/null; exit 0' INT TERM
  wait "$SERVER_PID"
fi
