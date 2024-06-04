import React from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./styles/insights.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useState, useEffect, useContext } from "react";
import StockContext from "../stockContext";

function Insights() {
  const { profile, insiderSentiment, recs, earnings } =
    useContext(StockContext);
  const barOptions = {
    chart: {
      type: "column",
      backgroundColor: "#f5f5f5",
    },
    title: {
      text: "Recommendation Trends",
      align: "center",
    },
    xAxis: {
      categories: recs.dates,
    },
    yAxis: {
      min: 0,
      title: {
        text: "#Analysis",
      },
      stackLabels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "Strong Buy",
        data: recs.strongBuy,
        color: "#19703a",
      },
      {
        name: "Buy",
        data: recs.buy,
        color: "#1BAD54",
      },
      {
        name: "Hold",
        data: recs.hold,
        color: "#C19725",
      },
      {
        name: "Sell",
        data: recs.sell,
        color: "#F06366",
      },
      {
        name: "Strong Sell",
        data: recs.strongSell,
        color: "#8A3536",
      },
    ],
  };

  let splineOptions = {
    chart: {
      type: "spline",
      backgroundColor: "#f5f5f5",
    },
    title: {
      text: "Historical EPS Surprises",
      align: "center",
    },
    xAxis: {
      categories: earnings.timeArr,
    },
    yAxis: {
      title: {
        text: "Quarterly EPS",
      },
    },
    legend: {
      enabled: true,
    },

    plotOptions: {
      spline: {
        marker: {
          enable: false,
        },
      },
    },
    series: [
      {
        name: "Actual",
        data: earnings.actualSurpriseArray,
      },
      {
        name: "Estimate",
        data: earnings.estimateSurpriseArray,
      },
    ],
  };

  return (
    <div className="insights-parent">
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={6} lg={6} className="Table">
          <h4 className="insights-heading">Insider Sentiments</h4>
          <div>
            <Table>
              <thead>
                <tr>
                  <th>{profile.name}</th>
                  <th>MSPR</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Total</th>
                  <td>{insiderSentiment.totalMSPR}</td>
                  <td>{insiderSentiment.totalChange}</td>
                </tr>
                <tr>
                  <th>Positive</th>
                  <td>{insiderSentiment.positiveMSPR}</td>
                  <td>{insiderSentiment.positiveChange}</td>
                </tr>
                <tr>
                  <th>Negative</th>
                  <td>{insiderSentiment.negativeMSPR}</td>
                  <td>{insiderSentiment.negativeChange}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={6} lg={6} className="Chart 1">
          <HighchartsReact highcharts={Highcharts} options={barOptions} />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} className="Chart 2">
          <HighchartsReact highcharts={Highcharts} options={splineOptions} />
        </Col>
      </Row>
    </div>
  );
}

export default Insights;
