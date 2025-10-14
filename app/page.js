"use client";

import { useEffect, useRef } from "react";
import Panel from "@/components/Panel";
import TableWidget from "@/components/TableWidget";

export default function Home() {
  const columnRef = useRef(null);
  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const lineLabelsRef = useRef(null);
  const multiLineRef = useRef(null);

  useEffect(() => {
    let columnChart;
    let lineChart;
    let pieChart;
    let multiLineChart;

    const init = async () => {
      const ApexCharts = (await import("apexcharts")).default;

      const toolbarSeparator = [
        {
          icon: '<span aria-hidden="true">•</span>',
          index: 2,
          title: "separator",
          class: "separator",
          click: function () { },
        },
      ];

      const baseChart = {
        chart: {
          fontFamily: "IBM Plex Sans, sans-serif",
          height: "100%",
          toolbar: {
            show: true,
            tools: { download: false, customIcons: toolbarSeparator },
            autoSelected: "zoom",
          },
          zoom: { enabled: true, type: "x", autoScaleYaxis: true },
        },
        legend: { fontFamily: "IBM Plex Sans, sans-serif" },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
          labels: { style: { fontFamily: "IBM Plex Sans, sans-serif" } },
        },
        yaxis: { labels: { style: { fontFamily: "IBM Plex Sans, sans-serif" } } },
        dataLabels: { style: { fontFamily: "IBM Plex Sans, sans-serif" } },
      };

      if (columnRef.current) {
        const options = {
          ...baseChart,
          chart: { ...baseChart.chart, type: "bar" },
          series: [
            {
              name: "sales",
              data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
            },
          ],
        };
        columnChart = new ApexCharts(columnRef.current, options);
        columnChart.render();
      }

      if (pieRef.current) {
        const pieOptions = {
          ...baseChart,
          chart: { ...baseChart.chart, type: "pie" },
          labels: ["North", "South", "West", "East"],
          series: [44, 33, 21, 12],
          legend: { position: "bottom", fontFamily: baseChart.legend.fontFamily },
          dataLabels: { enabled: true, style: baseChart.dataLabels.style },
        };
        pieChart = new ApexCharts(pieRef.current, pieOptions);
        pieChart.render();
      }

      if (lineRef.current) {
        const threshold = 65;
        const cpuData = [42, 58, 63, 71, 68, 54, 77, 83, 61];
        const baseTime = Date.now() - (cpuData.length - 1) * 20000;
        const timestamps = Array.from({ length: cpuData.length }, (_, i) => baseTime + i * 20000);
        const dataPoints = cpuData.map((y, i) => ({ x: timestamps[i], y }));
        const thresholdPoints = timestamps.map((t) => ({ x: t, y: threshold }));

        // Build breach points with dynamic label placement based on available space
        const categories = timestamps;
        const computeBreachPoints = (gridHeight = 200, xAxisHeight = 20) => {
          const labelHeight = 22; // approximate rendered label height
          const toolbarAvoidPx = 30; // avoid overlapping the chart toolbar at the top
          const bottomAvoidPx = Math.max(18, xAxisHeight + 8); // avoid x-axis labels at the bottom

          return cpuData
            .map((value, idx) => {
              if (value <= threshold) return null;

              // Convert value (0..100) to pixel position from top of plot
              const normalized = (value - 0) / (100 - 0);
              const yPxFromTop = gridHeight * (1 - normalized);

              const nearTop = yPxFromTop < toolbarAvoidPx + labelHeight;
              const nearBottom = yPxFromTop > gridHeight - (bottomAvoidPx + labelHeight);

              // Keep labels out of the line by rendering them above the chart in a separate layer
              const offsetY = -9999; // effectively hide built-in label; we draw custom labels separately

              return {
                x: categories[idx],
                y: value,
                seriesIndex: 0,
                marker: {
                  size: 6,
                  fillColor: "#EF4444",
                  strokeColor: "#ffffff",
                },
                label: {
                  text: `${value}%`,
                  borderColor: "#EF4444",
                  style: { color: "#ffffff", background: "#EF4444" },
                  offsetY,
                },
              };
            })
            .filter(Boolean);
        };

        const DASH = 4; // single source of truth for dashes
        const LINE_W = 1;
        const breachLines = cpuData
          .map((value, idx) => {
            if (value <= threshold) return null;
            return {
              x: timestamps[idx],
              borderColor: "#EF4444",
              strokeDashArray: DASH,
              borderWidth: LINE_W,
              opacity: 0.9,
            };
          })
          .filter(Boolean);

        const computeThresholdLabelPlacement = (w) => {
          const gridX = w.globals.gridX;
          const gridWidth = w.globals.gridWidth;
          const step = categories.length > 1 ? gridWidth / (categories.length - 1) : gridWidth;
          const labelHeight = 22;
          const verticalNearPct = 6; // within 6 percentage points of threshold
          const horizontalBuffer = 120; // px from left/right edges considered collision zones

          let collideLeft = false;
          let collideRight = false;
          cpuData.forEach((value, idx) => {
            if (value <= threshold) return;
            if (Math.abs(value - threshold) > verticalNearPct) return;
            const xPx = gridX + idx * step;
            if (xPx - gridX < horizontalBuffer) collideLeft = true;
            if (gridX + gridWidth - xPx < horizontalBuffer) collideRight = true;
          });

          if (collideLeft && !collideRight) return { position: "right", offsetX: 10 };
          if (collideRight && !collideLeft) return { position: "left", offsetX: -10 };
          if (collideLeft && collideRight) return { position: "left", offsetX: -10 };
          return { position: "left", offsetX: -10 };
        };

        // Render external labels in a separate absolutely-positioned layer above the chart
        const ensureExternalLabelLayer = () => {
          if (!lineLabelsRef.current) return null;
          const layer = lineLabelsRef.current;
          return layer;
        };

        const renderExternalLabels = (chartCtx) => {
          const layer = ensureExternalLabelLayer();
          if (!layer) return;
          // Do not render external breach labels; rely on hover tooltip instead
          layer.innerHTML = "";
        };

        const lineOptions = {
          ...baseChart,
          chart: {
            ...baseChart.chart,
            type: "line",
            events: {
              mounted: (chartCtx) => {
                const w = chartCtx.w;
                const pts = computeBreachPoints(w.globals.gridHeight, w.globals.xAxisHeight);
                const tl = computeThresholdLabelPlacement(w);
                const yAnn = [
                  {
                    y: threshold,
                    borderColor: "#F59E0B",
                    label: {
                      text: `${threshold}%`,
                      position: tl.position,
                      offsetX: tl.offsetX,
                      style: { background: "#F59E0B", color: "#ffffff" },
                    },
                  },
                  {
                    y: threshold,
                    y2: 100,
                    fillColor: "rgba(245, 158, 11, 0.08)",
                    opacity: 0.1,
                  },
                ];
                chartCtx.updateOptions({ annotations: { points: pts, yaxis: yAnn } }, false, true);
                renderExternalLabels(chartCtx);
              },
              updated: (chartCtx) => {
                const w = chartCtx.w;
                const pts = computeBreachPoints(w.globals.gridHeight, w.globals.xAxisHeight);
                const tl = computeThresholdLabelPlacement(w);
                const yAnn = [
                  {
                    y: threshold,
                    borderColor: "#F59E0B",
                    label: {
                      text: `${threshold}%`,
                      position: tl.position,
                      offsetX: tl.offsetX,
                      style: { background: "#F59E0B", color: "#ffffff" },
                    },
                  },
                  {
                    y: threshold,
                    y2: 100,
                    fillColor: "rgba(245, 158, 11, 0.08)",
                    opacity: 0.1,
                  },
                ];
                chartCtx.updateOptions({ annotations: { points: pts, yaxis: yAnn } }, false, true);
                renderExternalLabels(chartCtx);
              },
              resized: (chartCtx) => {
                const w = chartCtx.w;
                const pts = computeBreachPoints(w.globals.gridHeight, w.globals.xAxisHeight);
                const tl = computeThresholdLabelPlacement(w);
                const yAnn = [
                  {
                    y: threshold,
                    borderColor: "#F59E0B",
                    label: {
                      text: `${threshold}%`,
                      position: tl.position,
                      offsetX: tl.offsetX,
                      style: { background: "#F59E0B", color: "#ffffff" },
                    },
                  },
                  {
                    y: threshold,
                    y2: 100,
                    fillColor: "rgba(245, 158, 11, 0.08)",
                    opacity: 0.1,
                  },
                ];
                chartCtx.updateOptions({ annotations: { points: pts, yaxis: yAnn } }, false, true);
                renderExternalLabels(chartCtx);
              },
              zoomed: (chartCtx) => {
                const w = chartCtx.w;
                const pts = computeBreachPoints(w.globals.gridHeight, w.globals.xAxisHeight);
                const tl = computeThresholdLabelPlacement(w);
                const yAnn = [
                  {
                    y: threshold,
                    borderColor: "#F59E0B",
                    label: {
                      text: `${threshold}%`,
                      position: tl.position,
                      offsetX: tl.offsetX,
                      style: { background: "#F59E0B", color: "#ffffff" },
                    },
                  },
                  {
                    y: threshold,
                    y2: 100,
                    fillColor: "rgba(245, 158, 11, 0.08)",
                    opacity: 0.1,
                  },
                ];
                chartCtx.updateOptions({ annotations: { points: pts, yaxis: yAnn } }, false, true);
                renderExternalLabels(chartCtx);
              },
              beforeResetZoom: (chartCtx) => {
                const w = chartCtx.w;
                const pts = computeBreachPoints(w.globals.gridHeight, w.globals.xAxisHeight);
                const tl = computeThresholdLabelPlacement(w);
                const yAnn = [
                  {
                    y: threshold,
                    borderColor: "#F59E0B",
                    label: {
                      text: `${threshold}%`,
                      position: tl.position,
                      offsetX: tl.offsetX,
                      style: { background: "#F59E0B", color: "#ffffff" },
                    },
                  },
                  {
                    y: threshold,
                    y2: 100,
                    fillColor: "rgba(245, 158, 11, 0.08)",
                    opacity: 0.1,
                  },
                ];
                chartCtx.updateOptions({ annotations: { points: pts, yaxis: yAnn } }, false, true);
                renderExternalLabels(chartCtx);
              },
            },
          },
          series: [
            {
              name: "CPU Utilization (%)",
              data: dataPoints,
            },
            // Threshold dashed line is drawn via annotation for consistency; keep this series hidden
            {
              name: "Threshold",
              data: thresholdPoints,
            },
          ],
          dataLabels: { enabled: false, style: baseChart.dataLabels.style },
          // Consistent dashed style across all helper lines
          stroke: { curve: "smooth", width: [3, 1], dashArray: [0, 4] },
          markers: { size: 0, hover: { size: 0 } },
          colors: ["#3B82F6", "#F59E0B"],
          legend: { markers: { fillColors: ["#3B82F6", "#F59E0B"] } },
          xaxis: {
            type: "datetime",
            labels: {
              style: { fontFamily: "IBM Plex Sans, sans-serif" },
              datetimeUTC: false,
              format: "HH:mm:ss",
            },
            tickAmount: Math.min(timestamps.length - 1, 8),
          },
          yaxis: {
            ...baseChart.yaxis,
            min: 0,
            max: 100,
            tickAmount: 5,
            labels: {
              ...baseChart.yaxis.labels,
              formatter: (val) => `${Math.round(val)}%`,
            },
          },
          tooltip: { x: { format: "HH:mm:ss" } },
          annotations: {
            yaxis: [
              {
                y: threshold,
                borderColor: "#F59E0B",
                borderWidth: LINE_W,
                strokeDashArray: DASH,
                label: {
                  text: `${threshold}%`,
                  position: "left",
                  offsetX: -12,
                  style: { background: "#F59E0B", color: "#ffffff" },
                },
              },
              {
                y: threshold,
                y2: 100,
                fillColor: "rgba(245, 158, 11, 0.08)",
                opacity: 0.1,
              },
            ],
            points: computeBreachPoints(),
            xaxis: breachLines,
          },
        };
        lineChart = new ApexCharts(lineRef.current, lineOptions);
        lineChart.render();
      }

      if (multiLineRef.current) {
        const multiLineOptions = {
          ...baseChart,
          chart: { ...baseChart.chart, type: "line" },
          series: [
            { name: "North", data: [20, 34, 31, 52, 42, 67, 78, 90, 120] },
            { name: "South", data: [15, 25, 28, 40, 38, 55, 65, 85, 110] },
            { name: "West", data: [10, 20, 26, 35, 34, 45, 58, 72, 95] },
          ],
          dataLabels: { enabled: false, style: baseChart.dataLabels.style },
          stroke: { curve: "smooth", width: 3 },
        };
        multiLineChart = new ApexCharts(
          multiLineRef.current,
          multiLineOptions
        );
        multiLineChart.render();
      }
    };

    init();

    return () => {
      if (columnChart) columnChart.destroy();
      if (lineChart) lineChart.destroy();
      if (pieChart) pieChart.destroy();
      if (multiLineChart) multiLineChart.destroy();
    };
  }, []);

  return (
    <div className="grid-ctr font-sans">
      <div className="col-span-4 lg:col-span-6">
        <TableWidget
          title="Resource Utilization"
          description="Example table powered by TanStack React Table."
          externalHref="https://tanstack.com/table/latest"
        />
      </div>
      <Panel
        className="col-span-4"
        title="Widget Title"
        description="A description of the widget; can be fairly long, wrapping to multiple lines, if needed."
        externalHref="https://example.com"
      >
        <div ref={columnRef} className="h-full" />
      </Panel>
      <Panel
        className="col-span-2"
        title="Regions Share"
        description="Category breakdown as a pie chart."
        showExternalLink={false}
        headerHeightClass="h-[37px]"
      >
        <div ref={pieRef} className="h-full" />
      </Panel>
      <Panel
        className="col-span-4"
        title="CPU Utilization—Breaches"
        description="A description of the widget; can be fairly long, wrapping to multiple lines, if needed."
        externalHref="https://example.com"
        headerHeightClass="h-[37px]"
      >
        <div className="relative h-full">
          <div ref={lineRef} className="h-full" />
          <div ref={lineLabelsRef} className="pointer-events-none absolute inset-0" />
        </div>
      </Panel>
      <Panel
        className="col-span-4"
        title="Widget Title"
        showDescription={false}
        showExternalLink={false}
        headerHeightClass="h-[37px]"
      >
        <div ref={multiLineRef} className="h-full" />
      </Panel>
    </div>
  );
}
