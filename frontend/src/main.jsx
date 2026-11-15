
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const API_URL = "https://roblox-academy-gw8w.onrender.com";

const originalFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  if (typeof input === "string" && input.startsWith("/api/")) {
    return originalFetch(`${API_URL}${input}`, {
      ...init,
      credentials: "include"
    });
  }

  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
