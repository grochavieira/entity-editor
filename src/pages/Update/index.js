import React, { useState, useEffect } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import { FiTrash2 } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import ReactSelect from "react-select";

import Input from "../../components/Input";
import Select from "../../components/Select";
import api from "../../services/api";

import "./styles.css";

export default function Update() {
  const [entity, setEntity] = useState({});
  const [entities, setEntities] = useState([]);
  const [originalAttributes, setOriginalAttributes] = useState([]);
  const [unselectableAttributes, setUnselectableAttributes] = useState([
    "",
    "value",
    "label",
    "id",
    "type",
  ]);

  const [type, setType] = useState("");

  const [newAttribute, setNewAttribute] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [numOfAttributes, setNumOfAttributes] = useState();

  const [newRelationship, setNewRelationship] = useState({
    value: "",
    label: "Select...",
  });
  const [relationships, setRelationships] = useState({
    refSoilProbe: [],
    refManagementZone: [],
    refFarm: [],
    refFarmer: [],
  });
  const [selectRelationshipItems, setSelectRelationshipItems] = useState([]);

  const entityId = localStorage.getItem("entityId");
  const validTypes = [
    { value: "Text", label: "Text" },
    { value: "Number", label: "Number" },
  ];

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

  const history = useHistory();

  // Load all the properties of the entity selected for update
  async function loadSelectedEntity() {
    const { data } = await api.get(`/v2/entities/${entityId}`);

    setEntity(data);
    setType(data.type);

    let attributesArray = [];
    let relationshipsArray = {
      refSoilProbe: [],
      refManagementZone: [],
      refFarm: [],
      refFarmer: [],
    };
    let originalArray = [];
    let tempArray = {
      refSoilProbe: [],
      refManagementZone: [],
      refFarm: [],
      refFarmer: [],
    };
    let count = -2;
    for (let property in data) {
      if (property.startsWith("ref")) {
        let object = {
          id: data[property].value,
          type: property.slice(3),
        };
        originalArray.push(`ref${object.type}`);
        object.type = object.type.replace(/[0-9]/g, "");
        tempArray[`ref${object.type}`] = [...data[property].value];
        relationshipsArray[`ref${object.type}`] = data[property].value.map(
          (item) => (object = { id: item })
        );
      } else if (count >= 0) {
        let sumOfAttributes = count + 1;
        let object = {
          id: sumOfAttributes,
          name: property,
          value: data[property].value,
          type: {
            value: data[property].type,
            label: data[property].type,
          },
        };
        unselectableAttributes.push(property);
        originalArray.push(object.name);
        attributesArray.push(object);
      }
      count++;
    }
    setAttributes(attributesArray);
    setNumOfAttributes(count);
    setRelationships(relationshipsArray);
    setOriginalAttributes(originalArray);
    await loadSelectItems(tempArray);
  }

  // Load all entities in the database
  async function loadEntities() {
    const { data } = await api.get(`/v2/entities?limit=1000`);

    setEntities(data);
  }

  async function loadSelectItems(tempArray) {
    const aux = await api.get(`/v2/entities/${entityId}`);
    let { data } = await api.get("/v2/entities?limit=1000");

    let select = [];
    for (let object of selectBoxEntityTypeItems) {
      if (aux.data.type === object.value) {
        select = object;
      }
    }
    select.acceptableEntities.map((accept) => {
      data = data.map((item) => {
        if (
          (accept[1] === 1 && item.type === `${accept[0]}`) ||
          (accept[1] === -1 &&
            !(`ref${select.value}` in item) &&
            item.type === `${accept[0]}`)
        ) {
          if (!tempArray[`ref${item.type}`].includes(item.id)) {
            const value = item.id;
            const label = item.id.split("urn:ngsi-ld:")[1];
            const object = {
              value: value,
              label: label,
            };
            return object;
          }
        }

        return item;
      });
    });

    data = data.filter((item) => item.hasOwnProperty("label"));

    setSelectRelationshipItems(data);
  }

  useEffect(() => {
    loadEntities();
    loadSelectedEntity();
  }, []);

  // Add a temporary attribute for the entity
  const addNewAttribute = (newAttribute) => {
    if (unselectableAttributes.indexOf(newAttribute) === -1) {
      let sumOfAttributes = numOfAttributes + 1;
      setNumOfAttributes(sumOfAttributes);
      let object = {
        id: sumOfAttributes,
        name: newAttribute,
        type: {
          value: "Text",
          label: "Text"
        }
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

  // Delete the temporary attribute created for the entity
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
      let select = [];
      for (let object of selectBoxEntityTypeItems) {
        if (type === object.value) {
          select = object;
        }
      }
      for (let i = 0; i < select.acceptableEntities.length; i++) {
        if (
          select.acceptableEntities[i][1] === 1 &&
          select.acceptableEntities[i][0] === entityType
        ) {
          if (
            relationships[`ref${select.acceptableEntities[i][0]}`].length !== 0
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
    if (removedEntity.hasOwnProperty("type")) {
      setEntities([...entities, removedEntity]);
    }
    setSelectRelationshipItems([...selectRelationshipItems, newObject]);
  };

  // Update the entity and the relationship attribute
  // of its related entities
  async function handleUpdate(updatedEntity) {
    updatedEntity = convertValues(updatedEntity);
    const copyRelationships = { ...relationships };
    let error = false;
    let entitiesId = [];

    for (let property in entity) {
      if (property.startsWith("ref")) {
        entitiesId = [...entitiesId, ...entity[property].value];
      }
    }

    let tempRelationships = [
      ...relationships["refSoilProbe"],
      ...relationships["refFarm"],
      ...relationships["refFarmer"],
      ...relationships["refManagementZone"],
    ];

    tempRelationships = tempRelationships.map((item) => item.id);

    let delRelationships = entitiesId.map((entity) => {
      if (!tempRelationships.includes(entity)) {
        return entity;
      } else {
        return 0;
      }
    });

    delRelationships = delRelationships.filter((item) => item !== 0);

    let toBeDeleted = [];
    let entityType = type;

    if (delRelationships.length > 0) {
      toBeDeleted = searchDeletedRelationships(delRelationships);
      await deletePreviousRelationships(toBeDeleted, entityType);
    }

    await updateRelatedEntities(copyRelationships);

    try {
      if (Object.keys(updatedEntity).length > 0) {
        await api.put(`/v2/entities/${entityId}/attrs`, updatedEntity);
      } else {
        for (let attribute of originalAttributes) {
          await api.delete(`/v2/entities/${entityId}/attrs/${attribute}`);
        }
      }
      history.goBack();
    } catch (e) {
      error = true;
      console.log(e);
    }
    if (error) {
      alert("It was not possible to update the entity!");
    } else {
      alert("Entity updated successfully!");
    }
  }

  function convertValues(updatedEntity) {
    console.log("Antes");
    console.log(updatedEntity);
    for (let key in updatedEntity) {
      if (key !== "id" && key !== "type" && !key.startsWith("ref")) {
        if (updatedEntity[key].type === "Number") {
          const regex = /^[0-9\b]+.+[0-9\b]$/;

          if (
            updatedEntity[key].value === "" ||
            regex.test(updatedEntity[key].value)
          ) {
            updatedEntity[key].value = parseFloat(updatedEntity[key].value);
          } else {
            updatedEntity[key].value = 0;
          }
        }
      }
    }
    console.log("Depois");
    console.log(updatedEntity);

    return updatedEntity;
  }

  function searchDeletedRelationships(delRelationships) {
    let toBeDeleted = [];
    for (let object of entities) {
      if (delRelationships.includes(object.id)) {
        toBeDeleted.push(object);
      }
    }
    return toBeDeleted;
  }

  async function updateRelatedEntities(copyRelationships) {
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
  }

  async function deletePreviousRelationships(toBeDeleted, entityType) {
    toBeDeleted.map(async (relationship) => {
      try {
        let firstMethod = true;
        const index = relationship[`ref${entityType}`].value.indexOf(entityId);
        if (relationship[`ref${entityType}`].value.length > 1) {
          relationship[`ref${entityType}`].value.splice(index, 1);
        } else {
          firstMethod = false;
          delete relationship[`ref${entityType}`];
        }

        const id = relationship.id;
        const type = relationship.type;
        delete relationship.id;
        delete relationship.type;

        if (firstMethod) {
          await api.put(`v2/entities/${id}/attrs`, relationship);
        } else {
          await api.delete(`/v2/entities/${id}/attrs/ref${entityType}`);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  // style for the entity type select box
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
      <div className="update-container">
        <div className="header-title-block">
          <p>Update Entity Form</p>
        </div>
        <div className="update-form-block">
          <Form onSubmit={handleUpdate}>
            <div className="property-block">
              <p>
                <b>id: </b>
                {entity.id}
              </p>
            </div>

            <div className="property-block">
              <p>
                <b>type: </b>
                {entity.type}
              </p>
            </div>

            <div className="attributes-header-block">
              <Input
                form=""
                name="attributes"
                field="new attribute"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                onKeyPress={(e) => {
                  if (e.which === 13) return addNewAttribute(newAttribute);
                }}
                required
              />

              <button
                className="btn-style btn-add"
                onClick={() => addNewAttribute(newAttribute)}
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
                        defaultValue={attribute.type}
                        options={validTypes}
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
                      <Input
                        defaultValue={attribute.value}
                        name="value"
                        field="value"
                        required
                      />
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

            <div className="update-block">
              <button className="btn-style" type="submit">
                Atualizar
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
