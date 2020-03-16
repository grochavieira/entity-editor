import React, { useState, useRef } from "react";
import SearchIcon from "@material-ui/icons/Search";

import Modal from "../../components/Modal";
import Header from "../../components/Header";
import api from "../../services/api";

import "./styles.css";

export default function List() {
  const buttonRef = useRef(null);
  const closeRef = useRef(null);
  const [dialog, setDialog] = useState({
    title: "teste",
    message: "teste"
  });
  const [entities, setEntities] = useState([]);
  const [type, setType] = useState("");

  async function handleSearch() {
    if (type === "") {
      alert("Please, you need to write a type to search for it first!");
    } else {
      const { data } = await api.get(`/v2/entities?type=${type}&limit=1000`);
      if (data.length === 0) {
        setDialog({
          message: "The entity type specified doesn´t exist!",
          isOpen: true,
          title: "ERROR"
        });
        buttonRef.current.TriggerEl.click();
        closeRef.current.focus();
      } else {
        setEntities(data);
      }
      console.log(data);
    }
  }

  return (
    <>
      <Header />
      <Modal
        closeRef={closeRef}
        ref={buttonRef}
        title={dialog.title}
        message={dialog.message}
      />

      <div className="search-container">
        <button onClick={handleSearch} className="btn-search">
          <SearchIcon />
        </button>

        <div className="input-block">
          <input
            value={type}
            onChange={e => setType(e.target.value)}
            onKeyPress={e => {
              if (e.which === 13) {
                return handleSearch();
              }
            }}
            placeholder="Search here by the type of an entity..."
            type="text"
          />
        </div>
      </div>
      <div className="list-container">
        {entities.map(entity => (
          <div key={entity.id} className="entity-block">
            <p>
              <span>id:</span> {entity.id}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
