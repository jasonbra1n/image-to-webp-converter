# Image to WebP Converter

A powerful, client-side tool that converts JPG/PNG images into multiple, responsive-ready WebP formats. Built with a focus on workflow efficiency and SEO best practices, this tool allows you to generate different sizes for `srcset` implementation from a single source image, all within your browser.

![Converter Screenshot](https://jasonbra1n.github.io/image-to-webp-converter/img/screenshot.webp)

## Live Demo

Try it out here: [https://jasonbra1n.github.io/image-to-webp-converter/](https://jasonbra1n.github.io/image-to-webp-converter/)

## Features

- **Responsive Size Generation**: Automatically generates multiple widths (e.g., 480px, 800px, 1200px) for perfect `srcset` implementation.
- **Adjustable Quality**: Fine-tune file size vs. visual fidelity with a real-time quality slider.
- **SEO & Performance Focused**: Includes educational resources on improving Core Web Vitals with responsive images.
- **Multi-Image Support**: Process one or many images via drag-and-drop or file selection.
- **Client-Side Processing**: All conversions happen in the browser, ensuring privacy and eliminating server dependency.
- **Grouped Output**: Generated images are neatly grouped by their original source file.
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

Included via CDN—no local installation needed.

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
1. **Configure Settings**: Select your target output widths and adjust the quality slider.
2. **Upload Images**: Drag JPG/PNG images into the drop zone or click to select files.
3. **Review Results**: Watch as multiple WebP versions are generated for each source image.
4. **Download**: Download individual files or click "Download All as ZIP" to get a complete archive.
5. **Clear**: Use the "Clear All" button to start fresh.

## Contributing
Contributions are welcome! Check out the CONTRIBUTING.md file for guidelines and the ROADMAP.md for planned features.

## License
This project is licensed under the MIT License—see the [LICENSE](https://github.com/jasonbra1n/image-to-webp-converter/blob/main/LICENSE) file for details.
