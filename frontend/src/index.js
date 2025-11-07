// src/index.js (또는 src/main.jsx)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App"; // 경로는 프로젝트에 맞게 조정

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* 최상위에서 한 번만 감싸기 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
