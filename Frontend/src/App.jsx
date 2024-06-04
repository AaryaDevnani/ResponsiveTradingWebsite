import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import NavBar from "./components/nav";
import Search from "./components/search";
import "bootstrap/dist/css/bootstrap.min.css";
import Watchlist from "./components/watchlist";
import { appTheme } from "./theme";
import Portfolio from "./components/portfolio";
import Footer from "./components/footer";
function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <Router>
        <div className="App">
          <NavBar />
          <div className="main">
            <Routes>
              <Route exact path="/" element={<Navigate to="/search/home" />} />
              <Route exact path="/search/:ticker" element={<Search />} />
              <Route exact path="/watchlist" element={<Watchlist />} />
              <Route exact path="/portfolio" element={<Portfolio />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
