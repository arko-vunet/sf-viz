/**
 * Bento Grid Layout System - Dashboard Focused
 *
 * This module provides a flexible bento grid layout system optimized for dashboard widgets.
 * All layouts use the dashboard preset for consistent, responsive widget positioning.
 */

// Flexible bento layout - generic responsive grid for widgets
export const BENTO_LAYOUT = {
  name: "Bento Grid",
  description: "Flexible responsive grid layout for widgets",
  breakpoints: {
    mobile: { cols: 4, rows: "auto" },
    tablet: { cols: 8, rows: "auto" },
    desktop: { cols: 12, rows: "auto" }
  },
  layouts: {
    mobile: [
      { id: "area1", x: 0, y: 0, w: 4, h: 2 },
      { id: "area2", x: 0, y: 2, w: 2, h: 2 },
      { id: "area3", x: 2, y: 2, w: 2, h: 2 },
      { id: "area4", x: 0, y: 4, w: 4, h: 1 }
    ],
    tablet: [
      { id: "area1", x: 0, y: 0, w: 6, h: 3 },
      { id: "area2", x: 6, y: 0, w: 2, h: 2 },
      { id: "area3", x: 6, y: 2, w: 2, h: 2 },
      { id: "area4", x: 0, y: 3, w: 8, h: 1 }
    ],
    desktop: [
      { id: "area1", x: 0, y: 0, w: 8, h: 4 },
      { id: "area2", x: 8, y: 0, w: 4, h: 2 },
      { id: "area3", x: 8, y: 2, w: 4, h: 2 },
      { id: "area4", x: 0, y: 4, w: 12, h: 1 }
    ]
  }
};

// Legacy dashboard preset for backward compatibility
export const DASHBOARD_PRESET = BENTO_LAYOUT;

// Export dashboard preset as the primary layout
export const BENTO_PRESETS = {
  dashboard: DASHBOARD_PRESET,
  // For backward compatibility, all presets now use the same dashboard layout
  sidebar: DASHBOARD_PRESET,
  content: DASHBOARD_PRESET,
  grid: DASHBOARD_PRESET,
  custom: DASHBOARD_PRESET
};

// Responsive breakpoint definitions
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

// Default panel height (384px as requested)
export const DEFAULT_PANEL_HEIGHT = 384;

// Helper function to get responsive column span classes
export function getResponsiveClasses(layout, breakpoint) {
  const currentBreakpoint = breakpoint || 'desktop';
  const currentLayout = layout[currentBreakpoint] || layout.desktop || [];

  return currentLayout.map(item => {
    const colSpan = `col-span-${item.w * 4}`; // Convert grid units to Tailwind col-span
    return {
      id: item.id,
      colSpan,
      height: item.h * DEFAULT_PANEL_HEIGHT
    };
  });
}

// Helper function to get current breakpoint based on screen size
export function getCurrentBreakpoint() {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

// Helper function to merge multiple presets
export function mergePresets(...presets) {
  const merged = {
    name: "Combined Layout",
    description: "Multiple presets combined",
    breakpoints: presets[0]?.breakpoints || BENTO_PRESETS.dashboard.breakpoints,
    layouts: {}
  };

  Object.keys(BREAKPOINTS).forEach(breakpoint => {
    merged.layouts[breakpoint] = [];

    presets.forEach((preset, presetIndex) => {
      if (preset?.layouts?.[breakpoint]) {
        const offsetY = merged.layouts[breakpoint].length > 0
          ? Math.max(...merged.layouts[breakpoint].map(item => item.y + item.h))
          : 0;

        const layoutItems = preset.layouts[breakpoint].map(item => ({
          ...item,
          id: `${presetIndex}-${item.id}`,
          y: item.y + offsetY
        }));

        merged.layouts[breakpoint].push(...layoutItems);
      }
    });
  });

  return merged;
}

// Helper function to create a custom dashboard preset
export function createCustomPreset(name, description, layouts) {
  return {
    name: name || "Custom Dashboard",
    description: description || "Custom dashboard layout",
    breakpoints: DASHBOARD_PRESET.breakpoints,
    layouts: layouts || DASHBOARD_PRESET.layouts
  };
}

// Export all utilities
const bentoGridUtils = {
  BENTO_LAYOUT,
  DASHBOARD_PRESET,
  BENTO_PRESETS,
  BREAKPOINTS,
  DEFAULT_PANEL_HEIGHT,
  getResponsiveClasses,
  getCurrentBreakpoint,
  mergePresets,
  createCustomPreset
};

export default bentoGridUtils;
