# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2025-12-22

### Added
- **UI**: Added a site-wide footer with copyright and a link to the GitHub repository.
- **UX**: Moved the settings panel into a modal overlay (gear icon) to declutter the main interface.
- **Custom Widths**: Added an input field to allow users to specify custom, comma-separated output widths.
- **Force Aspect Ratio**: Added settings to force output images into specific aspect ratios (e.g., 1:1, 16:9) with options for Cover, Contain, or Fill fit modes.
- **Export File List**: Added a feature to export the list of generated files as JSON, XML, Markdown, or HTML.
- **ZIP Manifest**: The downloaded ZIP file now automatically includes a `manifest.json` file listing all generated images and their metadata.
- **Docs**: Added tech stack badges to the README.

## [2.1.0] - 2025-12-21

### Added
- **Developer Workflow**: Created `.gemini/PROMPTS_GUIDE.md` to provide standardized prompts for AI-assisted development.

### Changed
- **Dependencies**: Moved JSZip and FileSaver.js from CDN to a local `lib/` folder to enable offline functionality.

### Fixed
- **ZIP Download**: Fixed an issue where the original image size was not being converted or included in the ZIP. Added an "Original Size" checkbox.
- **Duplicate Handling**: Added logic to prevent duplicate file generation if the original size matches one of the preset widths.
- **Original Size Processing**: Ensured the "Original Size" option correctly generates a download card and is included in the final ZIP file.
- **Upscaling**: The converter will no longer upscale images that are smaller than a selected preset width.
- **UI Clarity**: Added an "(Original)" label to the output card that matches the source image's dimensions to reduce confusion.
- **Documentation**: Corrected inconsistencies and broken links across all documentation files (`README.md`, `CONTRIBUTING.md`).


## [2.0.0] - 2025-12-21

### Added
- **Responsive Size Generation**: Added a settings panel to select multiple output widths (480px, 800px, 1200px) to align with the `jasonbrain.com` image optimization plan.
- **Quality Control**: Added a slider to control the WebP output quality (from 10% to 100%).

### Changed
- **UI Overhaul**: The UI now groups generated images under a card for the original source image, improving organization for batch processing.
- **Rebranding**: The entire UI has been restyled to match the color palette and branding of the `jasonbrain.com` style guide.
- **Core Logic**: Refactored the conversion logic into a `resizeAndConvert` function to handle multiple outputs from a single source.

## [1.0.0]

### Added
- Initial release with single-file conversion, drag-and-drop, and ZIP download functionality.