import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import "./global.css";
import "./App.css";

import EntityForm from "./components/Form/EntityForm";
import Interaction from "./components/ItemInteraction/Interaction.js";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <aside>
          <EntityForm />
        </aside>
        <main>
          <Interaction />
        </main>
      </div>
    </DndProvider>
  );
}

export default App;
