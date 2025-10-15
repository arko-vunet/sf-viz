"use client";

import { useEffect, useRef } from "react";

export default function ColumnChart({
  data = [30, 40, 45, 50, 49, 60, 70, 91, 125],
  title = "sales",
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
          chart: { ...baseChart.chart, type: "bar" },
          series: [
            {
              name: title,
              data: data,
            },
          ],
        };
        chart = new ApexCharts(chartRef.current, options);
        chart.render();
      }
    };

    init();

    return () => {
      if (chart) chart.destroy();
    };
  }, [data, title]);

  return <div ref={chartRef} className={className} {...props} />;
}
