var options = {
    chart: {
        type: 'bar',
        fontFamily: 'IBM Plex Sans, sans-serif'
    },
    legend: {
        fontFamily: 'IBM Plex Sans, sans-serif'
    },
    series: [{
        name: 'sales',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
    }],
    xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        labels: { style: { fontFamily: 'IBM Plex Sans, sans-serif' } }
    },
    yaxis: {
        labels: { style: { fontFamily: 'IBM Plex Sans, sans-serif' } }
    },
    dataLabels: {
        style: { fontFamily: 'IBM Plex Sans, sans-serif' }
    }
}

var chartMount = document.querySelector("#column-chart");
if (chartMount) {
    var chart = new ApexCharts(chartMount, options);
    chart.render();
}

// Line chart configuration and render
var lineOptions = {
    chart: {
        type: 'line',
        fontFamily: 'IBM Plex Sans, sans-serif'
    },
    legend: {
        fontFamily: 'IBM Plex Sans, sans-serif'
    },
    series: [{
        name: 'revenue',
        data: [20, 35, 30, 55, 52, 65, 80, 95, 130]
    }],
    xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        labels: { style: { fontFamily: 'IBM Plex Sans, sans-serif' } }
    },
    yaxis: {
        labels: { style: { fontFamily: 'IBM Plex Sans, sans-serif' } }
    },
    dataLabels: {
        enabled: false,
        style: { fontFamily: 'IBM Plex Sans, sans-serif' }
    },
    stroke: {
        curve: 'smooth',
        width: 3
    }
}

var lineMount = document.querySelector("#line-chart");
if (lineMount) {
    var lineChart = new ApexCharts(lineMount, lineOptions);
    lineChart.render();
}

// Multi-series line chart configuration and render
var multiLineOptions = {
    chart: {
        type: 'line',
        fontFamily: 'IBM Plex Sans, sans-serif'
    },
    legend: {
        fontFamily: 'IBM Plex Sans, sans-serif'
    },
    series: [
        { name: 'North', data: [20, 34, 31, 52, 42, 67, 78, 90, 120] },
        { name: 'South', data: [15, 25, 28, 40, 38, 55, 65, 85, 110] },
        { name: 'West', data: [10, 20, 26, 35, 34, 45, 58, 72, 95] }
    ],
    xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        labels: { style: { fontFamily: 'IBM Plex Sans, sans-serif' } }
    },
    yaxis: {
        labels: { style: { fontFamily: 'IBM Plex Sans, sans-serif' } }
    },
    dataLabels: {
        enabled: false,
        style: { fontFamily: 'IBM Plex Sans, sans-serif' }
    },
    stroke: {
        curve: 'smooth',
        width: 3
    }
}

var multiLineMount = document.querySelector("#multi-line-chart");
if (multiLineMount) {
    var multiLineChart = new ApexCharts(multiLineMount, multiLineOptions);
    multiLineChart.render();
}