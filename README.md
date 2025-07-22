         
# Bricks2Code

## Overview

**Bricks2Code** is a lightweight web application designed to convert JSON structures from Bricks (a visual web design tool) into clean, production-ready HTML and CSS code. This tool bridges the gap between no-code design and custom development, enabling users to export designs as editable code with options for customization.

Built with modern web technologies, Bricks2Code provides an intuitive interface for inputting JSON data and generating corresponding markup and styles. It's ideal for developers, designers, and teams looking to streamline their workflow from prototyping to implementation.

## Key Features

- **JSON to HTML/CSS Conversion**: Transform Bricks JSON input into structured HTML and CSS output.
- **Force Element IDs**: Optional feature to enforce unique IDs on generated elements for easier scripting and styling.
- **Syntax-Highlighted Editors**: Powered by CodeMirror for a professional coding experience in both input and output panels.
- **One-Click Copy**: Quickly copy generated HTML or CSS to clipboard.
- **Responsive Design**: Split-pane layout for side-by-side viewing of input and output.
- **External Libraries**: Integrates CodeMirror, Split.js, Popper.js, and Tippy.js for enhanced functionality.

## Project Structure

- **`index.html`**: The main entry point containing the app's HTML structure.
- **`app.js`**: Core JavaScript logic for conversion, editor setup, and UI interactions.
- **`app.css`**: Custom styles for the application's user interface.
- **`fieldMap.json`**: JSON file mapping Bricks fields to HTML/CSS properties.
- **`bricksstylemaping.md`**: Documentation on style mappings and conversion rules.
- **`images/`**: Directory for assets like the favicon.

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, etc.)
- No server required; runs locally via `index.html`.

### Installation
1. Clone or download the repository.
2. Open `index.html` in your browser.

### Usage
1. Paste your Bricks JSON into the left editor panel.
2. (Optional) Check "Force Element IDs" for ID enforcement.
3. Click "Convert" to generate HTML and CSS in the right panels.
4. Use the "Copy" buttons to export the code.

## Development

- **Technologies Used**:
  - HTML5, CSS3, JavaScript (ES6+)
  - CodeMirror for code editing
  - Split.js for resizable panels
  - Tippy.js for tooltips

- **Customization**:
  Modify `fieldMap.json` to adjust mapping logic.
  Extend `app.js` for additional conversion features.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements. For major changes, open an issue first to discuss.


---

        