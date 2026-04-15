chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["print-layout-core.js", "print-screen-pdf.js"]
    });
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command !== "export-pdf") return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["print-layout-core.js", "print-screen-pdf.js"]
    });
});
