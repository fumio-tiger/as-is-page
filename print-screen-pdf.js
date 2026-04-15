(async () => {
    try {
        if (!window.screenToPdfDev?.runPrintLayoutPrint) {
            throw new Error("印刷レイアウトの共通処理が読み込まれていません。");
        }
        await window.screenToPdfDev.runPrintLayoutPrint();
    } catch (e) {
        console.error("[screen-to-pdf] print failed:", e);
        alert("印刷中にエラーが発生しました。コンソールを確認してください。");
    }
})();
