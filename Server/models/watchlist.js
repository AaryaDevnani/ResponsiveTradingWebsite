const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  Ticker: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("watchlist", watchlistSchema);
