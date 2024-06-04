import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { Tab, Box, Tabs } from "@mui/material";
import "./styles/tabSection.css";
import Summary from "./summary";
import News from "./news";
import StockContext from "../stockContext";

import Chart from "./charts";
import Insights from "./insights";

function TabSection({ ticker }) {
  const [tabValue, setTabValue] = useState(1);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const {
    marketOpen,
    fetchNews,
    fetchChartData,
    fetchInsiderSentiment,
    fetchRecs,
    fetchEarnings,
    Ticker,
  } = useContext(StockContext);
  useEffect(() => {
    if (ticker !== "HOME" && Ticker !== "") {
      fetchNews(ticker);
      fetchChartData(ticker);
      fetchInsiderSentiment(ticker);
      fetchRecs(ticker);
      fetchEarnings(ticker);
    }
  }, [tabValue, ticker]);
  return (
    <div className="tabs">
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          scrollButtons
          allowScrollButtonsMobile
          indicatorColor="primary"
          variant="scrollable"
        >
          <Tab
            value={1}
            sx={{ minWidth: "fit-content", flex: 1 }}
            label="Summary"
          />
          <Tab
            value={2}
            sx={{ minWidth: "fit-content", flex: 1 }}
            label="Top News"
          />
          <Tab
            value={3}
            sx={{ minWidth: "fit-content", flex: 1 }}
            label="Charts"
          />
          <Tab
            value={4}
            sx={{ minWidth: "fit-content", flex: 1 }}
            label="Insights"
          />
        </Tabs>
        {tabValue === 1 && (
          <div className="tab1">
            <Summary ticker={ticker} />
          </div>
        )}
        {tabValue === 2 && (
          <div className="tab2">
            <News ticker={ticker} />
          </div>
        )}
        {tabValue === 3 && (
          <div className="tab3">
            <Chart ticker={ticker} />
          </div>
        )}
        {tabValue === 4 && (
          <div className="tab4">
            <Insights />
          </div>
        )}
      </Box>
    </div>
  );
}

export default TabSection;
