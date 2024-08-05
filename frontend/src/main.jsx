import React from "react";
import { createRoot } from "react-dom/client";
import "./Main.css";
import App from "./App";

/**
 * loads site wide css and renders the react app
 */
const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
