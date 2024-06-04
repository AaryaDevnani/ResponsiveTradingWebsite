import React, { useContext, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StockContext from "../stockContext";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import "./styles/news.css";

function News({ ticker }) {
  const { news } = useContext(StockContext);
  const [show, setShow] = useState(false);
  const [article, setArticle] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [imageSize, setImageSize] = useState({});
  function unixToDate(ts) {
    const d = new Date(ts * 1000);
    return `${d.toLocaleDateString("en-US", {
      month: "long",
    })} ${d.getDate()}, ${d.getFullYear()}`;
  }

  const twitterShare = (url, headline) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${headline}&url=${url}`,
      "_blank"
    );
  };

  const facebookShare = (url, headline) => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${headline}`,
      "_blank"
    );
  };

  const modalClick = (article) => {
    setShow(true);
    setArticle(article);
  };
  useEffect(() => {
    if (window.innerWidth > 768) {
      setImageSize({ height: "75px", width: "125px" });
    } else {
      setImageSize({ height: "200px", width: "300px" });
    }
  }, [windowWidth]);

  useEffect(() => {
    function reportWindowSize() {
      setWindowWidth(window.innerWidth);
    }
    // Trigger this function on resize
    window.addEventListener("resize", reportWindowSize);
    //  Cleanup for componentWillUnmount
    return () => window.removeEventListener("resize", reportWindowSize);
  }, []);

  return (
    <div className="parent-div">
      <Row xs={12} sm={12} md={12} lg={12}>
        {news.map((item) => (
          <Col xs={12} sm={12} md={6} lg={6} key={item.title}>
            <button onClick={() => modalClick(item)}>
              <div className="article">
                <Row className="justify-content-center">
                  <Col className="imgimgimg max" xs={12} sm={12} md={3} lg={3}>
                    <img
                      className="news-img"
                      src={item.image}
                      alt="placeholder"
                      // fluid
                      xs={12}
                      s={12}
                      md={3}
                      lg={3}
                      style={imageSize}
                    />
                  </Col>
                  <Col
                    className="imgimgimg text-is-here"
                    xs={12}
                    s={12}
                    md={8}
                    lg={8}
                  >
                    <div style={{ boxSizing: "border-box !important" }}>
                      {item.headline}
                    </div>
                  </Col>
                </Row>
              </div>
            </button>
          </Col>
        ))}
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <div>
              <h4>{article.source}</h4>
              {unixToDate(article.datetime)}
            </div>
          </Modal.Header>
          <Modal.Body>
            <h5>{article.headline}</h5>

            <p>
              {article.summary} <br /> For more details click{" "}
              <a href={article.url}>here</a>{" "}
            </p>
          </Modal.Body>
          <div className="modal-footer-2">
            <div className="share">Share</div>
            <div className="icons">
              <div className="twitter-icon">
                <button
                  onClick={() => {
                    twitterShare(article.url, article.headline);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="40px"
                  >
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                  </svg>
                </button>
              </div>
              <div className="facebook-icon">
                <button
                  onClick={() => {
                    facebookShare(article.url, article.headline);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="40px"
                    fill="#3b5998"
                  >
                    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </Row>
    </div>
  );
}

export default News;
