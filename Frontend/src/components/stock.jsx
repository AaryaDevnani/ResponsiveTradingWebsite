import React from "react";
import { useEffect, useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Modal,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import StarIcon from "../assets/star";
import Arrows from "../assets/arrow";
import StockContext from "../stockContext";
import "./styles/stock.css";
import TabSection from "./tabSection";

function Stock({ ticker }) {
  const {
    profile,
    quote,
    marketOpen,
    saveToWatchlist,
    inWatchlist,
    removeFromWatchlist,
    openTime,
    buyStock,
    sellStock,
    moneyInWallet,
    checkInPortfolio,
    Ticker,
  } = useContext(StockContext);
  const [modalShow, setModalShow] = useState(false);
  const [marketStatus, setMarketStatus] = useState(false);
  const [action, setAction] = useState("");
  const [qty, setQty] = useState(0);
  const [money, setMoney] = useState(0);
  const [portfolioQty, setPortfolioQty] = useState(0);
  const [soldShow, setSoldShow] = useState(false);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  const [removedFromWatchlist, setRemovedFromWatchlist] = useState(false);
  const [buyShow, setBuyShow] = useState(false);
  const [time, setTime] = useState(Date.now());
  const dateFormatter = (date) => {
    let newDate = new Date(date * 1000);
    let dateFormat = ` ${newDate.getFullYear()}-${newDate.toLocaleDateString(
      "en-US",
      {
        month: "2-digit",
      }
    )}-${newDate.getDate()} ${newDate.toLocaleTimeString("it-IT")}`;

    return dateFormat;
  };

  const setAlertTimer = (setter) => {
    setter(true);
    setTimeout(() => {
      setter(false);
    }, 15000);
  };

  const handleBuyorSellClick = async (action) => {
    if (action === "buy") {
      let res = await buyStock(
        profile.ticker,
        quote.c,
        profile.name,
        parseInt(qty)
      );
      if (res.status === 200) {
        setPortfolioQty(qty + portfolioQty);
        checkInPortfolio(profile.ticker);
        setAlertTimer(setBuyShow);
        setQty(0);
        setModalShow(false);
      }
    } else {
      let res = await sellStock(profile.ticker, quote.c, parseInt(qty));
      if (res.status === 200) {
        setPortfolioQty(portfolioQty - qty);
        coupleOfPortfolioCalls();
        setAlertTimer(setSoldShow);
        setQty(0);
        setModalShow(false);
      }
    }
  };

  const addOrRemove = () => {
    if (inWatchlist) {
      removeFromWatchlist(profile.ticker);
      setAlertTimer(setRemovedFromWatchlist);
      setAddedToWatchlist(false);
    } else {
      saveToWatchlist(profile.ticker);
      setAlertTimer(setAddedToWatchlist);
      setRemovedFromWatchlist(false);
    }
  };

  const coupleOfPortfolioCalls = async () => {
    let monies = await moneyInWallet();
    setMoney(monies.Amount);
    let port = await checkInPortfolio(profile.ticker);
    if (port.exist) {
      setPortfolioQty(port._doc.Qty);
    } else {
      setPortfolioQty(0);
    }
  };

  useEffect(() => {
    if (Date.now() / 1000 - openTime < 5000) {
      setMarketStatus(true);
    } else {
      setMarketStatus(false);
    }
    coupleOfPortfolioCalls();
    setTime(Date.now());
  }, [quote]);
  useEffect(() => {}, [portfolioQty]);
  return Ticker !== "" ? (
    <div className="main-div">
      <Container className="alert-styling">
        <Alert
          key={"danger"}
          variant={"danger"}
          show={soldShow}
          dismissible
          onClose={() => {
            setSoldShow(false);
          }}
        >
          {profile.ticker.toUpperCase()} sold successfully.
        </Alert>
      </Container>
      <Container className="alert-styling">
        <Alert
          key={"success"}
          variant={"success"}
          show={buyShow}
          dismissible
          onClose={() => {
            setBuyShow(false);
          }}
        >
          {profile.ticker.toUpperCase()} bought successfully.
        </Alert>
        <Alert
          key={"success"}
          variant={"success"}
          show={addedToWatchlist}
          dismissible
          onClose={() => {
            setAddedToWatchlist(false);
          }}
        >
          {profile.ticker.toUpperCase()} added to Watchlist.
        </Alert>
        <Alert
          key={"danger"}
          variant={"danger"}
          show={removedFromWatchlist}
          dismissible
          onClose={() => {
            setRemovedFromWatchlist(false);
          }}
        >
          {profile.ticker.toUpperCase()} removed from Watchlist.
        </Alert>
      </Container>
      <Container className="top-row">
        <Row>
          <Col md={4} xs={5} className="row-item stock-name">
            <div className="title">
              <div className="symbol">{profile.ticker}</div>
              <div className="icon">
                <button
                  onClick={() => {
                    addOrRemove();
                  }}
                >
                  <StarIcon
                    color={"#000000"}
                    height={25}
                    width={25}
                    filled={inWatchlist}
                  />
                </button>
              </div>
            </div>
            <div className="full-name">{profile.name}</div>
            <div className="market">{profile.exchange}</div>
            <div className="buy-sell">
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => {
                  setModalShow(true);
                  setAction("buy");
                }}
              >
                Buy
              </button>
              {portfolioQty > 0 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setModalShow(true);
                    setAction("sell");
                  }}
                >
                  Sell
                </button>
              )}
            </div>
          </Col>
          <Col md={4} xs={2} className="row-item stock-logo">
            <Image src={profile.logo} width={100} fluid />
          </Col>
          <Col md={4} xs={5} className="row-item stock-rate">
            <div
              className={
                Math.round(quote.d * 100) / 100 < 0
                  ? "price text-danger"
                  : Math.round(quote.d * 100) / 100 > 0
                  ? "price text-success"
                  : "price"
              }
            >
              {quote.c}
            </div>
            <div
              className={
                Math.round(quote.d * 100) / 100 < 0
                  ? "price-2 text-danger"
                  : Math.round(quote.d * 100) / 100 > 0
                  ? "price-2 text-success"
                  : "price-2"
              }
            >
              <Arrows
                dir={
                  Math.round(quote.d * 100) / 100 < 0
                    ? "down"
                    : Math.round(quote.d * 100) / 100 > 0
                    ? "up"
                    : "None"
                }
              />
              {Math.round(quote.d * 100) / 100}&#40;
              {Math.round(quote.dp * 100) / 100}&#37;&#41;
            </div>
            <div className="time">{dateFormatter(time / 1000)}</div>
          </Col>
        </Row>
      </Container>
      <div className={marketStatus ? `time text-success` : `time text-danger`}>
        {marketStatus
          ? "Market is Open"
          : `Market Closed on ${dateFormatter(quote.t)}`}
      </div>
      <TabSection ticker={ticker} />
      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      >
        <Modal.Header closeButton className="ur">
          <div>{profile.ticker.toUpperCase()}</div>
        </Modal.Header>
        <Form>
          <Row className="info">
            <Col>
              <div>
                <div>Current Price: {quote.c}</div>
              </div>
              <div>
                <div>Money in Wallet: {money}</div>
              </div>
              <div>
                <div className="qty-flex">
                  Quantity:
                  <Form.Control
                    className="l-margin"
                    type="number"
                    onChange={(e) => {
                      setQty(e.target.value);
                    }}
                    value={qty}
                    placeholder={0}
                  />
                </div>
                {action === "sell" && portfolioQty < qty && (
                  <div className="text-danger">
                    You cannot sell the stocks you do not have!
                  </div>
                )}
                {action === "buy" && qty * quote.c > money && (
                  <div className="text-danger">Not enough money in wallet!</div>
                )}
              </div>
            </Col>
          </Row>
          <Row className="lr">
            <Col>Total Price: {Math.round(quote.c * qty * 100) / 100}</Col>
            <Col className="buy-sell-2">
              {action === "buy" ? (
                <Button
                  variant={
                    qty > 0 && qty * quote.c < money
                      ? "success"
                      : "success disabled"
                  }
                  onClick={() => handleBuyorSellClick("buy")}
                >
                  Buy
                </Button>
              ) : (
                <Button
                  variant={
                    qty > 0 && qty <= portfolioQty
                      ? "danger"
                      : "danger disabled"
                  }
                  onClick={() => handleBuyorSellClick("sell")}
                >
                  Sell
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  ) : (
    <></>
  );
}

export default Stock;
