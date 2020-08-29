import React, { useState, useRef } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { FiRefreshCcw, FiTrash2, FiArrowRight } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Pagination from "../../components/Pagination";
import api from "../../services/api";

import "./styles.css";

export default function List() {
  const [doneSearch, setDoneSearch] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(
    "Ex: SoilProbe:1 or ManagementZone:20"
  );
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
  const [listingAll, setListingAll] = useState(false);

  // Reset the search and related variables
  function reset() {
    setTotalEntities(0);
    setCurrentPage(1);
    setDoneSearch(false);
    setEntities([]);
  }

  // Search and return the specified entities from mongo DB
  async function handleSearch(search) {
    setListingAll(false);
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

  // Change the page for the rendered entities
  async function changePage(pageNumber) {
    setCurrentPage(pageNumber);
    const offset = pageNumber * entitiesPerPage - entitiesPerPage;
    if (listingAll) {
      const { data } = await api.get(
        `/v2/entities?offset=${offset}&limit=${entitiesPerPage}`
      );
      setEntities(data);
    } else {
      let { data } = await api.get(
        `/v2/entities?type=${lastSearch}&offset=${offset}&limit=${entitiesPerPage}`
      );
      setEntities(data);
    }
  }

  // Go back to the previous page in the pagination
  function goBack() {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      changePage(previousPage);
    }
    window.scrollTo(0, 0);
  }

  // Go forward to the next page in the pagination
  function goForward() {
    if (currentPage < Math.ceil(totalEntities / entitiesPerPage)) {
      const nextPage = currentPage + 1;
      changePage(nextPage);
    }
    window.scrollTo(0, 0);
  }

  // Change the search to id or to a specified entity type
  function changeSearch(search) {
    if (search === "id") {
      setOn({ byId: "on", byType: "" });
      setPlaceholderText("Ex: SoilProbe:1 or ManagementZone:20");
    } else {
      setOn({ byId: "", byType: "on" });
      setPlaceholderText("Ex: SoilProbe or ManagementZone");
    }
  }

  // Ask for permission to delete the selected entity
  async function handleDeleteAnswer(entity) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entity"
    );
    if (confirmed) {
      handleDelete(entity);
    }
  }

  // Delete the entity and update the relationship attribute
  // of its related entities
  async function handleDelete(entity) {
    const delRelationshipsId = [];
    let delEntityId = entity.id;
    let delEntityType = entity.type;
    for (let attributes in entity) {
      if (attributes.startsWith("ref")) {
        delRelationshipsId.push(entity[attributes].value);
      }
    }

    await api.delete(`/v2/entities/${delEntityId}`);

    let delEntities = [];
    if (delRelationshipsId.length > 0) {
      delEntities = await searchDeletedRelationships(delRelationshipsId);
    }

    // delete the relationship of the related entities
    delEntities.map(async (relationship) => {
      try {
        let firstMethod = true;
        const index = relationship[`ref${entity.type}`].value.indexOf(
          entity.id
        );
        if (relationship[`ref${entity.type}`].value.length > 1) {
          relationship[`ref${entity.type}`].value.splice(index, 1);
        } else {
          firstMethod = false;
          delete relationship[`ref${entity.type}`];
        }

        const id = relationship.id;
        delete relationship.id;
        delete relationship.type;

        if (firstMethod) {
          await api.put(`v2/entities/${id}/attrs`, relationship);
        } else {
          await api.delete(`/v2/entities/${id}/attrs/ref${delEntityType}`);
        }
      } catch (err) {
        console.log(err);
      }
    });

    if (entities.length === 1) {
      setEntities([]);
    } else {
      if (listingAll) {
        listAll();
      } else {
        handleSearch(lastSearch);
      }
    }
  }

  async function searchDeletedRelationships(delRelationshipsId) {
    let delEntities = [];
    for (let index in delRelationshipsId) {
      for (let subIndex in delRelationshipsId[index]) {
        try {
          const { data } = await api.get(
            `/v2/entities/${delRelationshipsId[index][subIndex]}`
          );
          delEntities.push(data);
        } catch (err) {
          console.log(err);
        }
      }
    }
    return delEntities;
  }

  // Go forward to the update page
  function navigateUpdateScreen(entity) {
    localStorage.setItem("entityId", entity.id);
    history.push("/update");
  }

  // List all the available entities in the database
  async function listAll() {
    setListingAll(true);
    const response = await api.get(
      `/v2/entities?offset=0&limit=${entitiesPerPage}&options=count`
    );
    const { data } = response;
    setTotalEntities(response.headers["fiware-total-count"]);
    if (data.length === 0) {
      alert("Sorry, but there are no entities created in the database!");
    } else {
      setEntities(data);
      setLastSearch("");
      setCurrentPage(1);
      setDoneSearch(true);
    }
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
          <div>
            <button onClick={() => listAll()} className={`btn-all`}>
              <span>List All Entities</span>
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
              placeholder={placeholderText}
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
            <p className="list-attribute">
              <span>Id:</span> {entity.id}
            </p>
            <p className="list-attribute">
              <span>Total Attributes: </span> {Object.keys(entity).length - 2}
            </p>

            {Object.keys(entity).includes("refSoilProbe") ||
            Object.keys(entity).includes("refManagementZone") ||
            Object.keys(entity).includes("refFarm") ||
            Object.keys(entity).includes("refFarmer") ? (
              <div className="show-relationship">
                <span>Relationships: </span>
                {Object.keys(entity).map((key) => {
                  if (key.startsWith("ref")) {
                    return (
                      <p className="relationship-count" key={key}>
                        <FiArrowRight color="#333" size={16} />
                        <span>{`${key}: `}</span>
                        {entity[key].value.length}
                      </p>
                    );
                  } else {
                    return;
                  }
                })}
              </div>
            ) : (
              <div className="show-relationship">
                <p>
                  <b>This entity has no relationships.</b>
                </p>
              </div>
            )}

            <div className="action-block">
              <button
                className="update"
                onClick={() => navigateUpdateScreen(entity)}
              >
                <FiRefreshCcw size={20} color="#fff" /> <span>Update</span>
              </button>

              <button
                className="delete"
                onClick={() => handleDeleteAnswer(entity)}
              >
                <FiTrash2 size={20} color="#fff" /> <span>Delete</span>
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
