import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import StockContext from "../stockContext";
import Arrows from "../assets/arrow";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import "./styles/watchlist.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

function Watchlist() {
  const nav = useNavigate();
  const {
    fetchOnlyQuote,
    fetchWatchlist,
    fetchOnlyProfile,
    removeFromWatchlist,
  } = useContext(StockContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const deleteItem = async (e) => {
    await removeFromWatchlist(e);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    let data = await fetchWatchlist();
    let quotes = [];
    let tickers = [];
    let wl = [];
    let profiles = [];
    for (let i = 0; i < data.length; i++) {
      let res = await fetchOnlyQuote(data[i].Ticker);
      let profile = await fetchOnlyProfile(data[i].Ticker);
      quotes.push(res);
      tickers.push(data[i].Ticker);
      profiles.push(profile);
      wl.push({ quote: res, ticker: data[i].Ticker, profile: profile });
    }
    setWatchlist(wl);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="watchlist-parent">
      <Col xs={10} sm={10} md={8} lg={8}>
        <div className="watchlist-header">
          <h3>My Watchlist</h3>
        </div>
        {loading ? (
          <div className="smackdab-in-the-center">
            <CircularProgress />
          </div>
        ) : (
          watchlist.map((item) => (
            <Card
              className="cards"
              key={item.ticker}
              onClick={(e) => {
                nav(`/search/${item.ticker}`);
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.ticker);
                }}
              >
                <CloseIcon
                  className="close-icon"
                  sx={{ height: "15px", width: "15px" }}
                />
              </button>
              <Row className="inner-card-div">
                <Col>
                  <Row>
                    <div className="sym">{item.ticker}</div>
                  </Row>
                  <Row>
                    <div className="comp">{item.profile.name}</div>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <div
                      className={
                        item.quote.d < 0
                          ? "sym text-danger"
                          : "sym text-success"
                      }
                    >
                      {item.quote.c}
                    </div>
                  </Row>
                  <Row>
                    <div
                      className={
                        item.quote.d < 0
                          ? "comp text-danger"
                          : "comp text-success"
                      }
                    >
                      <Arrows dir={item.quote.d < 0 ? "down" : "up"} />
                      {Math.round(item.quote.d * 100) / 100} &#40;
                      {Math.round(item.quote.dp * 100) / 100}&#37;&#41;
                    </div>
                  </Row>
                </Col>
              </Row>
            </Card>
          ))
        )}
        {watchlist.length === 0 && !loading ? (
          <Container className="alert-styling">
            <Row xs={8} sm={8} md={8} lg={8}>
              <Alert key={"warning"} variant={"warning"} show={alert}>
                Currently you don't have any stock in your watchlist.
              </Alert>
            </Row>
          </Container>
        ) : null}
      </Col>
    </div>
  );
}

export default Watchlist;
