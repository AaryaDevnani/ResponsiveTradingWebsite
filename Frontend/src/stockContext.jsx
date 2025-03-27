import React, { createContext, useState } from "react";
const StockContext = createContext();

export function StockProvider({ children }) {

  let dev = false;
  let url = "";
  if (dev) {
    url = "http://127.0.0.1:8080";
  } else {
    url = "";
  }
  const [Ticker, setTicker] = useState("");
  const [profile, setProfile] = useState({});
  const [quote, setQuote] = useState({});
  const [peers, setPeers] = useState([]);
  const [news, setNews] = useState({});
  const [singleDayStock, setSingleDayStock] = useState({});
  const [chartData, setChartData] = useState({});
  const [insiderSentiment, setInsiderSentiment] = useState({});
  const [recs, setRecs] = useState({});
  const [earnings, setEarnings] = useState({});
  const [inWatchlist, setInWatchlist] = useState(false);
  const [openTime, setOpenTime] = useState(0);
  const [interval, intervalSetter] = useState(0);

  const marketOpen = async () => {
    const response = await fetch(`${url}/api/quote/AAPL`);
    const resJson = await response.json();
    let lastOpenTime = resJson.response.t;
    setOpenTime(lastOpenTime);
  };

  const clearContext = () => {
    setTicker("");
    setProfile({});
    setQuote({});
    setPeers([]);
    setNews({});
    setSingleDayStock({});
    setChartData({});
    setInsiderSentiment({});
    setRecs({});
    setEarnings({});
    setInWatchlist(false);
    setOpenTime(0);
  };

  const fetchProfile = async (ticker) => {
    const response = await fetch(`${url}/api/profile/${ticker}`);
    const resJson = await response.json();
    setProfile(resJson.response);
  };
  const fetchOnlyProfile = async (ticker) => {
    const response = await fetch(`${url}/api/profile/${ticker}`);
    const resJson = await response.json();
    setProfile({
      status: response.status,
      ...resJson.response,
    });
    return {
      status: response.status,
      ...resJson.response,
    };
  };

  const fetchQuote = async (ticker) => {
    const response = await fetch(`${url}/api/quote/${ticker}`);
    const resJson = await response.json();
    setOpenTime(resJson.response.t);
    setQuote(resJson.response);
    return resJson.response.t;
  };
  const fetchOnlyQuote = async (ticker) => {
    const response = await fetch(`${url}/api/quote/${ticker}`);
    const resJson = await response.json();
    return resJson.response;
  };

  const fetchSearchValues = async (input) => {
    const response = await fetch(`${url}/api/search/${input}`);
    const resJson = await response.json();
    return resJson.response;
  };

  const fetchPeers = async (ticker) => {
    const response = await fetch(`${url}/api/peers/${ticker}`);
    const resJson = await response.json();
    setPeers(resJson.response);
  };

  const fetchSingleDayStock = async (ticker) => {
    const currQuote = await fetch(`${url}/api/quote/${ticker}`);
    const currQuoteJson = await currQuote.json();
    let currentDate = new Date(currQuoteJson.response.t * 1000);
    let oneDayAgo = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedCurrentDate = formatDate(currentDate);
    const formattedOneDayAgo = formatDate(oneDayAgo);
    const response = await fetch(
      `${url}/api/historical/${ticker}/${formattedOneDayAgo}/${formattedCurrentDate}`
    );
    const resJson = await response.json();
    setSingleDayStock(resJson.response);
    return resJson;
  };

  const fetchChartData = async (ticker) => {
    const response = await fetch(`${url}/api/historical/${ticker}`);
    const resJson = await response.json();
    setChartData(resJson);
  };

  const fetchNews = async (ticker) => {
    const response = await fetch(`${url}/api/news/${ticker}`);
    let resJson = await response.json();

    const articles = resJson.response.filter(
      (article) =>
        article.image &&
        article.headline &&
        article.url &&
        article.datetime &&
        article.summary &&
        article.source
    );

    setNews(articles.slice(0, 20));
  };

  const fetchInsiderSentiment = async (ticker) => {
    const response = await fetch(`${url}/api/sentiment/${ticker}`);
    const resJson = await response.json();

    let dataArray = resJson.response.data;

    let totalMSPR = 0;
    let positiveMSPR = 0;
    let negativeMSPR = 0;
    let totalChange = 0;
    let positiveChange = 0;
    let negativeChange = 0;

    dataArray.forEach((item) => {
      totalMSPR += item.mspr;
      totalChange += item.change;

      if (item.mspr > 0) {
        positiveMSPR += item.mspr;
      } else {
        negativeMSPR += item.mspr;
      }

      if (item.change > 0) {
        positiveChange += item.change;
      } else {
        negativeChange += item.change;
      }
    });
    totalMSPR = Math.round(totalMSPR * 100) / 100;
    positiveMSPR = Math.round(positiveMSPR * 100) / 100;
    negativeMSPR = Math.round(negativeMSPR * 100) / 100;
    totalChange = Math.round(totalChange * 100) / 100;
    positiveChange = Math.round(positiveChange * 100) / 100;
    negativeChange = Math.round(negativeChange * 100) / 100;
    setInsiderSentiment({
      totalMSPR,
      positiveMSPR,
      negativeMSPR,
      totalChange,
      positiveChange,
      negativeChange,
    });
  };

  const saveToWatchlist = async (ticker) => {
    const response = await fetch(`${url}/api/watchlist/${ticker}`, {
      method: "POST",
    });
    const resJson = await response.json();
    setInWatchlist(true);
    return resJson;
  };

  const removeFromWatchlist = async (ticker) => {
    const response = await fetch(`${url}/api/watchlist/${ticker}`, {
      method: "DELETE",
    });
    const resJson = await response.json();
    setInWatchlist(false);
    return resJson;
  };

  const watchlistCheck = async (ticker) => {
    const response = await fetch(`${url}/api/watchlist/${ticker}`);
    const resJson = await response.json();
    setInWatchlist(resJson.response);
  };

  const fetchWatchlist = async () => {
    const response = await fetch(`${url}/api/watchlist`);
    const resJson = await response.json();
    return resJson.response;
  };

  const fetchRecs = async (ticker) => {
    const response = await fetch(`${url}/api/recommendations/${ticker}`);
    const resJson = await response.json();
    let strongSell = [];
    let sell = [];
    let hold = [];
    let buy = [];
    let strongBuy = [];
    let dates = [];
    resJson.response.map((item) => {
      strongBuy.push(item.strongBuy);
      buy.push(item.buy);
      hold.push(item.hold);
      sell.push(item.sell);
      strongSell.push(item.strongSell);
      dates.push(item.period);
    });
    let series = {
      strongBuy,
      buy,
      hold,
      sell,
      strongSell,
      dates,
    };
    setRecs(series);
  };

  const fetchEarnings = async (ticker) => {
    const response = await fetch(`${url}/api/earnings/${ticker}`);
    const resJson = await response.json();
    const actualSurpriseArray = [];
    const estimateSurpriseArray = [];
    const timeArr = [];

    resJson.response.forEach((item) => {
      timeArr.push(`${item.period} <br/> Surprise: ${item.surprise}`);
      actualSurpriseArray.push([item.period, item.actual]);
      estimateSurpriseArray.push([item.period, item.estimate]);
    });
    setEarnings({
      timeArr,
      actualSurpriseArray,
      estimateSurpriseArray,
    });
  };

  const buyStock = async (ticker, price, name, qty) => {
    console.log(ticker, price, name, qty);
    const response = await fetch(`${url}/api/portfolio/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Ticker: ticker,
        AvgPrice: price,
        Name: name,
        Qty: qty,
      }),
    });
    let resJson = await response.json();
    resJson.status = response.status;
    return resJson;
  };
  const sellStock = async (ticker, price, qty) => {
    const response = await fetch(`${url}/api/portfolio/sell`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Ticker: ticker,
        currPrice: price,
        Qty: qty,
      }),
    });
    let resJson = await response.json();
    resJson.status = response.status;
    return resJson;
  };

  const moneyInWallet = async () => {
    const response = await fetch(`${url}/api/wallet`);
    const resJson = await response.json();
    return resJson.response;
  };

  const checkInPortfolio = async (ticker) => {
    const response = await fetch(`${url}/api/portfolio/${ticker}`);
    const resJson = await response.json();
    return resJson.response;
  };

  const fetchPortfolio = async () => {
    const response = await fetch(`${url}/api/portfolio`);
    const resJson = await response.json();
    return resJson.response;
  };

  return (
    <StockContext.Provider
      value={{
        marketOpen,
        openTime,
        setTicker,
        Ticker,
        fetchProfile,
        fetchOnlyProfile,
        setProfile,
        profile,
        fetchQuote,
        fetchOnlyQuote,
        setQuote,
        quote,
        fetchSearchValues,
        fetchPeers,
        setPeers,
        peers,
        fetchSingleDayStock,
        singleDayStock,
        fetchNews,
        news,
        fetchChartData,
        chartData,
        fetchInsiderSentiment,
        insiderSentiment,
        fetchRecs,
        recs,
        fetchEarnings,
        earnings,
        saveToWatchlist,
        watchlistCheck,
        inWatchlist,
        setInWatchlist,
        removeFromWatchlist,
        fetchWatchlist,
        buyStock,
        sellStock,
        moneyInWallet,
        checkInPortfolio,
        fetchPortfolio,
        clearContext,
        interval,
        intervalSetter,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export default StockContext;
