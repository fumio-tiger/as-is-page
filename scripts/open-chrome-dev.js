/**
 * Playwright Chromium のバイナリを直接起動することで拡張を確実に読み込む。
 * Playwright API（DevTools Protocol）は起動後に切り離し、ブラウザを安定動作させる。
 */

const { chromium } = require("playwright");
const path = require("path");
const { spawn } = require("child_process");
const net = require("net");

const EXTENSION_PATH = path.resolve(__dirname, "..");
const PROFILE_DIR = path.join(EXTENSION_PATH, ".tmp", "playwright-dev-profile");
const FIXTURES_DIR = path.join(EXTENSION_PATH, "tests", "fixtures");
const PORT = 4173;

/** ポートが使用中か確認する */
function isPortOpen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(true));
    server.once("listening", () => { server.close(); resolve(false); });
    server.listen(port);
  });
}

/** フィクスチャサーバーを起動する */
async function startFixtureServer() {
  const inUse = await isPortOpen(PORT);
  if (inUse) {
    console.log(`ポート ${PORT} は既に起動中です。既存サーバーを使用します。`);
    return null;
  }

  console.log(`ローカルフィクスチャサーバーをポート ${PORT} で起動中...`);
  const server = spawn("python3", [
    "-m", "http.server", String(PORT),
    "--directory", FIXTURES_DIR,
  ], { stdio: "inherit" });

  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 200));
    if (await isPortOpen(PORT)) break;
  }
  return server;
}

async function main() {
  const server = await startFixtureServer();

  // Playwright Chromium のバイナリパスを取得
  const executablePath = chromium.executablePath();
  console.log("Chromium を拡張付きで起動中...");
  console.log(`  バイナリ: ${executablePath}`);
  console.log(`  プロファイル: ${PROFILE_DIR}`);
  console.log(`  拡張: ${EXTENSION_PATH}`);
  console.log(`  URL: http://127.0.0.1:${PORT}/`);

  // Playwright API を経由せずバイナリを直接起動
  // → DevTools Protocol 接続なし = 安定動作
  const browser = spawn(executablePath, [
    `--user-data-dir=${PROFILE_DIR}`,
    `--disable-extensions-except=${EXTENSION_PATH}`,
    `--load-extension=${EXTENSION_PATH}`,
    "--no-first-run",
    `http://127.0.0.1:${PORT}/`,
  ], {
    detached: true,  // 親プロセスから独立させる
    stdio: "ignore",
  });
  browser.unref(); // Node.js が終了してもブラウザは継続

  console.log("起動しました。Ctrl+C でこのターミナルを終了するとサーバーも停止します。");

  if (server) {
    // Ctrl+C でサーバーも停止
    const cleanup = () => {
      console.log("\nサーバーを停止中...");
      server.kill();
      process.exit(0);
    };
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    // サーバーが終了するまで待機
    await new Promise((resolve) => server.on("close", resolve));
  }
}

main().catch((err) => {
  console.error("エラー:", err.message);
  process.exit(1);
});
