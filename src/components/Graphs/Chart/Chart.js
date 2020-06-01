import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Chart.scss";
import { prepareLineChartOptions, generateChart, getCanvasContext } from "../../../utils/chart";
import { Box } from "@material-ui/core";
import { positions } from "@material-ui/system";
import CustomToolip from "../../CustomTooltip";
import { Line } from "react-chartjs-2";

/**
 * @typedef {import('../../../utils/chart').ChartColorOptions} ChartColorOptions
 * @typedef {import('../../../utils/chart').ChartData} ChartData
 */

const MemoizedLine = React.memo(Line, () => true);

/**
 * @typedef {Object} GenericChartPropTypes
 * @property {String} id ID of the cnavas passed as a child.
 * @property {Object} children Canvas component to render the chart.
 * @property {ChartColorOptions} colorsOptions Chart colors.
 * @property {ChartData} chartData Chart dataset.
 */

/**
 * Provides a wrapper to display a chart.
 *
 * @param {GenericChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const GenericChart = (props) => {
  const { id, chartData, colorsOptions, children } = props;
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);

  const showTooltip2 = useCallback((tooltip) => {
    console.log(tooltip);

    // if chart is not defined, return early
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    // hide the tooltip when chartjs determines you've hovered out
    if (tooltip.opacity === 0) {
      setTooltipData({ show: false });
      return;
    }

    const position = chart.chartInstance.canvas.getBoundingClientRect();

    // assuming your tooltip is `position: fixed`
    // set position of tooltip
    //   caretX?
    const left = position.left + window.pageXOffset + tooltip.caretX;

    const bottom = position.top + window.pageYOffset + tooltip.caretY;

    console.log(tooltip.yAlign, tooltip.caretY, window.pageYOffset);

    // set values for display of data in the tooltip
    const date = tooltip.dataPoints[0].xLabel;
    const value = tooltip.dataPoints[0].yLabel + "%";

    setTooltipData({
      pos: { bottom, left },
      title: value,
      show: true,
    });
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "",
        data: chartData.values,
        backgroundColor: colorsOptions.backgroundColor,
        borderColor: colorsOptions.borderColor,
        fill: "start",
        pointHoverRadius: 7,
        pointHoverBorderWidth: 4,
        pointHoverBorderColor: "#5200c5",
        pointHoverBackgroundColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    hover: {
      intersect: false,
      mode: "nearest",
      animationDuration: 0,
    },
    tooltips: {
      mode: "nearest",
      intersect: false,
      //   position: "nearest",
      displayColors: false,
      callbacks: {
        /**
         * Default Tooltip component configurations.
         *
         * @typedef {Object} TooltipItemParam
         * @property {String} index
         */
        /**
         * Default Tooltip component configurations.
         *
         * @typedef {Object} DatasetObject
         * @property {Array<Number>} data
         */
        /**
         * Default Datasets object proteries
         *
         * @typedef {Array<DatasetObject>} DatasetCollection
         */
        /**
         * Default Dara params.
         *
         * @typedef {Object} DataParam
         * @property {DatasetCollection} datasets
         */
        /**
         * Tooltip configuration params.
         *
         * @param {TooltipItemParam} tooltipItem
         * @param {DataParam} data
         */
        //   label,
        //   afterLabel: () => {
        //     return "%";
        //   },
      },
      enabled: false,
      custom: showTooltip2,
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0,
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
            fontFamily: "PlexSans-Bold",
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
    },
    events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
    // events: ["click", "touchstart", "touchmove"],

    // pointHitRadius: 10,
  };

  //   console.log(positions);

  //   useEffect(() => {
  //     const canvasContext = getCanvasContext(id);
  //     generateChart(canvasContext, prepareLineChartOptions(colorsOptions, chartData, showTooltip2));
  //   }, [id, chartData, colorsOptions]);
  //   const LineChart = React.memo((props) => {
  //     console.log("Greeting Comp render");
  //     return <Line data={data} options={options} />;
  //   });

  return (
    <Box className="chart">
      {tooltipData && (
        <CustomToolip title={tooltipData.title} open={tooltipData.show} pos={tooltipData.pos}>
          <div></div>
        </CustomToolip>
      )}

      <MemoizedLine data={data} options={options} ref={chartRef} />
    </Box>
  );
};

export default GenericChart;
