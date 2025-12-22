[![License: MIT](https://img.shields.io/github/license/jasonbra1n/image-to-webp-converter?style=for-the-badge&color=8146ff)](LICENSE)
[![Developed with Gemini](https://img.shields.io/badge/Developed%20with-Gemini-8146FF?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
![HTML5](https://img.shields.io/badge/HTML5-8146FF?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-8146FF?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-8146FF?style=for-the-badge&logo=javascript&logoColor=white)

# Image to WebP Converter

A powerful, client-side tool that converts JPG/PNG images into multiple, responsive-ready WebP formats. Built with a focus on workflow efficiency and SEO best practices, this tool allows you to generate different sizes for `srcset` implementation from a single source image, all within your browser.

![Converter Screenshot](https://jasonbra1n.github.io/image-to-webp-converter/img/screenshot.webp)

## Live Demo

Try it out here: [https://jasonbra1n.github.io/image-to-webp-converter/](https://jasonbra1n.github.io/image-to-webp-converter/)

## Features

- **Responsive Size Generation**: Automatically generates multiple widths (e.g., 480px, 800px, 1200px) for perfect `srcset` implementation.
- **Adjustable Quality**: Fine-tune file size vs. visual fidelity with a real-time quality slider.
- **Force Aspect Ratio**: Crop or fit images to specific aspect ratios (Square, 16:9, etc.) with Cover, Contain, and Fill modes.
- **Custom Width Input**: Specify your own comma-separated list of widths for conversion.
- **SEO & Performance Focused**: Includes educational resources on improving Core Web Vitals with responsive images.
- **Multi-Image Support**: Process one or many images via drag-and-drop or file selection.
- **Offline Capable**: Works entirely offline with local dependencies, perfect for secure or low-connectivity environments.
- **Clean Interface**: Settings are tucked away in a modal overlay to keep the workspace clutter-free.
- **Client-Side Processing**: All conversions happen in the browser, ensuring privacy and eliminating server dependency.
- **Grouped Output**: Generated images are neatly grouped by their original source file.
- **Export Options**: Export file lists in JSON, XML, Markdown, or HTML formats, and get a `manifest.json` automatically in your ZIP download.
- **Flexible Downloads**: Download individual files or a complete ZIP archive.

## Installation

To run this converter locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/jasonbra1n/image-to-webp-converter.git
   ```

2. Open \`index.html\` in a web browser. No build steps or server required—just pure HTML, CSS, and JavaScript!

## Dependencies

- [JSZip](https://stuk.github.io/jszip/) (v3.10.1): For ZIP file creation.
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) (v2.0.5): For triggering ZIP downloads.

Included in the `lib/` directory for offline support.

## Embedding in Your Website

Embed this converter in your webpage with an iframe:

```html
<iframe src="https://jasonbra1n.github.io/image-to-webp-converter/" width="500" height="600" frameborder="0" style="border: none;"></iframe>
```

### Embedding Notes
- **Size**: Recommended dimensions are 500px wide by 600px tall, based on the converter’s content.
- **Responsiveness**: The design adjusts automatically to narrower containers.
- **Customization**: Fork the repo to tweak styles, quality settings, or add features.

## Usage
1. **Configure Settings**: Click the **Gear Icon** to open the settings overlay. Select your target output widths, aspect ratios, and adjust the quality slider.
2. **Upload Images**: Drag JPG/PNG images into the drop zone or click to select files.
3. **Review Results**: Watch as multiple WebP versions are generated for each source image.
4. **Download**: Download individual files or click "Download All as ZIP" to get a complete archive.
5. **Clear**: Use the "Clear All" button to start fresh.

## Contributing
Contributions are welcome! Check out the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for guidelines and the [ROADMAP.md](.github/ROADMAP.md) for planned features.

## License
This project is licensed under the MIT License—see the [LICENSE](https://github.com/jasonbra1n/image-to-webp-converter/blob/main/LICENSE) file for details.
