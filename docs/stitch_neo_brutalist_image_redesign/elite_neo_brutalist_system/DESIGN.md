---
name: Elite Neo-Brutalist System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9ccb5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e55b'
  primary: '#edffe8'
  on-primary: '#003911'
  primary-container: '#00ff66'
  on-primary-container: '#007128'
  inverse-primary: '#006e27'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#fff9f4'
  on-tertiary: '#412d00'
  tertiary-container: '#ffd892'
  on-tertiary-container: '#795d23'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff83'
  primary-fixed-dim: '#00e55b'
  on-primary-fixed: '#002107'
  on-primary-fixed-variant: '#00531b'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e7c17d'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5c4209'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1280px
---

## Brand & Style

This design system is built on the principles of **Refined Neo-Brutalism**. It rejects the soft, blurred aesthetics of modern SaaS in favor of structural integrity, raw honesty, and "elite" technical precision. The system communicates authority through high-contrast typography, mathematical spacing, and a total absence of decorative gradients or shadows.

The aesthetic is "raw but polished"—it utilizes the unapologetic grid structures and heavy strokes of Brutalism but executes them with the surgical precision of high-end Swiss design. It targets a sophisticated, technically-minded audience that values clarity and efficiency over visual comfort. The interface should feel like a premium command center: powerful, direct, and indisputably professional.

## Colors

The palette is strictly professional and high-contrast, optimized for deep dark mode environments.

- **Primary (Electric Green):** Used sparingly as a surgical strike. It denotes action, success, and system status.
- **Surface (Deep Black/Slate):** The foundation is `#0A0A0A`. Tonal shifts are subtle, moving to `#1A1A1A` for containers to maintain a monochromatic, "ink-trap" feel.
- **Contrast (High White):** Typography and critical icons utilize pure white or high-silver grey to ensure maximum legibility against the dark void.
- **Borders:** A fixed slate grey (`#262626`) is used for all structural divisions, ensuring the grid is always visible but never distracting.

## Typography

The typography strategy relies on the tension between aggressive sans-serifs and clinical monospaced fonts.

- **Headlines:** Use **Hanken Grotesk** at heavy weights (800+). Headlines should feel architectural and massive.
- **Body:** **Inter** provides a neutral, highly legible contrast for long-form data and descriptions.
- **Accents/Labels:** **JetBrains Mono** is used for all metadata, labels, and small UI triggers. This reinforces the "technical elite" personality of the design system.
- **Execution:** All uppercase is preferred for labels and display titles to enhance the brutalist structure.

## Layout & Spacing

The layout is governed by a **strict 12-column fixed grid** on desktop and a **4-column grid** on mobile. 

- **Grid Lines:** Unlike standard systems, the grid is often hinted at or explicitly drawn with 1px borders. 
- **Rhythm:** All spacing is a multiple of 4px. Use generous outer margins to create a "frame" effect, making the content feel like a curated exhibit.
- **Alignment:** Elements must align to the hard edges of the grid. Avoid centering content unless it is a primary landing "hero" moment; left-aligned, structured blocks are the default for the "elite" look.

## Elevation & Depth

This system avoids traditional depth. There are no shadows and no blurs.

- **Layering:** Depth is conveyed through **Z-index stacking** and **stark border outlines**. A modal does not "float" with a shadow; it sits on top of the surface with a thick 2px white or green border.
- **State Changes:** Elevation "lift" is represented by a color fill change (e.g., a button moving from an outline to a solid primary fill) or a hard-offset "block shadow" (a solid rectangle offset by 4px, rather than a soft shadow).
- **Glassmorphism:** Strictly forbidden. All surfaces must be 100% opaque to maintain a sense of weight and permanence.

## Shapes

The shape language is **uncompromisingly geometric**. 

- **Corners:** Everything is set to `0` (Sharp). Radii are functionally non-existent to emphasize the brutalist, "built" nature of the UI.
- **Strokes:** Use consistent 1px or 2px strokes. 1px for internal dividers and 2px for primary containers or active states.
- **Icons:** Use sharp-cornered, thin-stroke icons that match the weight of the typography and borders.

## Components

### Buttons
- **Primary:** Solid `#00FF66` fill with black `#0A0A0A` text. Sharp corners. No transition effects other than a hard color swap on hover.
- **Secondary:** 2px white border, transparent background, white text.
- **Tertiary/Ghost:** JetBrains Mono text with an underline that appears only on hover.

### Inputs & Fields
- **Style:** Underlined or fully boxed with a 1px slate grey border. 
- **Focus State:** Border changes to 2px Primary Green. Label shifts to the "label-mono" style above the field.

### Cards
- **Structure:** 1px border. No background color difference from the main surface unless nested. 
- **Header:** Often separated by a horizontal 1px line.

### Chips & Tags
- **Design:** Rectangular boxes with JetBrains Mono text. Use primary green text on a black background for "active" status.

### Lists
- **Style:** Data-heavy, separated by thin 1px lines. Use monospaced fonts for numerical data to ensure tabular alignment.