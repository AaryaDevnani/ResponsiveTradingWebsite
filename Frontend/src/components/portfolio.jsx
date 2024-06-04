import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
  Container,
} from "react-bootstrap";
import StockContext from "../stockContext";
import Alert from "react-bootstrap/Alert";
import "./styles/portfolio.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Arrows from "../assets/arrow";

function Portfolio() {
  const {
    fetchPortfolio,
    fetchOnlyQuote,
    moneyInWallet,
    checkInPortfolio,
    buyStock,
    sellStock,
  } = useContext(StockContext);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monie, setMonie] = useState(0);
  const [qty, setQty] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");
  const [ticker, setTicker] = useState("");
  const [modalData, setModalData] = useState({});
  const [soldShow, setSoldShow] = useState(false);
  const [buyShow, setBuyShow] = useState(false);

  const fetchStockData = async () => {
    setLoading(true);
    let data = await fetchPortfolio();
    let stockData = {};
    for (let i = 0; i < data.length; i++) {
      let tick = data[i].Ticker;
      let quoteData = await fetchOnlyQuote(tick);
      data[i].quote = quoteData;
      let portQty = await checkInPortfolio(tick);
      stockData[tick] = {
        name: data[i].Name,
        qty: portQty._doc.Qty,
        close: quoteData.c,
      };
      setTicker(tick);
    }
    let monies = await moneyInWallet();
    setMonie(monies.Amount);
    setPortfolio(data);
    setLoading(false);
    setModalData(stockData);
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
        ticker,
        modalData[ticker].close,
        modalData[ticker].name,
        parseInt(qty)
      );
      if (res.status === 200 || 201) {
        await fetchStockData();
        setShowModal(false);
        setAlertTimer(setBuyShow);
      }
    } else {
      let res = await sellStock(ticker, modalData[ticker].close, parseInt(qty));
      if (res.status === 200 || 201) {
        await fetchStockData();
        setShowModal(false);
        setAlertTimer(setSoldShow);
      }
    }
    setQty(0);
  };

  const roundToTwo = (num) => {
    return Math.round(num * 100) / 100;
  };
  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className="portfolio-parent">
      <Row className="justify-content-center this-annoying-row">
        <Col xs={11} sm={11} md={8} lg={8}>
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
              {ticker} sold successfully.
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
              {ticker} bought successfully.
            </Alert>
          </Container>
          <div className="portfolio-page-header">
            <h2>My Portfolio</h2>
          </div>
          {loading ? (
            <div className="smackdab-in-the-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <h5>Money in Wallet: ${roundToTwo(monie)}</h5>
              {portfolio.map((stock) => (
                <Card className="main-card" key={stock.Ticker}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="change-bg">
                      <div className="portfolio-header-wrapper">
                        <div className="portfolio-header">{stock.Ticker}</div>
                        <div className="portfolio-name">{stock.Name}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row className="card-data">
                        <Col xs={12} sm={12} md={6} lg={6}>
                          <Row>
                            <Col>Quantity:</Col>
                            <Col>{stock.Qty}</Col>
                          </Row>
                          <Row>
                            <Col>Avg. Cost / Share:</Col>
                            <Col>{roundToTwo(stock.AvgPrice)}</Col>
                          </Row>
                          <Row>
                            <Col>Total Cost:</Col>
                            <Col>{roundToTwo(stock.AvgPrice * stock.Qty)}</Col>
                          </Row>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6}>
                          <Row>
                            <Col>Change:</Col>
                            <Col
                              className={
                                roundToTwo(stock.quote.c - stock.AvgPrice) > 0
                                  ? "arrow-ko-upar-kar text-success"
                                  : roundToTwo(stock.quote.c - stock.AvgPrice) <
                                    0
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              <Arrows
                                dir={
                                  roundToTwo(stock.quote.c - stock.AvgPrice) > 0
                                    ? "up"
                                    : roundToTwo(
                                        stock.quote.c - stock.AvgPrice
                                      ) < 0
                                    ? "down"
                                    : "None"
                                }
                              />
                              {roundToTwo(stock.quote.c - stock.AvgPrice)}
                            </Col>
                          </Row>
                          <Row>
                            <Col>Current Price:</Col>
                            <Col
                              className={
                                roundToTwo(stock.quote.c - stock.AvgPrice) > 0
                                  ? "text-success"
                                  : roundToTwo(stock.quote.c - stock.AvgPrice) <
                                    0
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              {stock.quote.c}
                            </Col>
                          </Row>
                          <Row>
                            <Col>Market Value:</Col>
                            <Col
                              className={
                                roundToTwo(stock.quote.c - stock.AvgPrice) > 0
                                  ? "text-success"
                                  : roundToTwo(stock.quote.c - stock.AvgPrice) <
                                    0
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              {roundToTwo(stock.quote.c * stock.Qty)}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="change-bg">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShowModal(true);
                          setAction("buy");
                          setTicker(stock.Ticker);
                        }}
                      >
                        Buy
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setShowModal(true);
                          setAction("sell");
                          setTicker(stock.Ticker);
                        }}
                      >
                        Sell
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              ))}
            </>
          )}
        </Col>
      </Row>
      {modalData[ticker] && (
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
        >
          <Modal.Header closeButton className="ur">
            <div>{ticker.toUpperCase()}</div>
          </Modal.Header>
          <Form>
            <Row className="info">
              <Col>
                <div>
                  <div>Current Price: {modalData[ticker].close}</div>
                </div>
                <div>
                  <div>Money in Wallet: {roundToTwo(monie)}</div>
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
                      placeholder={"0"}
                    />
                  </div>
                  {action === "sell" && modalData[ticker].qty < qty && (
                    <div className="text-danger err-show">
                      You cannot sell the stocks you do not have!
                    </div>
                  )}
                  {action === "buy" &&
                    qty * modalData[ticker].close > monie && (
                      <div className="text-danger err-show">
                        Not enough money in wallet!
                      </div>
                    )}
                </div>
              </Col>
            </Row>
            <Row className="lr">
              <Col>
                Total Price:{" "}
                {Math.round(modalData[ticker].close * qty * 100) / 100}
              </Col>
              <Col className="buy-sell-2">
                {action === "buy" ? (
                  <Button
                    variant={
                      qty > 0 && qty * modalData[ticker].close <= monie
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
                      qty > 0 && qty <= modalData[ticker].qty
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
      )}
      {portfolio.length === 0 && !loading ? (
        <Container className="alert-styling">
          <Row className="justify-content-center">
            <Col xs={11} sm={11} md={9} lg={9}>
              <Alert key={"warning"} variant={"warning"}>
                Currently you don't have any stock.
              </Alert>
            </Col>
          </Row>
        </Container>
      ) : null}
    </div>
  );
}

export default Portfolio;
