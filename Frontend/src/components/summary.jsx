import React from "react";
import { useContext, useEffect, useState } from "react";
import StockContext from "../stockContext";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "./styles/summary.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Summary({ ticker }) {
  const { quote, profile, peers, singleDayStock } = useContext(StockContext);

  let options = {};

  if (singleDayStock.results !== undefined) {
    let mappedData = singleDayStock.results.map((item) => [item.t, item.o]);
    let col = "#000000";
    if (quote.dp < 0) {
      col = "#ff0000";
    } else {
      col = "#198754";
    }
    options = {
      chart: {
        type: "line",
        backgroundColor: "#f5f5f5",
      },
      title: {
        text: `${ticker} Hourly Price Variation`,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: "datetime",
        labels: {
          format: "{value:%H:%M}",
        },
        title: false,
      },
      yAxis: {
        opposite: true,
        title: false,
      },
      plotOptions: {
        series: {
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
          data: mappedData,
          color: col,
        },
      ],
    };
  }
  return (
    <Container>
      <Row>
        <Col xs={12} s={12} md={6} lg={6}>
          <Row>
            <Col xs={12} s={12} md={6} lg={6}>
              <ul className="ohlc-list">
                <li>
                  <strong> High Price: </strong>
                  {quote.h}
                </li>
                <li>
                  <strong> Low Price: </strong> {quote.l}
                </li>
                <li>
                  <strong> Open Price: </strong> {quote.o}
                </li>
                <li>
                  <strong> Prev. Close: </strong> {quote.pc}
                </li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col xs={12} s={12} md={12} lg={12}>
              <div className="about">
                <div className="heading">
                  <strong>
                    <u>About the company</u>
                  </strong>
                </div>
                <div className="about-in">
                  <strong>IPO Start Date:</strong> {profile.ipo}
                </div>
                <div className="about-in">
                  <strong>Industry:</strong> {profile.finnhubIndustry}
                </div>
                <div className="about-in">
                  <strong>Webpage:</strong>{" "}
                  <a href={profile.weburl}>{profile.weburl}</a>
                </div>
                <div className="about-in">
                  <strong>Company Peers: </strong>
                </div>
                <div className="about-in">
                  {peers.map((peer) => (
                    <span key={peer}>
                      <a href={"http://www.localhost:5173/search/" + peer}>
                        {peer}
                      </a>
                      ,{" "}
                    </span>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} s={12} md={6} lg={6}>
          <div className="chart">
            {singleDayStock.results !== undefined ? (
              <HighchartsReact highcharts={Highcharts} options={options} />
            ) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Summary;
