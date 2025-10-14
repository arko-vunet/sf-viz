"use client";

import React from "react";
import BentoGrid from "@/components/BentoGrid";
import Panel from "@/components/Panel";
import TableWidget from "@/components/TableWidget";
import { mergePresets } from "@/lib/bento-grid";

/**
 * Example component demonstrating how to combine multiple presets
 */
export default function CombinedPresetsExample() {
  // Define widgets for different sections
  const section1Widgets = {
    area1: {
      component: (
        <Panel
          title="Primary Widget"
          description="Main content widget"
          externalHref="https://example.com"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Primary Content</h3>
            <p className="text-gray-600">
              Main widget content area showing key information.
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
            <h4 className="font-medium mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-2 bg-blue-50 rounded text-sm hover:bg-blue-100">
                Generate Report
              </button>
              <button className="w-full text-left p-2 bg-green-50 rounded text-sm hover:bg-green-100">
                Export Data
              </button>
            </div>
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
            <p className="text-gray-500">Chart visualization</p>
          </div>
        </Panel>
      )
    }
  };

  const section2Widgets = {
    area1: {
      component: (
        <Panel
          title="Main Widget"
          description="Primary content"
          minHeight={400}
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Main Content</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                This is the primary widget with detailed content.
                Other widgets are positioned around it for context.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium mb-1">Metric 1</h4>
                  <p className="text-sm text-gray-600">Value: 123</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium mb-1">Metric 2</h4>
                  <p className="text-sm text-gray-600">Value: 456</p>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )
    },
    area2: {
      component: (
        <Panel
          title="Secondary Widget"
          description="Supporting information"
          minHeight={200}
        >
          <div className="p-4">
            <h4 className="font-medium mb-2">Related Information</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Related Item 1</li>
              <li>• Related Item 2</li>
              <li>• Related Item 3</li>
            </ul>
          </div>
        </Panel>
      )
    },
    area3: {
      component: (
        <Panel
          title="Context Widget"
          description="Additional context"
          minHeight={200}
        >
          <div className="p-4">
            <h4 className="font-medium mb-2">Additional Context</h4>
            <p className="text-sm text-gray-600">
              This widget provides additional context and supporting information.
            </p>
          </div>
        </Panel>
      )
    }
  };

  // Create a combined preset that stacks two sections
  const combinedPreset = mergePresets(
    { name: "Section 1", layouts: {
      mobile: [
        { id: "area1", x: 0, y: 0, w: 4, h: 2 },
        { id: "area2", x: 0, y: 2, w: 2, h: 1 },
        { id: "area3", x: 2, y: 2, w: 2, h: 1 }
      ],
      tablet: [
        { id: "area1", x: 0, y: 0, w: 6, h: 3 },
        { id: "area2", x: 6, y: 0, w: 2, h: 1 },
        { id: "area3", x: 6, y: 1, w: 2, h: 2 }
      ],
      desktop: [
        { id: "area1", x: 0, y: 0, w: 8, h: 4 },
        { id: "area2", x: 8, y: 0, w: 4, h: 2 },
        { id: "area3", x: 8, y: 2, w: 4, h: 2 }
      ]
    }},
    { name: "Section 2", layouts: {
      mobile: [
        { id: "area1", x: 0, y: 0, w: 4, h: 3 },
        { id: "area2", x: 0, y: 3, w: 2, h: 1 },
        { id: "area3", x: 2, y: 3, w: 2, h: 1 }
      ],
      tablet: [
        { id: "area1", x: 0, y: 0, w: 8, h: 4 },
        { id: "area2", x: 0, y: 4, w: 4, h: 2 },
        { id: "area3", x: 4, y: 4, w: 4, h: 2 }
      ],
      desktop: [
        { id: "area1", x: 0, y: 0, w: 12, h: 3 },
        { id: "area2", x: 0, y: 3, w: 6, h: 2 },
        { id: "area3", x: 6, y: 3, w: 6, h: 2 }
      ]
    }}
  );

  return (
    <div className="space-y-12">
      {/* Section 1: First Layout */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Section One</h2>
        <BentoGrid
          customLayout={{
            name: "Section 1",
            breakpoints: { mobile: { cols: 4 }, tablet: { cols: 8 }, desktop: { cols: 12 } },
            layouts: {
              mobile: [
                { id: "area1", x: 0, y: 0, w: 4, h: 2 },
                { id: "area2", x: 0, y: 2, w: 2, h: 1 },
                { id: "area3", x: 2, y: 2, w: 2, h: 1 }
              ],
              tablet: [
                { id: "area1", x: 0, y: 0, w: 6, h: 3 },
                { id: "area2", x: 6, y: 0, w: 2, h: 1 },
                { id: "area3", x: 6, y: 1, w: 2, h: 2 }
              ],
              desktop: [
                { id: "area1", x: 0, y: 0, w: 8, h: 4 },
                { id: "area2", x: 8, y: 0, w: 4, h: 2 },
                { id: "area3", x: 8, y: 2, w: 4, h: 2 }
              ]
            }
          }}
          widgets={section1Widgets}
          className="min-h-[600px]"
        />
      </div>

      {/* Section 2: Second Layout */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Section Two</h2>
        <BentoGrid
          customLayout={{
            name: "Section 2",
            breakpoints: { mobile: { cols: 4 }, tablet: { cols: 8 }, desktop: { cols: 12 } },
            layouts: {
              mobile: [
                { id: "area1", x: 0, y: 0, w: 4, h: 3 },
                { id: "area2", x: 0, y: 3, w: 2, h: 1 },
                { id: "area3", x: 2, y: 3, w: 2, h: 1 }
              ],
              tablet: [
                { id: "area1", x: 0, y: 0, w: 8, h: 4 },
                { id: "area2", x: 0, y: 4, w: 4, h: 2 },
                { id: "area3", x: 4, y: 4, w: 4, h: 2 }
              ],
              desktop: [
                { id: "area1", x: 0, y: 0, w: 12, h: 3 },
                { id: "area2", x: 0, y: 3, w: 6, h: 2 },
                { id: "area3", x: 6, y: 3, w: 6, h: 2 }
              ]
            }
          }}
          widgets={section2Widgets}
          className="min-h-[500px]"
        />
      </div>

      {/* Section 3: Simple Layout Examples */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Simple Layout Examples</h2>
        <div className="space-y-8">
          {/* First section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Section 1 Layout</h3>
            <BentoGrid
              widgets={section1Widgets}
              className="min-h-[400px]"
            />
          </div>

          {/* Second section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Section 2 Layout</h3>
            <BentoGrid
              widgets={section2Widgets}
              className="min-h-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
