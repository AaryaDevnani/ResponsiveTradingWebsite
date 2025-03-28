const express = require("express");
const app = express();
const mongoose = require("mongoose");
const watchlist = require("./models/watchlist");
const portfolio = require("./models/portfolio");
const wallet = require("./models/wallet");
const { ObjectId } = require("mongodb");
const PORT = 8080;
const path = require("path");

const uri = process.env.MONGODB_URI;
accObjId = "6633b046707f9d292703bdbf";

mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
});

app.listen(PORT, () => console.log("Server running on port", PORT));

const finnhubAPIKey = process.env.FINNHUB_API_KEY;
const polygonAPIKey = process.env.POLYGON_API_KEY;

//To allow CORS
var corsMiddleware = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PUT, PATCH, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );

  next();
};

app.use(corsMiddleware);
app.use(express.json());
app.use(express.static(path.join(__dirname, "./static")));

app.get("/ping", async (req, res) => {
  res.json({ Res: "Pong" });
});

app.get("/api/profile/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${finnhubAPIKey}`;
  try {
    let profile = await fetch(url);
    let profileJson = await profile.json();
    if (Object.keys(profileJson).length === 0) {
      res.status(418).json({ response: "", err: "I'm a teapot" });
    } else {
      res.json({ response: profileJson, err: "" });
    }
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/historical/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  var fromDate = Math.floor(Date.now() - 24 * 30 * 24 * 60 * 60 * 1000);
  var now = Math.floor(Date.now());
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${now}?adjusted=true&sort=asc&apiKey=${polygonAPIKey}`;
  try {
    let historical = await fetch(url);
    let historicalJson = await historical.json();
    res.json({
      response: historicalJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/historical/:ticker/:fromDate/:toDate", async (req, res) => {
  let ticker = req.params.ticker;
  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${polygonAPIKey}`;
  try {
    let historical = await fetch(url);
    let historicalJson = await historical.json();
    res.json({
      response: historicalJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/quote/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${finnhubAPIKey}`;
  try {
    let quote = await fetch(url);
    let quoteJson = await quote.json();
    res.json({
      response: quoteJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/search/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/search?q=${ticker}&token=${finnhubAPIKey}`;

  try {
    let search = await fetch(url);
    let searchJson = await search.json();
    let filteredResults = searchJson.result.filter(
      (item) => item.type === "Common Stock"
    );

    let filterdot = filteredResults.filter((item) => {
      if (!item.symbol.includes(".")) {
        return true;
      }
    });
    let mappedResults = filterdot.map((item) => ({
      symbol: item.symbol,
      description: item.description,
    }));
    res.json({
      response: mappedResults,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/news/:ticker", async (req, res) => {
  const currentDate = new Date(Date.now());
  const sevenDaysAgo = new Date(
    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedTo = formatDate(currentDate);
  const formattedFrom = formatDate(sevenDaysAgo);

  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${formattedFrom}&to=${formattedTo}&token=${finnhubAPIKey}`;
  try {
    let news = await fetch(url);
    let newsJson = await news.json();
    res.json({
      response: newsJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/recommendations/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${finnhubAPIKey}`;
  try {
    let rec = await fetch(url);
    let recJson = await rec.json();
    res.json({
      response: recJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/sentiment/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker}&from=2022-01-01&token=${finnhubAPIKey}`;
  try {
    let sentiments = await fetch(url);
    let sentimentsJson = await sentiments.json();
    res.json({
      response: sentimentsJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/peers/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=${finnhubAPIKey}`;
  try {
    let peers = await fetch(url);
    let peersJson = await peers.json();
    res.json({
      response: peersJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/earnings/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${finnhubAPIKey}`;
  try {
    let earnings = await fetch(url);
    let earningsJson = await earnings.json();
    res.json({
      response: earningsJson,
      err: "",
    });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.post("/api/watchlist/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  let watchlistItem = new watchlist({ Ticker: ticker });
  try {
    await watchlistItem.save();
    res.json({ response: "Success", err: "" });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.delete("/api/watchlist/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  try {
    await watchlist.deleteOne({ Ticker: ticker });
    res.json({ response: "Success", err: "" });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/watchlist/:ticker", async (req, res) => {
  let ticker = req.params.ticker;

  try {
    let watchlistItem = await watchlist.findOne({ Ticker: ticker });
    if (watchlistItem) {
      res.json({ response: true, err: "" });
    } else {
      res.json({ response: false, err: "" });
    }
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/watchlist", async (req, res) => {
  try {
    let watchlistItems = await watchlist.find();
    res.json({ response: watchlistItems, err: "" });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/portfolio", async (req, res) => {
  try {
    let portfolioItems = await portfolio.find();
    res.json({ response: portfolioItems, err: "" });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.post("/api/portfolio/buy", async (req, res) => {
  let { Ticker, Name, Qty, AvgPrice } = req.body;
  let currWallet = await wallet.findOne({ _id: accObjId });
  let currentAmount = currWallet.Amount;
  let newAmount = currentAmount - AvgPrice * Qty;
  if (currWallet.Amount < AvgPrice * Qty) {
    res.status(500).json({ response: "", err: "Insufficient Funds" });
  } else {
    let existingPortfolioItem = await portfolio.findOne({ Ticker });
    if (existingPortfolioItem) {
      try {
        await portfolio.updateOne(
          { Ticker },
          {
            $set: {
              Qty: existingPortfolioItem.Qty + Qty,
              AvgPrice:
                (existingPortfolioItem.AvgPrice * existingPortfolioItem.Qty +
                  AvgPrice * Qty) /
                (existingPortfolioItem.Qty + Qty),
            },
          }
        );
        await wallet.updateOne(
          { _id: accObjId },
          {
            $set: { Amount: newAmount },
          }
        );
        res.json({ response: "Success", err: "" });
      } catch (e) {
        res.status(500).json({ response: "", err: e });
      }
    } else {
      let portfolioItem = new portfolio({ Ticker, Name, Qty, AvgPrice });
      try {
        await portfolioItem.save();
        await wallet.updateOne(
          { _id: accObjId },
          {
            $set: { Amount: newAmount },
          }
        );
        res.json({ response: "Success", err: "" });
      } catch (e) {
        res.status(500).json({ response: "", err: e });
      }
    }
  }
});

app.post("/api/portfolio/sell", async (req, res) => {
  let { Ticker, Qty, currPrice } = req.body;
  let existingPortfolioItem = await portfolio.findOne({ Ticker });
  if (existingPortfolioItem) {
    if (existingPortfolioItem.Qty - Qty < 0) {
      res.status(500).json({ response: "", err: "Insufficient Quantity" });
    } else {
      if (existingPortfolioItem.Qty - Qty === 0) {
        try {
          await portfolio.deleteOne({ Ticker });
          res.json({ response: "Success", err: "" });
        } catch (e) {
          res.status(500).json({ response: "", err: e });
        }
        await wallet.updateOne(
          { _id: accObjId },
          {
            $inc: { Amount: currPrice * Qty },
          }
        );
      } else {
        try {
          await portfolio.updateOne(
            { Ticker },
            {
              $set: {
                Qty: existingPortfolioItem.Qty - Qty,
              },
            }
          );
          await wallet.updateOne(
            { _id: accObjId },
            {
              $inc: { Amount: currPrice * Qty },
            }
          );

          res.json({ response: "Success", err: "" });
        } catch (e) {
          res.status(500).json({ response: "", err: e });
        }
      }
    }
  } else {
    res.status(500).json({ response: "", err: "Item not found" });
  }
});

app.get("/api/wallet", async (req, res) => {
  try {
    let amount = await wallet.find();
    res.json({ response: amount[0], err: "" });
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});

app.get("/api/portfolio/:ticker", async (req, res) => {
  let ticker = req.params.ticker;
  try {
    let amount = await portfolio.findOne({
      Ticker: ticker,
    });
    if (amount) {
      let newRes = { ...amount, exist: true };
      res.json({ response: newRes, err: "" });
    } else {
      let newRes = { exist: false };
      res.json({ response: newRes, err: "" });
    }
  } catch (e) {
    res.status(500).json({ response: "", err: e });
  }
});
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./static", "index.html"));
});
// app.post("/api/wallet/deposit", async (req, res) => {
//   let { amount } = req.body;
//   let newAmount = new wallet({ Amount: amount });
//   try {
//     await newAmount.save();
//     res.json({ response: "Success", err: "" });
//   } catch (e) {
//     res.status(500).json({ response: "", err: e });
//   }
// });
