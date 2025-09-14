// print-screen-pdf.js（O'Reilly学習サイト用の最適化付き・完全版）
(async () => {
    try {
        let style = document.querySelector('style[data-screen-pdf="true"]');
        if (!style) {
            style = document.createElement("style");
            style.setAttribute("data-screen-pdf", "true");

            let css = `
        @page { size: A4; margin: 20mm; }
        @media print {
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { margin:0 !important; padding:0 !important; width:100% !important; background:#fff !important; }

          /* 共通: 右余白の原因になりやすい最大幅とセンタリングを解除 */
          main, article, #app, #root, #content, .root, .content, .container, .container-lg, .container-xl, .prose {
            max-width:none !important; width:100% !important; margin:0 !important; padding-left:0 !important; padding-right:0 !important;
          }

          /* 共通: grid / flex をやめて 1 カラム化（右の空白を潰す） */
          .grid, [class*="grid"], [class*="Grid"], [class*="columns"], [class*="layout"], [class*="Layout"],
          .flex, [class*="flex"], [class*="Flex"] { display:block !important; }
          .grid > *, [class*="grid"] > *, [class*="columns"] > *, [class*="layout"] > *, .flex > * {
            width:100% !important; max-width:none !important;
          }

          /* 共通: サイドバーや補助カラムは非表示 */
          aside, [role="complementary"], .sidebar, .ads, .ad, .no-print { display:none !important; }

          /* 共通: 固定/スティッキー解除（重なり/余白の原因防止） */
          [style*="position:fixed"], [style*="position: sticky"], .fixed, .sticky { position: static !important; }

          /* 共通: スクロールのクリッピング回避 */
          * { overflow: visible !important; max-height: none !important; }

          /* 共通: 画像・表は紙幅内に収める */
          table, img, svg, canvas, video { max-width:100% !important; height:auto !important; }

          /* 共通: CodeBlock はみ出し防止＋折り返し */
          pre, code, pre code {
            white-space: pre-wrap !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            max-width: 100% !important;
          }
          pre { overflow-x: visible !important; }

          /* 改ページ割れ対策（必要に応じ調整） */
          h2, h3, .card, .section, table, blockquote, pre { break-inside: avoid; page-break-inside: avoid; }
        }
      `;

            /* --- O'Reilly UCV 専用の上書き（右余白の主因を潰す） --- */
            if (location.hostname.includes("oreilly") || location.hostname.includes("learning.oreilly.com")) {
                css += `
          @media print {
            /* UCV は中央固定幅の外枠が多段で入るため、徹底的に全幅化 */
            [class*="Universal"], [class*="Content"], [class*="Viewer"], [class*="Container"],
            .UniversalContentViewer, .Universal-Content-Viewer, .ucv, .ucv-container, .Article, .ArticleBody,
            .Page, .PageContainer, .Layout, .LayoutContainer {
              max-width:none !important; width:100% !important; margin:0 !important; padding:0 !important;
              display:block !important;
            }

            /* レイアウト用 grid を無効化 */
            [class*="grid"], [class*="Grid"], [class*="layout"], [class*="Layout"] {
              display:block !important;
              grid-template-columns:none !important;
            }

            /* 右カラム/TOC/余白カラムは消す */
            nav[aria-label="Table of contents"], [data-testid="toc"], [class*="Toc"], [class*="Right"], [class*="Sidebar"] {
              display:none !important;
            }

            /* 余計な左右パディングを念のため 0 に */
            .reader, .reader-container, .ucv, .ucv-container, .content, .article, .chapter {
              padding-left:0 !important; padding-right:0 !important;
            }
          }
        `;
            }

            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }

        // LazyLoad 対策：一度最下部まで描画させる
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 400));
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 200));

        window.print();

        // （任意）少し待ってCSSを掃除
        setTimeout(() => {
            const s = document.querySelector('style[data-screen-pdf="true"]');
            if (s) s.remove();
        }, 2000);
    } catch (e) {
        console.error("[screen-to-pdf] print failed:", e);
        alert("印刷中にエラーが発生しました。コンソールを確認してください。");
    }
})();