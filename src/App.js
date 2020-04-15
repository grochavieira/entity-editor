import React from "react";

import "./global.css";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Routes from "./routes";

function App() {
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
