---
name: Prose and Paper
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#4ee255'
  on-secondary: '#003907'
  secondary-container: '#00b42c'
  on-secondary-container: '#003c08'
  tertiary: '#ffb3ae'
  on-tertiary: '#68000c'
  tertiary-container: '#000000'
  on-tertiary-container: '#d43e3f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#72ff72'
  secondary-fixed-dim: '#4ee255'
  on-secondary-fixed: '#002203'
  on-secondary-fixed-variant: '#00530f'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#910517'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  timer-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.05em
  notation-sm:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 2px
  board-margin: 0px
---

## Brand & Style

The design system is rooted in a refined, high-contrast aesthetic that blends the precision of chess with the clarity of technical documentation. It prioritizes the clinical precision of chess over decorative aesthetics, moving from a rigid, industrial feel to one that is approachable yet strictly structured.

The emotional response is one of serious intent, high focus, and absolute clarity. While maintaining the structural rigidity and high-contrast boundaries of its predecessor, this version introduces soft roundedness to the UI, reducing visual fatigue. The interface serves as a transparent, high-legibility medium for the game state, favoring clear hierarchies over depth cues.

## Colors

This design system utilizes a stark, high-contrast palette centered on a clean white foundation. The primary goal is maximum legibility and focus.

- **Primary:** Absolute Black (`#000000`) is the dominant color for typography, primary UI actions, and active board elements.
- **Secondary (Success/Turn):** A balanced, medium-saturation Green (`#3cd348`) indicates valid moves and turn states, providing a clear but not jarring signal.
- **Tertiary (Alert/Danger):** A soft but clear Red (`#e24848`) marks check, illegal moves, or low time warnings.
- **Neutral/Background:** Pure White (`#ffffff`) serves as the canvas, ensuring a "paper-like" clarity that minimizes visual noise.
- **Board Colors:** The squares use subtle, desaturated tones to ensure the black and white pieces remain the most prominent visual elements.

## Typography

The typographic system splits responsibilities between two families. **Inter** handles all functional UI elements, navigation, and settings, providing a neutral and highly legible foundation. 

**Space Grotesk** is used for all data-driven outputs, specifically timers and the move notation history. Its monospaced characteristics ensure that numbers do not jump or shift during rapid time changes, maintaining visual stability during the "zeitnot" phase of a match. Text is rendered with high precision to maintain the system's clean, modern aesthetic.

## Layout & Spacing

The layout is strictly grid-bound, emphasizing a structured and predictable user experience. The chessboard serves as the anchor, occupying a fixed square aspect ratio. Sidebars for notation and player data use a fixed-width system to prevent layout shifts.

A 4px base unit governs all padding and margins. Gutters between interactive components are kept to a minimum (2px) to reinforce the dense, utilitarian feel of a professional tool. Content is organized with clear, intentional whitespace to balance the high-contrast color scheme.

## Elevation & Depth

Visual hierarchy is achieved through contrast and strokes rather than shadows. The system uses:
1. **Fills:** Subtle color shifts or inversions (e.g., black to white) for active states.
2. **Stroke:** 1px or 2px solid black borders are used to separate containers and define functional zones.
3. **Contrast:** Elements gain prominence by switching between a white surface and a solid black fill.

No shadows or blurs are used. Overlays and modals must use a solid white fill with a thick 2px solid black border to physically separate them from the underlying board and UI.

## Shapes

The shape language is defined by modern, soft-rounded geometry. Every element—buttons, input fields, and containers—utilizes a 0.5rem (8px) border radius. Selection indicators should be represented as rounded strokes or block backgrounds rather than sharp-edged blocks.

## Components

- **Buttons:** Rounded (8px) rectangles with a 1px solid black border. Default state is a white fill with black text. Active state inverts the colors (black background, white text). No hover transitions; state changes should be instantaneous and crisp.
- **Chessboard:** Squares are flat blocks of color. The 'Last Move' highlight is a solid 3px inner stroke in the secondary green color.
- **Timers:** Large-format Space Grotesk text. When time is critical, the container fill switches to the tertiary red color with white text.
- **Notation List:** A vertical list of moves with rounded highlight states for the current move. Text is monospaced for perfect alignment of columns.
- **Input Fields:** Rounded 1px full-stroke rectangles. Focus is indicated by an increased border thickness rather than a glow.
- **Status Chips:** Solid rounded blocks of color with white or black text depending on contrast requirements.