# Contributing Guide

Thank you for your interest in improving the Image to WebP Converter!

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Dependencies**: JSZip (local in `lib/` folder)

## Development Workflow

This is a simple, client-side-only project. No build step is required.

1.  **Clone the repository**.
2.  **Create a new branch**: `git checkout -b feature/your-new-feature`.
3.  **Make your changes** directly to `index.html`, `styles.css`, or `script.js`.
4.  **Test your changes** by opening `index.html` in your web browser.
5.  **Submit a Pull Request** with a clear description of the changes.

## Coding Standards

- **JavaScript**:
  - Keep all logic within `script.js`.
  - Use descriptive variable and function names (e.g., `handleFiles`, `createImageGroupCard`).
  - Comment any complex or non-obvious logic.

- **CSS**:
  - Keep all styles within `styles.css`.
  - Use the existing CSS variables for colors to maintain brand consistency.
  - Refer to the STYLE_GUIDE.md for detailed color and component guidelines.

## Commit Messages

Please follow the Conventional Commits specification.
- `feat:` (a new feature)
- `fix:` (a bug fix)
- `docs:` (changes to documentation)
- `style:` (code formatting, white-space, etc.)
- `refactor:` (code changes that neither fix a bug nor add a feature)