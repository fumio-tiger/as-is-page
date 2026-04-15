const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const coreScriptPath = path.resolve(__dirname, "..", "..", "print-layout-core.js");
const screenshotDir = path.resolve(__dirname, "..", "..", "artifacts", "print-screens");

async function capturePrintLayout(page, routePath, screenshotName) {
    await page.goto(routePath, { waitUntil: "networkidle" });
    await page.addScriptTag({ path: coreScriptPath });
    await page.evaluate(async () => {
        await window.screenToPdfDev.applyPrintLayout({
            settleDelayMs: 150,
            returnDelayMs: 100
        });
    });
    await page.emulateMedia({ media: "print" });

    fs.mkdirSync(screenshotDir, { recursive: true });
    const targetPath = path.join(screenshotDir, screenshotName);
    await page.screenshot({
        fullPage: true,
        path: targetPath
    });

    return targetPath;
}

test.describe("印刷レイアウトの確認", () => {
    test("長文ページを印刷用レイアウトで撮影できる", async ({ page }) => {
        const screenshotPath = await capturePrintLayout(page, "/article.html", "article-print.png");
        expect(fs.existsSync(screenshotPath)).toBeTruthy();
    });

    test("テーブルページを印刷用レイアウトで撮影できる", async ({ page }) => {
        const screenshotPath = await capturePrintLayout(page, "/table.html", "table-print.png");
        expect(fs.existsSync(screenshotPath)).toBeTruthy();
    });

    test("メディアページを印刷用レイアウトで撮影できる", async ({ page }) => {
        const screenshotPath = await capturePrintLayout(page, "/media.html", "media-print.png");
        expect(fs.existsSync(screenshotPath)).toBeTruthy();
    });
});
