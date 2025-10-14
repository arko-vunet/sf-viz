"use client";

import React from "react";
import BentoGrid from "@/components/BentoGrid";
import Panel from "@/components/Panel";
import TableWidget from "@/components/TableWidget";

/**
 * Example component demonstrating the Dashboard-focused Bento Grid system
 */
export default function BentoExample() {
  // Define widgets for the grid layout - any widgets you want to display
  const widgets = {
    area1: {
      component: (
        <Panel
          title="Primary Widget"
          description="Main dashboard widget"
          externalHref="https://example.com"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Primary Content</h3>
            <p className="text-gray-600">
              This is just a widget in the primary area. You can put any widget here.
            </p>
          </div>
        </Panel>
      )
    },
    area2: {
      component: (
        <Panel
          title="Secondary Widget"
          description="Secondary information"
          showDescription={false}
          minHeight={200}
        >
          <div className="p-4">
            <h4 className="font-medium mb-2">Quick Stats</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Active Users: 1,234</li>
              <li>• Revenue: $45,678</li>
              <li>• Growth: +12%</li>
            </ul>
          </div>
        </Panel>
      )
    },
    area3: {
      component: (
        <Panel
          title="Chart Widget"
          description="Data visualization"
          minHeight={300}
        >
          <div className="p-4 h-full flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </Panel>
      )
    },
    area4: {
      component: (
        <Panel
          title="Summary Widget"
          description="Summary information"
          showExternalLink={false}
          minHeight={150}
        >
          <div className="p-4">
            <p className="text-sm text-gray-600">
              Summary information and key metrics.
            </p>
          </div>
        </Panel>
      )
    }
  };

  return (
    <div className="space-y-8">
      {/* Simple Dashboard Example - Most Common Use Case */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Simple Dashboard Layout</h2>
        <p className="text-gray-600 mb-4">Most common usage - just specify your widgets:</p>
        <BentoGrid
          widgets={widgets}
          className="min-h-screen"
        />
      </div>

      {/* Example 1: Dashboard Preset (Explicit) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Dashboard Layout Preset</h2>
        <BentoGrid
          preset="dashboard"
          widgets={widgets}
          showGridOverlay={true}
          className="min-h-screen"
        />
      </div>

      {/* Example 2: Sidebar Preset */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Sidebar Layout Preset</h2>
        <BentoGrid
          preset="sidebar"
          widgets={{
            main: widgets.main,
            sidebar1: widgets.sidebar,
            sidebar2: widgets.chart
          }}
          className="min-h-screen"
        />
      </div>

      {/* Example 3: Content Focus Preset */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Content Focus Layout Preset</h2>
        <BentoGrid
          preset="content"
          widgets={{
            main: widgets.main,
            support1: widgets.sidebar,
            support2: widgets.chart
          }}
          className="min-h-screen"
        />
      </div>

      {/* Example 4: Grid Layout Preset */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Grid Layout Preset</h2>
        <BentoGrid
          preset="grid"
          widgets={{
            widget1: widgets.main,
            widget2: widgets.sidebar,
            widget3: widgets.chart,
            widget4: widgets.footer,
            widget5: widgets.sidebar,
            widget6: widgets.chart
          }}
          className="min-h-screen"
        />
      </div>

      {/* Example 5: Custom Layout */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Custom Layout Example</h2>
        <BentoGrid
          customLayout={{
            name: "Custom Layout",
            description: "Custom layout with specific positioning",
            breakpoints: {
              mobile: { cols: 4, rows: "auto" },
              tablet: { cols: 8, rows: "auto" },
              desktop: { cols: 12, rows: "auto" }
            },
            layouts: {
              mobile: [
                { id: "main", x: 0, y: 0, w: 4, h: 3 },
                { id: "sidebar", x: 0, y: 3, w: 2, h: 1 },
                { id: "chart", x: 2, y: 3, w: 2, h: 1 }
              ],
              tablet: [
                { id: "main", x: 0, y: 0, w: 6, h: 4 },
                { id: "sidebar", x: 6, y: 0, w: 2, h: 2 },
                { id: "chart", x: 6, y: 2, w: 2, h: 2 }
              ],
              desktop: [
                { id: "main", x: 0, y: 0, w: 8, h: 5 },
                { id: "sidebar", x: 8, y: 0, w: 4, h: 2 },
                { id: "chart", x: 8, y: 2, w: 4, h: 3 }
              ]
            }
          }}
          widgets={widgets}
          className="min-h-screen"
        />
      </div>
    </div>
  );
}
