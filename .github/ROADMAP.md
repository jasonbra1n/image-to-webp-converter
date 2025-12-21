# Project Roadmap

This document outlines the future development goals for the Image to WebP Converter tool.

---

## Short-Term

- **[Completed] Fix ZIP Download**: Ensure all generated image sizes are included in the downloaded ZIP file.
- **[To Do] Custom Width Input**: Add an input field to allow users to specify a custom output width.
- **[To Do] Preserve Aspect Ratio Toggle**: Add a setting to either crop or letterbox images that don't match the target aspect ratio.
- **[To Do] More Input Formats**: Investigate adding support for converting GIFs and SVGs.

## Medium-Term

- **[Planned] Web Worker Integration**: Move the image conversion process to a Web Worker to prevent the UI from freezing when processing very large batches of images.
- **[Planned] Progress Indicator**: Add a progress bar that shows the overall status of a large batch conversion.

## Long-Term

- **[Vision] Minification**: Introduce a simple build step (e.g., using a task runner) to minify the CSS and JS for the deployed version.