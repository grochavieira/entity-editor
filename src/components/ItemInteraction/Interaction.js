import React, { useState, useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import "./Interaction.css";
import InteractionContext from "./context";

import produce from "immer";

import EntityList from "../List/EntityList";

import { loadEntities } from "../../services/api";

const data = loadEntities();

export default function Interaction() {
  const [entityList, setEntityList] = useState(data);

  function move(fromList, toList, from, to) {
    setEntityList(
      produce(entityList, draft => {
        const dragged = draft[fromList].entities[from];

        draft[fromList].entities.splice(from, 1);
        draft[toList].entities.splice(to, 0, dragged);
      })
    );
  }

  return (
    <InteractionContext.Provider value={{ entityList, move }}>
      <div className="interaction-container">
        <div className="header-block">
          <p className="title"> Entity Relationship</p>
        </div>

        <section>
          {entityList.map((list, index) => (
            <EntityList key={list.object_type} index={index} data={list} />
          ))}
        </section>
      </div>
    </InteractionContext.Provider>
  );
}
