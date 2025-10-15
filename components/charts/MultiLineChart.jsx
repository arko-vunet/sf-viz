"use client";

import { useEffect, useRef } from "react";

export default function MultiLineChart({
  series = [
    { name: "North", data: [20, 34, 31, 52, 42, 67, 78, 90, 120] },
    { name: "South", data: [15, 25, 28, 40, 38, 55, 65, 85, 110] },
    { name: "West", data: [10, 20, 26, 35, 34, 45, 58, 72, 95] },
  ],
  className = "h-full",
  ...props
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;

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

      if (chartRef.current) {
        const options = {
          ...baseChart,
          chart: { ...baseChart.chart, type: "line" },
          series: series,
          dataLabels: { enabled: false, style: baseChart.dataLabels.style },
          stroke: { curve: "smooth", width: 3 },
        };
        chart = new ApexCharts(chartRef.current, options);
        chart.render();
      }
    };

    init();

    return () => {
      if (chart) chart.destroy();
    };
  }, [series]);

  return <div ref={chartRef} className={className} {...props} />;
}
