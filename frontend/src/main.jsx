import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import AppBootstrap from "./components/AppBootstrap.jsx";
import { store } from "./store/index.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppBootstrap>
          <App />
        </AppBootstrap>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
