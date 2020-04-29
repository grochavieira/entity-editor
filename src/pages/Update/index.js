import React, { useState, useEffect } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import { FiTrash2 } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import Input from "../../components/Input";
import Select from "../../components/Select";
import api from "../../services/api";

import "./styles.css";

export default function Update() {
  const [entity, setEntity] = useState({});
  const [entities, setEntities] = useState([]);
  const [originalAttributes, setOriginalAttributes] = useState([]);

  const [type, setType] = useState();

  const [newAttribute, setNewAttribute] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [numOfAttributes, setNumOfAttributes] = useState();

  const [newRelationship, setNewRelationship] = useState("");
  const [relationships, setRelationships] = useState([]);

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
    let relationshipsArray = [];
    let originalArray = [];
    let count = -2;
    for (let property in data) {
      if (property.startsWith("ref")) {
        let object = {
          id: data[property].value,
          type: property.slice(3),
        };
        originalArray.push(`ref${object.type}`);
        object.type = object.type.replace(/[0-9]/g, "");
        relationshipsArray.push(object);
      } else if (count >= 0) {
        let sumOfAttributes = count + 1;
        let object = {
          id: sumOfAttributes,
          name: property,
        };

        originalArray.push(object.name);
        attributesArray.push(object);
      }
      count++;
    }
    setAttributes(attributesArray);
    setNumOfAttributes(count);
    setRelationships(relationshipsArray);
    setOriginalAttributes(originalArray);
  }

  // Load all entities in the database
  async function loadEntities() {
    const { data } = await api.get(`/v2/entities?limit=1000`);

    setEntities(data);
  }

  useEffect(() => {
    loadEntities();
    loadSelectedEntity();
  }, []);

  // Add a temporary attribute for the entity
  const addNewAttribute = (newAttribute) => {
    if (newAttribute !== "") {
      let sumOfAttributes = numOfAttributes + 1;
      setNumOfAttributes(sumOfAttributes);
      let object = {
        id: sumOfAttributes,
        name: newAttribute,
      };
      setAttributes([...attributes, object]);
    } else {
      alert("Please, type the attribute name to create a new attribute!");
    }
    setNewAttribute("");
    console.table(attributes);
  };

  // Delete the temporary attribute created for the entity
  const deleteAttribute = (id) => {
    if (attributes.length >= 1) {
      const newAttributes = attributes.filter(
        (attribute) => attribute.id !== id
      );
      setAttributes(newAttributes);
    }
  };

  // checks whether the entity to be created can relate to the specified entity
  function validateRelationship() {
    if (newRelationship === "") {
      alert("Please type a valid entity to create a new relationship!");
      return false;
    }

    let acceptableEntities = [];
    for (let object of selectBoxEntityTypeItems) {
      if (type === object.value) {
        acceptableEntities = object.acceptableEntities;
      }
    }
    const str = newRelationship.split(":");
    const entityType = str[0];
    const entityId = str[1];
    let canRelate = false;
    let maxRelationship = false;
    let alreadyAlerted = false;

    for (let i = 0; i < acceptableEntities.length; i++) {
      const acceptableEntity = acceptableEntities[i];
      if (entityType === acceptableEntity[0]) {
        if (acceptableEntity[1] === -1) {
          const sumOfEntities = entities.filter((entity) => {
            if (
              entity.type === type &&
              `ref${entityType}${entityId}` in entity &&
              entity[`ref${entityType}${entityId}`].value ===
                `urn:ngsi-ld:${newRelationship}`
            ) {
              return entity;
            }
          });
          if (sumOfEntities.length > 0) {
            canRelate = false;
          } else {
            canRelate = true;
          }
        } else {
          const sumOfTypes = relationships.map(
            (relationship) => relationship.type === entityType
          );
          if (sumOfTypes.length === 0) {
            canRelate = true;
          } else {
            alert("you have already added the maximum limit for that entity");
            canRelate = false;
            maxRelationship = true;
            alreadyAlerted = true;
          }
        }
      }
    }
    if (!canRelate && !maxRelationship) {
      let hasAttribute = originalAttributes.filter((attribute) => {
        return attribute === `ref${entityType}${entityId}`;
      });
      let hasRelationship = relationships.filter((relationship) => {
        return relationship.id === `urn:ngsi-ld:${entityType}:${entityId}`;
      });
      if (hasAttribute.length === 1 && hasRelationship.length === 0) {
        canRelate = true;
      } else {
        alert("The entity specified is already related to another entity");
      }
    } else if (!alreadyAlerted && !canRelate) {
      alert(
        "Sorry, but this entity can´t create a relationship with the specified type!"
      );
    }
    return canRelate;
  }

  // Create a temporary relationship for the entity
  const addNewRelationship = () => {
    const canRelate = validateRelationship();
    if (canRelate) {
      const entitiesId = entities.map((entity) => entity.id);
      const indexId = entitiesId.indexOf(`urn:ngsi-ld:${newRelationship}`);
      if (indexId !== -1) {
        let object = entities[indexId];
        const newEntities = entities.filter(
          (entity) => entity.id !== entities[indexId].id
        );
        setEntities(newEntities);
        setRelationships([...relationships, object]);
        setNewRelationship("");
      } else {
        alert("The entity id specified does not exist!");
      }
    }
  };

  // Delete the temporary relationship created for the entity
  const deleteRelationship = (id) => {
    const removedEntity = relationships.find(
      (relationship) => relationship.id === id
    );
    const newRelationships = relationships.filter(
      (relationship) => relationship.id !== id
    );
    setRelationships(newRelationships);
    setEntities([...entities, removedEntity]);
  };

  // Update the entity and the relationship attribute
  // of its related entities
  async function handleSubmit(updatedEntity) {
    const copyRelationships = relationships;
    let error = false;

    let entitiesId = [];
    for (let property in entity) {
      if (property.startsWith("ref")) {
        entitiesId.push(entity[property].value);
      }
    }

    const delRelationships = relationships.map((relationship) => {
      if (entitiesId !== relationship.id) {
        return relationship.id;
      }
    });

    if (delRelationships.length !== entitiesId.length) {
      entitiesId.map(async (id) => {
        if (delRelationships.indexOf(id) === -1) {
          await api.delete(
            `/v2/entities/${id}/attrs/ref${entity.type}${
              entity.id.split(":")[3]
            }`
          );
        }
      });
    }

    if (copyRelationships.length !== 0) {
      relationships.map(async (relationship) => {
        relationship[`ref${type}${entityId.split(":")[3]}`] = {
          type: "Relationship",
          value: entityId,
        };
        const id = relationship.id;

        delete relationship.id;
        delete relationship.type;

        await api.put(`v2/entities/${id}/attrs`, relationship);
      });
    }

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

  return (
    <>
      <div className="update-container">
        <div className="header-title-block">
          <p>Update Entity Form</p>
        </div>
        <div className="update-form-block">
          <Form onSubmit={handleSubmit}>
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
                        defaultValue={{ value: "Text", label: "Text" }}
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
              <Input
                form=""
                name="attributes"
                field="new relationship"
                type="text"
                value={newRelationship}
                onChange={(e) => setNewRelationship(e.target.value)}
                onKeyPress={(e) => {
                  if (e.which === 13) return addNewRelationship();
                }}
                required
              />

              <button
                className="btn-style btn-add"
                onClick={addNewRelationship}
                type="button"
              >
                Add New Relationship
              </button>
            </div>

            {relationships.map((relationship) => (
              <Scope
                key={relationship.id}
                path={`ref${relationship.type}${relationship.id.split(":")[3]}`}
              >
                <div className="attributes-container">
                  <span className="attribute-title">{`ref${relationship.type}${
                    relationship.id.split(":")[3]
                  }`}</span>

                  <div className="attributes-block relate">
                    <div className="relationship-block">
                      <span>value: </span>

                      <div className="relationship-box">
                        <div className="relationship-value">
                          <Input
                            name="type"
                            value="Relationship"
                            onChange={() => {}}
                            invisible={true}
                          />
                          <Input
                            name="value"
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
                          onClick={() => deleteRelationship(relationship.id)}
                          type="button"
                        >
                          <span>
                            <FiTrash2 size={20} color="#333" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Scope>
            ))}

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
