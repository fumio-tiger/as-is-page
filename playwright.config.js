const { defineConfig } = require("@playwright/test");
const path = require("path");

module.exports = defineConfig({
    testDir: path.join(__dirname, "tests", "e2e"),
    timeout: 60000,
    fullyParallel: true,
    reporter: [
        ["list"],
        ["html", { outputFolder: "artifacts/playwright-report", open: "never" }]
    ],
    use: {
        baseURL: "http://127.0.0.1:4173",
        trace: "on-first-retry",
        video: "retain-on-failure"
    },
    outputDir: "artifacts/test-results",
    webServer: {
        command: "python3 -m http.server 4173 --directory tests/fixtures",
        port: 4173,
        reuseExistingServer: !process.env.CI,
        timeout: 30000
    }
});
