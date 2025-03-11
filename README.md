# Image to WebP Converter

A lightweight, client-side tool built with HTML, CSS, and JavaScript that instantly converts JPG/PNG images to WebP format. Featuring a sleek, responsive design, this converter processes images in-browser—no server uploads required—offering privacy, speed, and flexibility.

![Converter Screenshot](https://jasonbra1n.github.io/image-to-webp-converter/img/screenshot.webp)

## Live Demo

Try it out here: [https://jasonbra1n.github.io/image-to-webp-converter/](https://jasonbra1n.github.io/image-to-webp-converter/)

## Features

- **Automatic Conversion**: Images are converted to WebP as soon as they’re uploaded—no extra clicks needed.
- **Multi-Image Support**: Process one or many images via drag-and-drop or file selection.
- **Client-Side Processing**: All conversions happen in the browser, ensuring privacy and eliminating server dependency.
- **Size Comparison**: Displays original and WebP file sizes with percentage change for each image.
- **Flexible Downloads**: Download individual WebP files or all images as a ZIP archive.
- **Responsive Design**: Adapts seamlessly to any screen size, from mobile to desktop.
- **Quality Control**: Uses a default quality setting of 0.8 (adjustable in code) for WebP output.

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
1. Drag JPG/PNG images into the drop zone or click to select files.
2. Watch as WebP images are generated instantly, with size comparisons displayed.
3. Download individual files using card buttons or all images as a ZIP with the "Download All" button.
4. Clear everything with the "Clear All" button to start fresh.

## Contributing
Contributions are welcome! Submit issues or pull requests with ideas like:
- Support for additional image formats (e.g., GIF, BMP).
- Progress indicators for large batches.
- Custom quality sliders or settings UI.

## License
This project is licensed under the MIT License—see the [LICENSE](https://github.com/jasonbra1n/image-to-webp-converter/blob/main/LICENSE) file for details.
