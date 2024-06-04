import React, { useEffect, useContext, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import IndicatorsCore from "highcharts/indicators/indicators";
import VBP from "highcharts/indicators/volume-by-price";
import StockContext from "../stockContext";
import "./styles/charts.css";
function Charts({ ticker }) {
  const { chartData } = useContext(StockContext);
  const [ohlc, setOhlc] = useState([]);
  const [volume, setVolume] = useState([]);

  IndicatorsCore(Highcharts);
  VBP(Highcharts);
  const groupingUnits = [
    ["week", [1]],
    ["month", [1, 2, 3, 4, 6]],
  ];
  let options = {
    chart: {
      height: 500,
      backgroundColor: "#f5f5f5",
    },
    rangeSelector: {
      allButtonsEnabled: true,
      enabled: true,
      selected: 2,
    },
    title: {
      text: `${ticker} Historical`,
    },
    subtitle: {
      text: "With SMA and Volume by Price technical indicators",
    },
    navigator: {
      enabled: true,
    },
    scrollbar: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      title: false,
      ordinal: true,
    },
    yAxis: [
      {
        opposite: true,
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        opposite: true,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    plotOptions: {
      series: {
        dataGrouping: {
          units: groupingUnits,
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },

    series: [
      {
        showInLegend: false,
        type: "candlestick",
        name: `${ticker}`,
        id: "aapl",
        zIndex: 2,
        data: ohlc,
      },
      {
        showInLegend: false,
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
      },
      {
        type: "vbp",
        linkedTo: "aapl",
        params: {
          volumeSeriesID: "volume",
        },
        dataLabels: {
          enabled: false,
        },
        zoneLines: {
          enabled: false,
        },
      },
      {
        type: "sma",
        linkedTo: "aapl",
        zIndex: 1,
        marker: {
          enabled: false,
        },
      },
    ],
  };

  const fetchAndSet = async () => {
    let data = chartData.response.results;
    let arr1 = [];
    let arr2 = [];
    for (let i = 0; i < data.length; i += 1) {
      arr1.push([
        data[i].t, // the date
        data[i].o, // open
        data[i].h, // high
        data[i].l, // low
        data[i].c, // close
      ]);

      arr2.push([
        data[i].t, // the date
        data[i].v, // the volume
      ]);
    }
    setOhlc(arr1);
    setVolume(arr2);
  };
  useEffect(() => {
    fetchAndSet();
  }, []);
  return (
    <div className="chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default Charts;
