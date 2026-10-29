/**
 * Nuxt UI theme, following antfu's design system (https://github.com/antfu/design).
 *
 * Tokens (colors, fonts, radius, surfaces) live in `inertia/css/app.css`. This file
 * assigns the color ramps to Nuxt UI's semantic colors and applies the few
 * component-level rules of the design system globally, so pages never need
 * one-off classes for them.
 */

/**
 * antfu's `bg-glass:75`: floating panels are translucent and blur what is
 * behind them. Modals and slideovers stay opaque.
 */
const glass = 'bg-default/75 backdrop-blur-md'

export const theme = {
  colors: {
    primary: 'antfu',
    success: 'antfu-success',
    warning: 'antfu-warning',
    error: 'antfu-error',
    neutral: 'neutral',
  },

  dropdownMenu: { slots: { content: glass } },
  contextMenu: { slots: { content: glass } },
  popover: { slots: { content: glass } },
  tooltip: { slots: { content: glass } },
  select: { slots: { content: glass } },
  selectMenu: { slots: { content: glass } },
  inputMenu: { slots: { content: glass } },

  /**
   * Hierarchy: most text is muted, `text-highlighted` is reserved for what matters
   */
  table: { slots: { th: 'font-medium text-muted' } },

  /**
   * Technical values are mono and tabular
   */
  kbd: { slots: { base: 'font-mono' } },
}
