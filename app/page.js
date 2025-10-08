"use client";

import { useEffect, useRef } from "react";
import Panel from "@/components/Panel";
import TableWidget from "@/components/TableWidget";

export default function Home() {
  const columnRef = useRef(null);
  const pieRef = useRef(null);
  const lineRef = useRef(null);
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
        const lineOptions = {
          ...baseChart,
          chart: { ...baseChart.chart, type: "line" },
          series: [
            {
              name: "revenue",
              data: [20, 35, 30, 55, 52, 65, 80, 95, 130],
            },
          ],
          dataLabels: { enabled: false, style: baseChart.dataLabels.style },
          stroke: { curve: "smooth", width: 3 },
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
          title="Users"
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
        title="A Widget Title that's a bit longer"
        description="A description of the widget; can be fairly long, wrapping to multiple lines, if needed."
        externalHref="https://example.com"
        headerHeightClass="h-[37px]"
      >
        <div ref={lineRef} className="h-full" />
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
