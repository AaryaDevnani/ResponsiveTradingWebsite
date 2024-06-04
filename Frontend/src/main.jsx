import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { StockProvider } from "./stockContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StockProvider>
    <App />
  </StockProvider>
);
