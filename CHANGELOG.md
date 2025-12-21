# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **ZIP Download**: Fixed an issue where the original image size was not being converted or included in the ZIP. Added an "Original Size" checkbox to the settings.
- **Duplicate Handling**: Added logic to prevent duplicate file generation if the original size matches one of the preset widths.

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