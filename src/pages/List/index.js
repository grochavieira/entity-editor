import React, { useState, useRef } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { MdDelete } from "react-icons/md";
import { MdUpdate } from "react-icons/md";
import { useHistory } from "react-router-dom";

import Header from "../../components/Header";
import api from "../../services/api";

import "./styles.css";

export default function List() {
  const [entities, setEntities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [on, setOn] = useState({
    byId: "on",
    byType: ""
  });

  const history = useHistory();

  async function handleSearch(search) {
    if (search === "") {
      alert("Please, you need to write a type to search for it first!");
    } else {
      if (on.byId === "on") {
        try {
          const { data } = await api.get(`/v2/entities/urn:ngsi-ld:${search}`);
          const aux = [];
          aux.push(data);
          setEntities(aux);
          console.log(data);
          setSearchText("");
        } catch (error) {
          alert("The entity id specified doesn´t exist!");
        }
      } else {
        const { data } = await api.get(
          `/v2/entities?type=${search}&limit=1000`
        );
        if (data.length === 0) {
          alert("The entity type specified doesn´t exist!");
        } else {
          setEntities(data);
          setLastSearch(search);
          setSearchText("");
        }
      }
    }
  }

  function changeSearch(search) {
    if (search === "id") {
      setOn({ byId: "on", byType: "" });
    } else {
      setOn({ byId: "", byType: "on" });
    }
  }

  function countRelationship(entity) {
    const keys = Object.keys(entity);

    let count = 0;

    for (let key of keys) {
      if (key.startsWith("ref")) {
        count++;
      }
    }

    return count;
  }

  async function handleDeleteAnswer(entity) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entity"
    );
    if (confirmed) {
      handleDelete(entity);
    }
  }

  async function handleDelete(entity) {
    console.log(entity);

    const delRelationshipsId = [];
    let delEntityId = entity.id;
    let delEntityType = entity.type;
    for (let attributes in entity) {
      if (attributes.startsWith("ref")) {
        delRelationshipsId.push(entity[attributes].value);
      }
    }

    const response = await api.delete(`/v2/entities/${delEntityId}`);
    console.log("RESPONSE: ", response);

    let delEntities = [];
    if (delRelationshipsId.length > 0) {
      for (let index in delRelationshipsId) {
        try {
          const { data } = await api.get(
            `/v2/entities/${delRelationshipsId[index]}`
          );
          delEntities.push(data);
        } catch (err) {
          console.log(err);
        }
      }
    }

    delEntities.map(async entity => {
      try {
        await api.delete(`/v2/entities/${entity.id}/attrs/ref${delEntityType}`);
      } catch (err) {
        console.log(err);
      }
    });

    if (entities.length === 1) {
      setEntities([]);
    } else handleSearch(lastSearch);
  }

  function navigateUpdateScreen(entity) {
    localStorage.setItem("entityId", entity.id);
    history.push("/update");
  }

  return (
    <>
      <Header list={"current"} />
      <div className="search-container">
        <div className="explanation-block">
          <p>
            Choose the type of search you want to do by pressing one of the
            following buttons, where the <b>SEARCH BY ID</b> button can be
            pressed to search an entity by his <b>id</b> like this
            "type:number", and in the <b>SEARCH BY TYPE</b> button you can just
            enter the type of an entity and it will search for all the entities
            of that type.
          </p>
        </div>

        <div className="option-search-block">
          <div>
            <button
              onClick={() => changeSearch("id")}
              className={`btn-id ${on.byId}`}
            >
              <span>Search by ID</span>
            </button>
          </div>
          <div>
            <button
              onClick={() => changeSearch("type")}
              className={`btn-type ${on.byType}`}
            >
              <span>Search by Type</span>
            </button>
          </div>
        </div>

        <div className="search-block">
          <button
            onClick={() => handleSearch(searchText)}
            className="btn-search"
          >
            <SearchIcon fontSize="inherit" />
          </button>

          <div className="input-block">
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={e => {
                if (e.which === 13) {
                  return handleSearch(searchText);
                }
              }}
              placeholder="Search here for created entities..."
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="list-container">
        {entities.map(entity => (
          <div key={entity.id} className="entity-block">
            <p>
              <span>Id:</span> {entity.id}
            </p>

            <p>
              <span>Total Attributes: </span> {Object.keys(entity).length - 2}
            </p>

            <p>
              <span>Total Relationships: </span> {countRelationship(entity)}
            </p>

            <div className="action-buttons-block">
              <div className="update-block">
                <button
                  onClick={() => navigateUpdateScreen(entity)}
                  className="btn-style"
                >
                  <MdUpdate size={20} color="#3311ff" />
                </button>
              </div>

              <div className="delete-block">
                <button
                  className="btn-style"
                  onClick={() => handleDeleteAnswer(entity)}
                >
                  <MdDelete size={20} color="#ff3333" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
