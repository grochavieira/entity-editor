import React from "react";

import "./global.css";
import "./App.css";

import EntityForm from "./components/Form/EntityForm";

function App() {
  return (
    <div className="App">
      <aside>
        <EntityForm />
      </aside>
      <main></main>
    </div>
  );
}

export default App;
