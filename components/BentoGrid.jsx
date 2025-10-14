"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BENTO_PRESETS, getCurrentBreakpoint, getResponsiveClasses, DEFAULT_PANEL_HEIGHT } from "@/lib/bento-grid";

/**
 * BentoGrid Component
 *
 * A responsive grid layout component that renders widgets in a flexible bento-style layout.
 * Automatically adapts to different screen sizes and provides consistent widget positioning.
 */
function BentoGrid({
  preset = "dashboard",
  widgets = {},
  className,
  containerClassName,
  gap = "16px",
  children,
  showGridOverlay = false,
  customLayout,
  layout = "dashboard" // Alternative to preset for dashboard-focused API
}) {
  // Use layout if provided, otherwise fall back to preset
  const effectivePreset = layout || preset;
  const [currentBreakpoint, setCurrentBreakpoint] = useState("desktop");
  const [mounted, setMounted] = useState(false);

  // Handle responsive breakpoint detection
  useEffect(() => {
    setMounted(true);

    const updateBreakpoint = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  // Get the layout configuration
  const getLayoutConfig = () => {
    if (customLayout) {
      return customLayout;
    }

    const presetConfig = BENTO_PRESETS[effectivePreset];
    if (!presetConfig) {
      console.warn(`Unknown preset: ${effectivePreset}, falling back to dashboard`);
      return BENTO_PRESETS.dashboard;
    }

    return presetConfig;
  };

  const layoutConfig = getLayoutConfig();
  const responsiveClasses = getResponsiveClasses(layoutConfig.layouts, currentBreakpoint);

  // Create grid template areas based on layout
  const getGridTemplateAreas = () => {
    if (!mounted) return {};

    const layout = layoutConfig.layouts[currentBreakpoint] || [];
    const cols = layoutConfig.breakpoints[currentBreakpoint]?.cols || 12;

    // For now, we'll use CSS Grid with explicit positioning
    // In a more advanced version, we could use CSS Grid template areas
    return {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap
    };
  };

  const gridStyle = getGridTemplateAreas();

  // Render widgets based on layout configuration
  const renderWidgets = () => {
    if (children) {
      // If children are provided, render them directly
      return children;
    }

    return responsiveClasses.map(({ id, colSpan, height }) => {
      const widget = widgets[id];

      if (!widget) {
        return (
          <div
            key={id}
            className={cn("bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[200px]", colSpan)}
            style={{ minHeight: height }}
          >
            <span className="text-gray-500 text-sm">No widget for "{id}"</span>
          </div>
        );
      }

      // Render the widget with responsive column span and height
      return (
        <div
          key={id}
          className={colSpan}
          style={{
            minHeight: widget.minHeight || height,
            maxHeight: widget.maxHeight
          }}
        >
          {widget.component}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        "bento-grid-container w-full",
        showGridOverlay && "bento-grid-overlay",
        containerClassName
      )}
      style={gridStyle}
    >
      <style jsx>{`
        .bento-grid-overlay {
          position: relative;
        }

        .bento-grid-overlay::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px);
          background-size: ${gridStyle.gap} ${gridStyle.gap};
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className={cn("bento-grid relative", className)}>
        {renderWidgets()}
      </div>
    </div>
  );
}

/**
 * BentoGridItem Component
 *
 * Individual item component for use within BentoGrid when not using presets
 */
export function BentoGridItem({
  children,
  className,
  colSpan = "col-span-4",
  minHeight,
  maxHeight
}) {
  return (
    <div
      className={colSpan}
      style={{
        minHeight: minHeight || DEFAULT_PANEL_HEIGHT,
        maxHeight
      }}
    >
      <div className={cn("w-full h-full", className)}>
        {children}
      </div>
    </div>
  );
}

export default BentoGrid;
