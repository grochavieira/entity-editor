import React, { useRef, useState, useEffect } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import ReactSelect from "react-select";
import { FiTrash2 } from "react-icons/fi";

import Input from "../../components/Input";
import Select from "../../components/Select";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import api from "../../services/api";

import "./styles.css";

export default function Create() {
  const [type, setType] = useState("SoilProbe");
  const [newAttribute, setNewAttribute] = useState("");
  const [newRelationship, setNewRelationship] = useState({
    value: "",
    label: "Select...",
  });
  const [entities, setEntities] = useState([]);
  const [numOfAttributes, setNumOfAttributes] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [relationships, setRelationships] = useState({
    refSoilProbe: [],
    refManagementZone: [],
    refFarm: [],
    refFarmer: [],
  });
  const [selectedObject, setSelectedObject] = useState({
    value: "SoilProbe",
    acceptableEntities: [["ManagementZone", 1]],
    label: "SoilProbe",
  });
  const [selectRelationshipItems, setSelectRelationshipItems] = useState([]);
  const [unselectableAttributes, setUnselectableAttributes] = useState([
    "",
    "value",
    "label",
    "id",
    "type",
  ]);

  const selectBoxEntityTypeItems = [
    {
      value: "SoilProbe",
      acceptableEntities: [["ManagementZone", 1]],
      label: "SoilProbe",
    },
    {
      value: "Farmer",
      acceptableEntities: [["Farm", -1]],
      label: "Farmer",
    },
    {
      value: "Farm",
      acceptableEntities: [
        ["Farmer", 1],
        ["ManagementZone", -1],
      ],
      label: "Farm",
    },
    {
      value: "ManagementZone",
      acceptableEntities: [
        ["Farm", 1],
        ["SoilProbe", -1],
      ],
      label: "ManagementZone",
    },
  ];

  const selectBoxTypeItems = [
    {
      value: "Number",
      label: "Number",
    },
    {
      value: "Text",
      label: "Text",
    },
  ];

  // load the entities already created in the mongo db
  async function loadEntities() {
    const { data } = await api.get("/v2/entities?limit=1000");

    setEntities(data);
  }

  async function loadSelectedEntities(select) {
    let { data } = await api.get("/v2/entities?limit=1000");

    select.acceptableEntities.map((accept) => {
      data = data.map((item) => {
        if (
          (accept[1] === 1 && item.type === `${accept[0]}`) ||
          (accept[1] === -1 &&
            !(`ref${select.value}` in item) &&
            item.type === `${accept[0]}`)
        ) {
          const value = item.id;
          const label = item.id.split("urn:ngsi-ld:")[1];
          const object = {
            value: value,
            label: label,
          };

          return object;
        }

        return item;
      });
    });

    data = data.filter((item) => item.hasOwnProperty("label"));

    setSelectRelationshipItems(data);
  }

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    loadSelectedEntities(selectedObject);
  }, [selectedObject]);

  // reset the form and related variables
  function reset() {
    setAttributes([]);
    setNewAttribute("");
    setNumOfAttributes(0);
    setRelationships({
      refSoilProbe: [],
      refManagementZone: [],
      refFarm: [],
      refFarmer: [],
    });
    setNewRelationship({
      value: "",
      label: "Select...",
    });
    loadEntities();
    loadSelectedEntities(selectedObject);
    setUnselectableAttributes(["", "value", "label", "id", "type"]);
  }

  // create the entity and send it to the database
  async function handleSubmit(entity) {
    entity = convertValues(entity);
    const copyRelationships = { ...relationships };
    let error = false;
    const { data } = await api.get(`/v2/entities?type=${type}&limit=1000`);
    let newId;

    // generate an id for the new entity
    if (data.length !== 0) {
      let substring = data[data.length - 1].id.split(`urn:ngsi-ld:${type}:`);
      newId = parseInt(substring[1]) + 1;
    } else {
      newId = 1;
    }

    // update the id of the new entity
    entity.id = `urn:ngsi-ld:${type}:${newId}`;

    // update the related entities
    Object.keys(copyRelationships).map((key) => {
      copyRelationships[key].map(async (relationship) => {
        if (`ref${type}` in relationship) {
          relationship[`ref${type}`].value.push(entity.id);
        } else {
          relationship[`ref${type}`] = {
            type: "Relationship",
            value: [entity.id],
          };
        }

        const id = relationship.id;
        delete relationship.id;
        delete relationship.type;

        await api.put(`v2/entities/${id}/attrs`, relationship);
      });
    });

    // send the new entity to ORION
    try {
      await api.post("/v2/entities", entity);
    } catch (e) {
      error = true;
    }
    if (error) {
      alert("It was not possible to create a new entity!");
    } else {
      alert("Entity created successfully!");
      reset();
    }
  }

  function convertValues(entity) {
    for (let key in entity) {
      if (key !== "id" && key !== "type" && !key.startsWith("ref")) {
        if (entity[key].type === "Number") {
          const regex = /^[0-9\b]+.+[0-9\b]$/;

          if (entity[key].value === "" || regex.test(entity[key].value)) {
            entity[key].value = parseFloat(entity[key].value);
          } else {
            entity[key].value = 0;
          }
        }
      }
    }

    return entity;
  }

  // create a temporary attribute for the entity
  const addNewAttribute = () => {
    if (unselectableAttributes.indexOf(newAttribute) === -1) {
      let sumOfAttributes = numOfAttributes + 1;
      setNumOfAttributes(sumOfAttributes);
      let object = {
        id: sumOfAttributes,
        name: newAttribute,
      };
      setUnselectableAttributes([...unselectableAttributes, newAttribute]);
      setAttributes([...attributes, object]);
    } else {
      alert(
        "Please, type an available attribute name to create a new attribute!"
      );
    }
    setNewAttribute("");
  };

  // delete the entity temporary attribute
  const deleteAttribute = (id) => {
    if (attributes.length >= 1) {
      const newAttributes = attributes.filter(
        (attribute) => attribute.id !== id
      );

      const removedAttribute = attributes.filter(
        (attribute) => attribute.id === id
      );

      let index = unselectableAttributes.indexOf(removedAttribute[0].name);
      unselectableAttributes.splice(index, 1);

      setUnselectableAttributes(unselectableAttributes);
      setAttributes(newAttributes);
    }
  };

  // create a temporary relationship with the entity to be created
  const addNewRelationship = () => {
    if (newRelationship.value !== "") {
      const entityType = newRelationship.label.split(":")[0];
      const entitiesId = entities.map((entity) => entity.id);
      const indexId = entitiesId.indexOf(newRelationship.value);
      let canRelate = true;

      // verify if the selected entity can be related with the entity to be created
      for (let i = 0; i < selectedObject.acceptableEntities.length; i++) {
        if (
          selectedObject.acceptableEntities[i][1] === 1 &&
          selectedObject.acceptableEntities[i][0] === entityType
        ) {
          if (
            relationships[`ref${selectedObject.acceptableEntities[i][0]}`]
              .length !== 0
          ) {
            canRelate = false;
          }
        }
      }
      if (canRelate) {
        let object = relationships;
        object[`ref${entityType}`].push(entities[indexId]);
        const newEntities = entities.filter(
          (entity) => entity.id !== entities[indexId].id
        );
        const newSelectableEntities = selectRelationshipItems.filter(
          (item) => item.value !== newRelationship.value
        );

        setEntities(newEntities);
        setRelationships(object);
        setNewRelationship({
          value: "",
          label: "Select...",
        });
        setSelectRelationshipItems(newSelectableEntities);
      } else {
        alert(
          "You already added the maximum relationships for the specified entity!"
        );
      }
    } else {
      alert(
        "Please, you need to select an available entity to create a relationship!"
      );
    }
  };

  // delete the entity temporary relationship
  const deleteRelationship = (id, type) => {
    let object = relationships;
    const removedEntity = object[type].find(
      (relationship) => relationship.id === id
    );
    object[type] = object[type].filter(
      (relationship) => relationship.id !== id
    );
    let newObject = {
      value: removedEntity.id,
      label: `${removedEntity.id.split("urn:ngsi-ld:")[1]}`,
    };

    setRelationships(object);
    setEntities([...entities, removedEntity]);
    setSelectRelationshipItems([...selectRelationshipItems, newObject]);
  };

  // update the entity type to be created in the select box
  function handleObjectChange(selectedOption) {
    setSelectedObject(selectedOption);
    setType(selectedOption.value);
    reset();
  }

  // style for the select boxes
  const customSelectObjectStyles = {
    control: (base) => ({
      ...base,
      marginTop: 5,
      height: 25,
      fontSize: "1.4rem",
      minHeight: 35,
      borderRadius: 2,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 2,
      hyphens: "auto",
      marginTop: 0,
      textAlign: "left",
      wordWrap: "break-word",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      opacity: 1,
    }),
  };

  return (
    <>
      <Header create={"current"} />
      <main>
        <div className="header-block">
          <p className="title">Entity Form</p>
        </div>
        <div className="form-block">
          <div className="select-box">
            <label htmlFor="object-type">Select the Object Type: </label>
            <ReactSelect
              name="name"
              id="object-type"
              value={selectedObject}
              onChange={handleObjectChange}
              options={selectBoxEntityTypeItems}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "#15b097",
                  primary: "#333",
                },
              })}
              styles={customSelectObjectStyles}
            />
          </div>

          <Form onSubmit={handleSubmit}>
            <Input
              name="id"
              value={`urn:ngsi-ld:${type}:`}
              field="id"
              onChange={() => {}}
              invisible={true}
            />

            <Input
              value={type}
              onChange={() => {}}
              field="type"
              name="type"
              invisible={true}
            />

            <div className="attributes-header-block">
              <Input
                form=""
                name="attributes"
                field="new attribute"
                type="text"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                onKeyPress={(e) => {
                  if (e.which === 13) return addNewAttribute();
                }}
                required
              />

              <button
                className="btn-style btn-add"
                onClick={addNewAttribute}
                type="button"
              >
                Add New Attribute
              </button>
            </div>

            {attributes.map((attribute) => (
              <Scope key={attribute.id} path={attribute.name}>
                <div className="attributes-container">
                  <span className="attribute-title">{attribute.name}</span>

                  <div className="attributes-block">
                    <div className="select-box">
                      <label htmlFor="type">type: </label>
                      <Select
                        className="select"
                        name={`type`}
                        width={130}
                        defaultValue={{ value: "Text", label: "Text" }}
                        options={selectBoxTypeItems}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#15b097",
                            primary: "#333",
                          },
                        })}
                        required={true}
                      />
                    </div>

                    <div className="input-block">
                      <Input name="value" field="value" required />
                    </div>

                    <button
                      className="btn-trash attributes"
                      onClick={() => deleteAttribute(attribute.id)}
                      type="button"
                    >
                      <span>
                        <FiTrash2 size={20} color="#333" />
                      </span>
                    </button>
                  </div>
                </div>
              </Scope>
            ))}

            <div className="attributes-header-block">
              <div className="select-relationship">
                <label htmlFor="relatableEntities">new relationship</label>
                <ReactSelect
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e)}
                  className="select"
                  name="relatableEntities"
                  width={"100%"}
                  options={selectRelationshipItems}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#15b097",
                      primary: "#333",
                    },
                  })}
                  styles={customSelectObjectStyles}
                />
              </div>

              <button
                className="btn-style btn-add btn-relate"
                onClick={addNewRelationship}
                type="button"
              >
                Add New Relationship
              </button>
            </div>

            {Object.keys(relationships).map((key) => {
              if (relationships[key].length === 0) {
                return;
              } else {
                return (
                  <Scope key={key} path={key}>
                    <div className="attributes-container">
                      <span className="attribute-title">{key}</span>
                      <span className="value">value(s) </span>
                      {relationships[key].map((relationship, index) => (
                        <div
                          key={relationship.id}
                          className="attributes-block relate"
                        >
                          <div className="relationship-block">
                            <Input
                              name="type"
                              value="Relationship"
                              onChange={() => {}}
                              invisible={true}
                            />

                            <div className="relationship-box">
                              <div className="relationship-value">
                                <Input
                                  name={`value[${index}]`}
                                  value={relationship.id}
                                  onChange={() => {}}
                                  invisible={true}
                                />
                                <span>
                                  <b>Id:</b> {relationship.id}
                                </span>
                              </div>

                              <button
                                className="btn-trash relate"
                                onClick={() =>
                                  deleteRelationship(relationship.id, key)
                                }
                                type="button"
                              >
                                <span>
                                  <FiTrash2 size={20} color="#333" />
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Scope>
                );
              }
            })}

            <div className="submit-block">
              <button className="btn-style btn-submit" type="submit">
                Create Entity
              </button>
            </div>
          </Form>
        </div>
      </main>
      <Footer />
    </>
  );
}
