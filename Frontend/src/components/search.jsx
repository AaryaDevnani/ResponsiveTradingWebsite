import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useParams, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import "./styles/search.css";
import Stock from "./stock";
import StockContext from "../stockContext";

function search() {
  const {
    fetchSearchValues,
    fetchPeers,
    fetchSingleDayStock,
    fetchProfile,
    fetchQuote,
    watchlistCheck,
    setTicker,
    Ticker,
    setProfile,
    fetchOnlyProfile,
    openTime,
    clearContext,
    interval,
    intervalSetter,
  } = useContext(StockContext);

  const nav = useNavigate();
  let { ticker } = useParams();
  const [searchArr, setSearchArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [finalSearch, setFinalSearch] = useState("");
  const [alert, setAlert] = useState(false);
  const [invalidTicker, setInvalidTicker] = useState(false);

  const handleOnSubmit = (e, val) => {
    setPageLoading(true);
    if (
      val === search ||
      (val === undefined && ticker === "home" && search !== "") ||
      (val !== undefined && search !== "")
    ) {
      if (val === undefined) {
        //THIS CASE COMES WHEN SEARCH ICON IS HIT
        val = search.split(" ")[0];
      } else {
        //THIS CASE COMES WHEN ENTER BUTTON IS HIT
        val = val.split(" ")[0];
      }

      setSearch(val);
      setFinalSearch(val);
      setOpen(false);
      setTicker(val);
      nav(`/search/${val}`);
      clearInterval(interval);
      let intervalID = setInterval(() => {
        fetchQuote(val);
      }, 15000);
      intervalSetter(intervalID);
    } else {
      // THIS CASE COMES WHEN SEARCH ICON IS HIT AND NO VALUE IS ENTERED
      setPageLoading(false);
      setOpen(false);
      setAlert(true);
      setPageLoading(false);
    }
  };

  const handleOnChange = async (e, v) => {
    setSearch(e.target.value);
    setSearchArr([]);
    if (e.target.value !== "") {
      setLoading(true);
      setOpen(true);
      setSearchArr(await fetchSearchValues(e.target.value));
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearch("");
    setSearchArr([]);
    setAlert(false);
    setOpen(false);
    nav(`/search/home`);
    clearContext();
    clearInterval(interval);
  };

  const load = async () => {
    if (ticker === "home") {
      if (Ticker !== "") {
        window.history.replaceState(null, "Title", Ticker);
        setInvalidTicker(false);
        setSearch(Ticker);
        setPageLoading(false);
      }
    } else {
      setPageLoading(true);
      let res = await fetchOnlyProfile(ticker);
      await fetchQuote(ticker);
      if (res.status === 418) {
        setPageLoading(false);
        setInvalidTicker(true);
      } else {
        setInvalidTicker(false);
        setProfile(res);
        await fetchPeers(ticker);
        await fetchSingleDayStock(ticker);
        await watchlistCheck(ticker);
        setPageLoading(false);
      }
    }
  };
  useEffect(() => {
    if (ticker !== "home" && ticker !== "HOME") {
      setTicker(ticker);
      setSearch(ticker);
    }
    load();
  }, [finalSearch, invalidTicker]);

  const textInputStyling = {
    "& fieldset ": {
      border: "3px solid #2226A3",
      borderRadius: "25px",
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
      border: "3px solid #2226A3",
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      border: "3px solid #2226A3",
    },
    width: { lg: "500px", md: "500px", sm: "300px", xs: "300px" },
    textAlign: "center",
  };

  return (
    <div className="search-page">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <div className="search-title">STOCK SEARCH</div>
        <Autocomplete
          freeSolo
          inputValue={search}
          open={open}
          disableClearable={true}
          loading={loading}
          loadingText={<CircularProgress color="primary" size={20} />}
          options={searchArr.map(
            (option) => `${option.symbol} | ${option.description}`
          )}
          renderInput={(params) => (
            <TextField
              onKeyDown={(e) => {
                if (e.key === "Enter" && search == "") {
                  setAlert(true);
                }
              }}
              sx={textInputStyling}
              {...params}
              value={search}
              InputProps={{
                ...params.InputProps,
                type: "search",
                size: "small",
                placeholder: "Enter stock ticker symbol",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={(e, v) => handleOnSubmit(e, v)}>
                      <SearchIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={handleClear}>
                      <CloseIcon color="primary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e, v) => handleOnChange(e, v)}
            />
          )}
          onChange={(e, v) => handleOnSubmit(e, v)}
        />
      </Box>
      {!invalidTicker && (
        <Container className="alert-styling">
          <Row xs={8} sm={8} md={8} lg={8}>
            <Alert
              key={"danger"}
              variant={"danger"}
              show={alert}
              onClose={() => setAlert(false)}
              dismissible
            >
              Please enter a valid ticker
            </Alert>
          </Row>
        </Container>
      )}
      <Container className="alert-styling">
        <Row xs={8} sm={8} md={8} lg={8}>
          <Alert key={"danger"} variant={"danger"} show={invalidTicker}>
            No data found. Please enter a valid ticker
          </Alert>
        </Row>
      </Container>
      {pageLoading ? (
        <div className="loader">
          <CircularProgress color="primary" size={60} />
        </div>
      ) : ticker !== undefined && !pageLoading && !invalidTicker ? (
        <Stock ticker={ticker.toUpperCase()} />
      ) : null}
    </div>
  );
}

export default search;
