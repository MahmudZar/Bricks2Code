# Documentation: Bricks GUI to CSS Style Mapping

This document serves as the primary technical reference for the `Bricks2Code` conversion engine. It outlines precisely how the Bricks Builder JSON settings for styling are mapped to standard CSS properties. The core of this logic resides in the `STYLE_MAPPERS` object within `app.js`.

## 1. Core Concepts & Helper Functions

Before diving into individual properties, it's crucial to understand the helper functions that process the raw JSON values.

-   **`withPx(value)`**: This function takes a value. If the value is a number (or a string that can be parsed as a finite number), it appends `px`. It correctly handles non-numeric values (like `auto`, `50%`, `var(--my-var)`) by returning them as-is.
-   **`handleColor(colorObject)`**: Bricks stores colors in an object (e.g., `{ "hex": "#ff0000" }` or `{ "raw": "rgba(255,0,0,0.5)" }`). This function extracts the usable CSS color string from that object.
-   **`handleShorthand(valueObject, propertyPrefix)`**: This function is used for properties like `margin` and `padding`. It takes an object like `{ "top": 10, "right": 20 }` and a prefix like `"margin"` and generates individual CSS rules: `margin-top: 10px;` and `margin-right: 20px;`.

## 2. Style Property Mappings

The following sections detail every mapped JSON key from the Bricks settings.

---

### Layout

These properties control the positioning and display behavior of an element.

| Bricks JSON Key   | CSS Property         | Description                                                                 |
| ----------------- | -------------------- | --------------------------------------------------------------------------- |
| `_display`        | `display`            | Direct mapping. E.g., `"flex"` becomes `display: flex;`.                    |
| `_position`       | `position`           | Direct mapping. E.g., `"absolute"` becomes `position: absolute;`.           |
| `_zIndex`         | `z-index`            | Direct mapping. E.g., `5` becomes `z-index: 5;`.                            |
| `_top`            | `top`                | Value is processed with `withPx`. E.g., `20` becomes `top: 20px;`.          |
| `_right`          | `right`              | Value is processed with `withPx`.                                           |
| `_bottom`         | `bottom`             | Value is processed with `withPx`.                                           |
| `_left`           | `left`               | Value is processed with `withPx`.                                           |
| `_overflow`       | `overflow`           | Direct mapping. E.g., `"hidden"` becomes `overflow: hidden;`.               |
| `_visibility`     | `visibility`         | Direct mapping. E.g., `"hidden"` becomes `visibility: hidden;`.             |
| `_opacity`        | `opacity`            | Direct mapping. E.g., `0.8` becomes `opacity: 0.8;`.                        |
| `_cursor`         | `cursor`             | Direct mapping. E.g., `"pointer"` becomes `cursor: pointer;`.               |
| `_mixBlendMode`   | `mix-blend-mode`     | Direct mapping. E.g., `"multiply"` becomes `mix-blend-mode: multiply;`.     |
| `_pointerEvents`  | `pointer-events`     | Direct mapping. E.g., `"none"` becomes `pointer-events: none;`.             |
| `_isolation`      | `isolation`          | Direct mapping. E.g., `"isolate"` becomes `isolation: isolate;`.            |

---

### Sizing & Spacing

These properties control the dimensions and spacing around an element.

| Bricks JSON Key | CSS Property        | Description                                                                                                    |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `_margin`       | `margin-*`          | Uses `handleShorthand`. An object with `top`, `right`, `bottom`, `left` keys generates individual `margin-*` rules. |
| `_padding`      | `padding-*`         | Uses `handleShorthand`. An object with `top`, `right`, `bottom`, `left` keys generates individual `padding-*` rules. |
| `_width`        | `width`             | Value is processed with `withPx`.                                                                              |
| `_widthMin`     | `min-width`         | Value is processed with `withPx`.                                                                              |
| `_widthMax`     | `max-width`         | Value is processed with `withPx`.                                                                              |
| `_height`       | `height`            | Value is processed with `withPx`.                                                                              |
| `_heightMin`    | `min-height`        | Value is processed with `withPx`.                                                                              |
| `_heightMax`    | `max-height`        | Value is processed with `withPx`.                                                                              |
| `_aspectRatio`  | `aspect-ratio`      | Direct mapping. The format `"16:9"` is converted to `aspect-ratio: 16 / 9;`.                                     |

**Example (`_padding`):**
```json
"settings": {
  "_padding": { "top": "20", "bottom": "20", "left": "40", "right": "40" }
}
```
**Resulting CSS:**
```css
padding-top: 20px;
padding-bottom: 20px;
padding-left: 40px;
padding-right: 40px;
```

---

### Flexbox & Grid Item (Child)

These properties apply to elements that are direct children of a Flexbox or Grid container.

| Bricks JSON Key       | CSS Property           | Description                                                                       |
| --------------------- | ---------------------- | --------------------------------------------------------------------------------- |
| `_order`              | `order`                | Direct mapping. Controls the order of a flex/grid item.                           |
| `_flexGrow`           | `flex-grow`            | Direct mapping.                                                                   |
| `_flexShrink`         | `flex-shrink`          | Direct mapping.                                                                   |
| `_flexBasis`          | `flex-basis`           | Value is processed with `withPx`.                                                 |
| `_alignSelf`          | `align-self`           | Direct mapping.                                                                   |
| `_gridItemColumnSpan` | `grid-column`          | A value of `"3"` becomes `grid-column: span 3;`.                                  |
| `_gridItemRowSpan`    | `grid-row`             | A value of `"2"` becomes `grid-row: span 2;`.                                     |

---

### Flexbox Container

These properties apply when `_display` is set to `flex`.

| Bricks JSON Key | CSS Property        | Description                                                                                                    |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `_direction` or `_flexDirection`| `flex-direction`| Direct mapping. E.g., `"column"` becomes `flex-direction: column;`.                                        |
| `_flexWrap`     | `flex-wrap`         | Direct mapping. E.g., `"wrap"` becomes `flex-wrap: wrap;`.                                                     |
| `_justifyContent`| `justify-content` | Direct mapping. E.g., `"center"` becomes `justify-content: center;`.                                           |
| `_alignItems`   | `align-items`       | Direct mapping. E.g., `"center"` becomes `align-items: center;`.                                               |
| `_columnGap`    | `column-gap`        | Value is processed with `withPx`.                                                                              |
| `_rowGap`       | `row-gap`           | Value is processed with `withPx`.                                                                              |

---

### Grid Container

These properties apply when `_display` is set to `grid`.

| Bricks JSON Key         | CSS Property            | Description                                                                                                |
| ----------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `_gridGap`              | `gap`                   | Value is processed with `withPx`. E.g., `20` becomes `gap: 20px;`.                                         |
| `_gridTemplateColumns`  | `grid-template-columns` | Direct string mapping. E.g., `"1fr 1fr"` becomes `grid-template-columns: 1fr 1fr;`.                         |
| `_gridTemplateRows`     | `grid-template-rows`    | Direct string mapping.                                                                                     |
| `_gridAutoColumns`      | `grid-auto-columns`     | Direct string mapping.                                                                                     |
| `_gridAutoRows`         | `grid-auto-rows`        | Direct string mapping.                                                                                     |
| `_gridAutoFlow`         | `grid-auto-flow`        | Direct string mapping. E.g., `"column"` becomes `grid-auto-flow: column;`.                                 |
| `_justifyItemsGrid`     | `justify-items`         | Direct mapping. **Note:** Bricks uses a unique key to avoid conflict with Flexbox's `_justifyItems`.          |
| `_alignItemsGrid`       | `align-items`           | Direct mapping.                                                                                            |
| `_justifyContentGrid`   | `justify-content`       | Direct mapping.                                                                                            |
| `_alignContentGrid`     | `align-content`         | Direct mapping.                                                                                            |

---

### Background

The `_background` key holds an object containing multiple background properties.

**JSON Example:**
```json
"settings": {
  "_background": {
    "color": { "hex": "#2d2b29" },
    "image": { "url": "https://example.com/bg.jpg" },
    "position": "center center",
    "repeat": "no-repeat",
    "size": "cover"
  }
}
```
**Resulting CSS:**
```css
background-color: #2d2b29;
background-image: url('https://example.com/bg.jpg');
background-position: center center;
background-repeat: no-repeat;
background-size: cover;
```

---

### Border & Box Shadow

The `_border` and `_boxShadow` keys handle all border and shadow settings.

| Bricks JSON Key | CSS Property        | Description                                                                                                                                                             |
| --------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_border`       | `border-*`          | An object with `style`, `color`, `width` (object), and `radius` (object). `width` and `radius` are processed with `handleShorthand`.                                        |
| `_boxShadow`    | `box-shadow`        | An **array** of shadow objects. Each object (`{x, y, blur, spread, color, inset}`) is compiled into a valid shadow layer. The layers are joined with commas.             |

---

### Typography

The `_typography` key holds an object with all text-related styles. Note that the JSON keys are already CSS-like.

| JSON Key in `_typography` | CSS Property       | Description                                                                                 |
| ------------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| `font-family`             | `font-family`      | An object with `name` and `fallback`.                                                       |
| `font-size`               | `font-size`        | Value is processed with `withPx`.                                                           |
| `font-weight`             | `font-weight`      | Direct mapping.                                                                             |
| `font-style`              | `font-style`       | Direct mapping.                                                                             |
| `line-height`             | `line-height`      | Direct mapping.                                                                             |
| `letter-spacing`          | `letter-spacing`   | Value is processed with `withPx`.                                                           |
| `text-align`              | `text-align`       | Direct mapping.                                                                             |
| `text-transform`          | `text-transform`   | Direct mapping.                                                                             |
| `text-decoration`         | `text-decoration`  | Direct mapping.                                                                             |
| `white-space`             | `white-space`      | Direct mapping.                                                                             |
| `text-wrap`               | `text-wrap`        | Direct mapping.                                                                             |
| `color`                   | `color`            | Value is an object processed with `handleColor`.                                            |

---

### Transform & Transition

| Bricks JSON Key  | CSS Property         | Description                                                                                                                                                                    |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `_transform`     | `transform`          | An object with keys like `translateX`, `rotateZ`, `scaleX`. The engine builds a single `transform` string, applying `px` and `deg` units where appropriate.                         |
| `_transformOrigin`| `transform-origin`   | Direct string mapping. E.g., `"center top"` becomes `transform-origin: center top;`.                                                                                           |
| `_cssTransition` | `transition`         | Direct string mapping. E.g., `"all 0.3s ease"` becomes `transition: all 0.3s ease;`.                                                                                           |

---

### Image-Specific Styles

These properties apply to the Bricks **Image** element.

| Bricks JSON Key   | CSS Property        | Target Element         | Description                                                                                                                                |
| ----------------- | ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `_objectFit`      | `object-fit`        | `<img>` or `selector > img` | Direct mapping. E.g., `"cover"` becomes `object-fit: cover;`.                                                                              |
| `_objectPosition` | `object-position`   | `<img>` or `selector > img` | Direct mapping. E.g., `"top center"` becomes `object-position: top center;`.                                                               |
| `stretch`         | `width`             | Wrapper `<div>`/`<figure>` | A boolean. If `true`, it generates `width: 100%;` on the image's wrapper element.                                                            |

---

### SVG-Specific Styles

These properties apply to the Bricks **SVG** element and have a unique CSS output format.

| Bricks JSON Key | CSS Output                                           | Description                                                                                                                                 |
| --------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `width`         | `width: <value>;`                                    | A non-underscored key that applies directly to the SVG element's wrapper (`#brxe-id`).                                                      |
| `height`        | `height: <value>;`                                   | A non-underscored key that applies directly to the SVG element's wrapper (`#brxe-id`).                                                      |
| `fill`          | `selector :not([fill="none"]) { fill: <color> !important; }` | Creates a separate, highly specific rule to override the fill color of paths inside the SVG, ignoring paths that have no fill.        |
| `stroke`        | `selector :not([stroke="none"]) { stroke: <color> !important; }` | Creates a separate, highly specific rule to override the stroke color of paths inside the SVG, ignoring paths that have no stroke. |
| `strokeWidth`   | `selector * { stroke-width: <value> !important; }`    | Creates a separate rule to apply a stroke width to all child elements (`*`) of the SVG.                                                     |

**Example (SVG):**
```json
"settings": {
  "width": "24",
  "height": "24",
  "fill": { "hex": "#ff0000" },
  "stroke": { "hex": "#0000ff" },
  "strokeWidth": "2"
}
```
**Resulting CSS (assuming element ID is `brxe-abcd`):**
```css
#brxe-abcd {
  width: 24px;
  height: 24px;
}

#brxe-abcd :not([fill="none"]) {
  fill: #ff0000 !important;
}

#brxe-abcd :not([stroke="none"]) {
  stroke: #0000ff !important;
}

#brxe-abcd * {
  stroke-width: 2 !important;
}
```