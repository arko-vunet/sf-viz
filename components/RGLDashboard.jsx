"use client";

import React, { useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Panel from "@/components/Panel";
import TableWidget from "@/components/TableWidget";
import BMV from "@/components/BMV";
import ColumnChart from "@/components/charts/ColumnChart";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import MultiLineChart from "@/components/charts/MultiLineChart";

// Wrap Responsive to auto-measure container width
const ResponsiveGridLayout = WidthProvider(Responsive);

function RGLDashboard() {
    // Breakpoints aligned with existing CSS (globals.css): sm=0(4 cols), md=768(8 cols), lg=1024(12 cols)
    const breakpoints = { lg: 1024, md: 768, sm: 0 };
    const cols = { lg: 12, md: 8, sm: 4 };

    // Common sizes: rowHeight and margin tuned to match the 16px gutter visual rhythm
    const rowHeight = 16; // px per row
    const margin = [16, 16]; // [x, y]

    // Heights: 13 -> ~400px, 6 -> ~176px (with 16px margins)
    const H_LG = 13;
    const H_SM = 6;

    // Match Panel's default visual min height (384px) to grid rows: ceil((384+16)/32) = 13
    const MIN_ROWS_DEFAULT = 13; // for panels without explicit smaller minHeight
    const MIN_ROWS_SMALL = 7;    // for compact BMV tiles (~180px visual min)

    const layouts = {
        lg: [
            { i: "table", x: 0, y: 0, w: 6, h: H_LG, minW: 4, minH: MIN_ROWS_DEFAULT },
            { i: "col", x: 6, y: 0, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },
            { i: "pie", x: 10, y: 0, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },

            { i: "line", x: 0, y: H_LG, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },
            { i: "multi", x: 4, y: H_LG, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },

            { i: "bmv1", x: 8, y: H_LG, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },
            { i: "bmv2", x: 10, y: H_LG, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },

            // Four compact BMV tiles (approximate original 2x2 group within 4 columns)
            { i: "bmv3", x: 0, y: H_LG * 2, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv4", x: 2, y: H_LG * 2, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv5", x: 0, y: H_LG * 2 + H_SM, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv6", x: 2, y: H_LG * 2 + H_SM, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
        ],
        md: [
            { i: "table", x: 0, y: 0, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },
            { i: "col", x: 4, y: 0, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },

            { i: "pie", x: 0, y: H_LG, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },
            { i: "line", x: 2, y: H_LG, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },
            { i: "multi", x: 6, y: H_LG, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },

            { i: "bmv1", x: 0, y: H_LG * 2, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },
            { i: "bmv2", x: 2, y: H_LG * 2, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },

            { i: "bmv3", x: 4, y: H_LG * 2, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv4", x: 6, y: H_LG * 2, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv5", x: 4, y: H_LG * 2 + H_SM, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv6", x: 6, y: H_LG * 2 + H_SM, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
        ],
        sm: [
            { i: "table", x: 0, y: 0, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },
            { i: "col", x: 0, y: H_LG, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },
            { i: "pie", x: 0, y: H_LG * 2, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },
            { i: "line", x: 0, y: H_LG * 3, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },
            { i: "multi", x: 0, y: H_LG * 4, w: 4, h: H_LG, minW: 3, minH: MIN_ROWS_DEFAULT },

            { i: "bmv1", x: 0, y: H_LG * 5, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },
            { i: "bmv2", x: 2, y: H_LG * 5, w: 2, h: H_LG, minW: 2, minH: MIN_ROWS_DEFAULT },

            { i: "bmv3", x: 0, y: H_LG * 6, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv4", x: 2, y: H_LG * 6, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv5", x: 0, y: H_LG * 6 + H_SM, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
            { i: "bmv6", x: 2, y: H_LG * 6 + H_SM, w: 2, h: H_SM, minW: 2, minH: MIN_ROWS_SMALL },
        ],
    };

    const handleResizeStop = useCallback(() => {
        // Nudge charts to reflow responsively after a resize
        try {
            window.dispatchEvent(new Event("resize"));
        } catch (_) { /* ignore */ }
    }, []);

    return (
        <ResponsiveGridLayout
            className="rgl-container"
            breakpoints={breakpoints}
            cols={cols}
            layouts={layouts}
            margin={margin}
            containerPadding={[0, 0]}
            rowHeight={rowHeight}
            isResizable
            resizeHandles={["se"]}
            isDraggable
            draggableHandle=".panel-drag-handle"
            draggableCancel=".no-drag, .apexcharts-toolbar, .apexcharts-tooltip, .apexcharts-menu"
      compactType="vertical"
      preventCollision={false}
            onResizeStop={handleResizeStop}
        >
            <div key="table" style={{ height: "100%" }}>
                <TableWidget
                    title="Resource Utilization"
                    description="Example table powered by TanStack React Table."
                    externalHref="https://tanstack.com/table/latest"
                />
            </div>

            <div key="col" style={{ height: "100%" }}>
                <Panel
                    title="Widget Title"
                    description="A description of the widget; can be fairly long, wrapping to multiple lines, if needed."
                    externalHref="https://example.com"
                >
                    <ColumnChart />
                </Panel>
            </div>

            <div key="pie" style={{ height: "100%" }}>
                <Panel
                    title="Regions Share"
                    description="Category breakdown as a pie chart."
                    showExternalLink={false}
                    headerHeightClass="h-[37px]"
                >
                    <PieChart />
                </Panel>
            </div>

            <div key="line" style={{ height: "100%" }}>
                <Panel
                    title="CPU Utilization—Breaches"
                    description="A description of the widget; can be fairly long, wrapping to multiple lines, if needed."
                    externalHref="https://example.com"
                    headerHeightClass="h-[37px]"
                >
                    <LineChart />
                </Panel>
            </div>

            <div key="multi" style={{ height: "100%" }}>
                <Panel
                    title="Widget Title"
                    showDescription={false}
                    showExternalLink={false}
                    headerHeightClass="h-[37px]"
                >
                    <MultiLineChart />
                </Panel>
            </div>

            <div key="bmv1" style={{ height: "100%" }}>
                <Panel
                    title="Conversion Rate"
                    description="Current conversion rate with historical comparison"
                    externalHref="https://example.com"
                    headerHeightClass="h-[37px]"
                >
                    <BMV
                        value="24.87%"
                        label=""
                        historicalData={[
                            { label: "Yesterday", value: "32.45%" },
                            { label: "2 days ago", value: "62.45%" },
                            { label: "3 days ago", value: "24.83%" }
                        ]}
                        thresholds={{ good: 60, warning: 30, critical: 15 }}
                    />
                </Panel>
            </div>

            <div key="bmv2" style={{ height: "100%" }}>
                <Panel
                    title="Conversion Rate"
                    description="Current conversion rate with historical comparison"
                    externalHref="https://example.com"
                    headerHeightClass="h-[37px]"
                >
                    <BMV
                        value="24.87%"
                        label=""
                        historicalData={[
                            { label: "Yesterday", value: "32.45%" },
                            { label: "2 days ago", value: "62.45%" },
                            { label: "3 days ago", value: "24.83%" }
                        ]}
                        thresholds={{ good: 60, warning: 30, critical: 15 }}
                    />
                </Panel>
            </div>

            <div key="bmv3" style={{ height: "100%" }}>
                <Panel
                    title="Revenue Growth"
                    description="Monthly revenue growth percentage"
                    externalHref="https://example.com"
                    headerHeightClass="h-[37px]"
                    minHeight={180}
                >
                    <BMV
                        value="12.5%"
                        label=""
                        showHistorical={false}
                        thresholds={{ good: 10, warning: 5, critical: 0 }}
                    />
                </Panel>
            </div>

            <div key="bmv4" style={{ height: "100%" }}>
                <Panel
                    title="User Engagement"
                    description="Daily active users percentage"
                    externalHref="https://example.com"
                    headerHeightClass="h-[37px]"
                    minHeight={180}
                >
                    <BMV
                        value="68.3%"
                        label=""
                        showHistorical={false}
                        thresholds={{ good: 70, warning: 50, critical: 30 }}
                    />
                </Panel>
            </div>

            <div key="bmv5" style={{ height: "100%" }}>
                <Panel
                    title="Conversion Rate"
                    description="Website conversion rate"
                    externalHref="https://example.com"
                    headerHeightClass="h-[37px]"
                    minHeight={180}
                >
                    <BMV
                        value="3.2%"
                        label=""
                        showHistorical={false}
                        thresholds={{ good: 5, warning: 2, critical: 1 }}
                    />
                </Panel>
            </div>

            <div key="bmv6" style={{ height: "100%" }}>
                <Panel
                    title="Customer Satisfaction"
                    description="NPS score percentage"
                    externalHref="https://example.com"
                    headerHeightClass="h-[37px]"
                    minHeight={180}
                >
                    <BMV
                        value="84.7%"
                        label=""
                        showHistorical={false}
                        thresholds={{ good: 80, warning: 60, critical: 40 }}
                    />
                </Panel>
            </div>
        </ResponsiveGridLayout>
    );
}

export default RGLDashboard;


