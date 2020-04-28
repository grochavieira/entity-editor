import React, { useState, useRef } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { FiRefreshCcw, FiTrash2 } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Pagination from "../../components/Pagination";
import api from "../../services/api";

import "./styles.css";

export default function List() {
  const [doneSearch, setDoneSearch] = useState(false);
  const [entities, setEntities] = useState([]);
  const [totalEntities, setTotalEntities] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [on, setOn] = useState({
    byId: "on",
    byType: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entitiesPerPage] = useState(20);

  const history = useHistory();

  function reset() {
    setTotalEntities(0);
    setCurrentPage(1);
    setDoneSearch(false);
    setEntities([]);
  }

  async function handleSearch(search) {
    if (search === "") {
      alert("Please, you need to write a type to search for it first!");
      reset();
    } else {
      if (on.byId === "on") {
        const str = search.split(":");
        let isnum = /^\d+$/.test(str[1]);
        if (isnum) {
          try {
            const { data } = await api.get(
              `/v2/entities/urn:ngsi-ld:${search}`
            );
            const aux = [];
            aux.push(data);
            reset();
            setEntities(aux);
            console.log(data);
            setSearchText("");
          } catch (error) {
            alert("The entity id specified doesn´t exist!");
          }
        } else {
          alert(
            "The search typed does not match the following example -> 'type:number' or 'SoilProbe:1'"
          );
        }
      } else {
        const response = await api.get(
          `/v2/entities?type=${search}&offset=0&limit=${entitiesPerPage}&options=count`
        );
        const { data } = response;
        setTotalEntities(response.headers["fiware-total-count"]);
        console.log(response);
        console.log(data);
        if (data.length === 0) {
          alert("The entity type specified doesn´t exist!");
        } else {
          setEntities(data);
          setLastSearch(search);
          setSearchText("");
          setCurrentPage(1);
          setDoneSearch(true);
        }
      }
    }
  }

  async function changePage(pageNumber) {
    setCurrentPage(pageNumber);
    const offset = pageNumber * entitiesPerPage - entitiesPerPage;
    const { data } = await api.get(
      `/v2/entities?type=${lastSearch}&offset=${offset}&limit=${entitiesPerPage}`
    );
    setEntities(data);
  }

  function goBack() {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      changePage(previousPage);
    }
    window.scrollTo(0, 0);
  }

  function goForward() {
    if (currentPage < Math.ceil(totalEntities / entitiesPerPage)) {
      const nextPage = currentPage + 1;
      changePage(nextPage);
    }
    window.scrollTo(0, 0);
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

    delEntities.map(async (entity) => {
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
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => {
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
      {doneSearch ? (
        <div className="show-total-count">
          <p>
            {doneSearch
              ? `Total Entities Found: ${totalEntities} | Page ${currentPage} of ${Math.ceil(
                  totalEntities / entitiesPerPage
                )}`
              : ""}
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="list-container">
        {entities.map((entity) => (
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

            <div className="action-block">
              <button
                className="update"
                onClick={() => navigateUpdateScreen(entity)}
              >
                <FiRefreshCcw size={20} color="#fff" /> <span>Atualizar</span>
              </button>

              <button
                className="delete"
                onClick={() => handleDeleteAnswer(entity)}
              >
                <FiTrash2 size={20} color="#fff" /> <span>Deletar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalEntities={totalEntities}
        entitiesPerPage={entitiesPerPage}
        goForward={goForward}
        goBack={goBack}
        currentPage={currentPage}
      />
      <Footer />
    </>
  );
}
