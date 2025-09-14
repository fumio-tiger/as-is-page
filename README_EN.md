# Screen to PDF (A4) - Chrome Extension

A Chrome extension that prints web pages as PDF in A4 size while maintaining the screen appearance. Optimized specifically for O'Reilly learning sites.

## Features

- 🖨️ **Print as you see**: Convert browser display to A4 PDF exactly as shown
- 📄 **A4 size optimized**: Optimized for A4 size with 20mm margins
- 🎯 **O'Reilly learning site optimized**: Special processing to prevent layout issues
- ⌨️ **Keyboard shortcut support**: Easy execution with `Ctrl+Shift+Y` (Mac: `Command+Shift+Y`)
- 🔧 **Automatic layout adjustment**: Automatically adjusts elements that cause right margins

## Installation

### 1. Download Files
Clone this repository or download the ZIP file.

### 2. Load as Chrome Extension
1. Open Chrome browser
2. Type `chrome://extensions/` in the address bar
3. Enable "Developer mode" in the top right
4. Click "Load unpacked extension"
5. Select this project folder

### 3. Usage
- **Method 1**: Click the extension icon
- **Method 2**: Press shortcut key `Ctrl+Shift+Y` (Mac: `Command+Shift+Y`)

## Supported Sites

### General Support
- General websites
- Blog articles
- Technical documentation sites

### Specially Optimized
- **O'Reilly Learning Sites** (`oreilly.com`, `learning.oreilly.com`)
  - Resolves Universal Content Viewer (UCV) layout issues
  - Automatically hides table of contents and sidebars
  - Completely removes right margins

## Technical Specifications

### File Structure
```
as-is-page/
├── manifest.json          # Extension configuration file
├── background.js          # Background script
├── print-screen-pdf.js    # Main printing process script
├── README.md             # This file (Japanese)
├── README_EN.md          # English version
└── LICENSE               # MIT License
```

### Key Features
- **Layout optimization**: Converts Grid/Flex layouts to single column
- **Element hiding**: Hides unnecessary elements like sidebars, ads, and table of contents
- **LazyLoad handling**: Ensures complete display of lazy-loaded content
- **Error handling**: Appropriate error messages when printing fails

## Troubleshooting

### When printing doesn't work properly
1. Ensure the page has finished loading
2. Check error messages in browser console (F12)
3. Try reloading the page and retry

### When layout is broken
- Some special sites may have layout issues due to CSS conflicts
- In such cases, please use the browser's standard print function

## License

This project is released under the MIT License.

### Important Notes

- **No Warranty**: This software is provided "as is" without any express or implied warranties
- **User Responsibility**: Please use the software at **your own risk**
- **Author Disclaimer**: For the above reasons, the author assumes no responsibility for the use of the software
- **Free Use**: Use is free under the conditions of no warranty and disclaimer

For details, please check the LICENSE file in the project root.

## Version Information

- **Current Version**: 0.1.0
- **Supported Browser**: Chrome (Manifest V3 compatible)

## Contributing

Please report bugs and feature improvement suggestions to GitHub Issues.

---

**Note**: This extension is created for educational purposes. Please check the terms of use of each site regarding printing of copyrighted content.
