import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/login-with-autopasskey-option.css";
import { loadAndSetMockContext } from "./utils/mockContextLoader";

async function initializeApp() {
  const currentPath = window.location.pathname;

  const isAculScreenPath =
    currentPath.includes("/login-id") ||
    currentPath.includes("/u/login") ||
    currentPath.includes("/login");

  if (isAculScreenPath) {
    await loadAndSetMockContext();

    let rootElement = document.getElementById("root");

    if (!rootElement) {
      rootElement = document.createElement("div");
      rootElement.id = "root";
      document.body.appendChild(rootElement);
    }

    rootElement.innerHTML = "";

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } else {
    console.log("Screen: " + currentPath);
    console.log("Not an ACUL screen path, allowing static content.");
    
    // For development, always render the app
    let rootElement = document.getElementById("root");
    if (rootElement) {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
    }
  }
}

initializeApp();