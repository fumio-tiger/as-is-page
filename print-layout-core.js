(function bootstrapScreenToPdfDev(global) {
    const STYLE_SELECTOR = 'style[data-screen-pdf="true"]';

    function buildPrintCss(hostname = global.location?.hostname || "") {
        let css = `
@page { size: A4; margin: 20mm; }
@media print {
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin:0 !important; padding:0 !important; width:100% !important; background:#fff !important; }

  main, article, #app, #root, #content, .root, .content, .container, .container-lg, .container-xl, .prose {
    max-width:none !important; width:100% !important; margin:0 !important; padding-left:0 !important; padding-right:0 !important;
  }

  .grid, [class*="grid"], [class*="Grid"], [class*="columns"], [class*="layout"], [class*="Layout"],
  .flex, [class*="flex"], [class*="Flex"] { display:block !important; }
  .grid > *, [class*="grid"] > *, [class*="columns"] > *, [class*="layout"] > *, .flex > * {
    width:100% !important; max-width:none !important;
  }

  aside, [role="complementary"], .sidebar, .ads, .ad, .no-print { display:none !important; }
  [style*="position:fixed"], [style*="position: sticky"], .fixed, .sticky { position: static !important; }
  * { overflow: visible !important; max-height: none !important; }
  table, img, svg, canvas, video { max-width:100% !important; height:auto !important; }

  pre, code, pre code {
    white-space: pre-wrap !important;
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
    max-width: 100% !important;
  }
  pre { overflow-x: visible !important; }
  h2, h3, .card, .section, table, blockquote, pre { break-inside: avoid; page-break-inside: avoid; }
}
`;

        if (hostname.includes("oreilly") || hostname.includes("learning.oreilly.com")) {
            css += `
@media print {
  [class*="Universal"], [class*="Content"], [class*="Viewer"], [class*="Container"],
  .UniversalContentViewer, .Universal-Content-Viewer, .ucv, .ucv-container, .Article, .ArticleBody,
  .Page, .PageContainer, .Layout, .LayoutContainer {
    max-width:none !important; width:100% !important; margin:0 !important; padding:0 !important;
    display:block !important;
  }

  [class*="grid"], [class*="Grid"], [class*="layout"], [class*="Layout"] {
    display:block !important;
    grid-template-columns:none !important;
  }

  nav[aria-label="Table of contents"], [data-testid="toc"], [class*="Toc"], [class*="Right"], [class*="Sidebar"] {
    display:none !important;
  }

  nav[aria-label="Content navigation"], [data-testid="statusBar"] {
    display:none !important;
  }

  .reader, .reader-container, .ucv, .ucv-container, .content, .article, .chapter {
    padding-left:0 !important; padding-right:0 !important;
  }
}
`;
        }

        return css;
    }

    function ensurePrintStyle() {
        let style = global.document.querySelector(STYLE_SELECTOR);
        if (!style) {
            style = global.document.createElement("style");
            style.setAttribute("data-screen-pdf", "true");
            style.textContent = buildPrintCss();
            (global.document.head || global.document.documentElement).appendChild(style);
        }
        return style;
    }

    async function stabilizeLazyContent({ settleDelayMs = 400, returnDelayMs = 200 } = {}) {
        global.scrollTo(0, global.document.body.scrollHeight);
        await new Promise((resolve) => global.setTimeout(resolve, settleDelayMs));
        global.scrollTo(0, 0);
        await new Promise((resolve) => global.setTimeout(resolve, returnDelayMs));
    }

    async function applyPrintLayout(options = {}) {
        ensurePrintStyle();
        await stabilizeLazyContent(options);
    }

    function cleanupPrintStyle() {
        const style = global.document.querySelector(STYLE_SELECTOR);
        if (style) {
            style.remove();
        }
    }

    async function runPrintLayoutPrint(options = {}) {
        const cleanupDelayMs = options.cleanupDelayMs ?? 2000;
        await applyPrintLayout(options);
        global.print();

        if (cleanupDelayMs !== null) {
            global.setTimeout(() => {
                cleanupPrintStyle();
            }, cleanupDelayMs);
        }
    }

    global.screenToPdfDev = {
        applyPrintLayout,
        buildPrintCss,
        cleanupPrintStyle,
        ensurePrintStyle,
        runPrintLayoutPrint,
        stabilizeLazyContent
    };
})(window);
