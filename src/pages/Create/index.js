import React, { useRef, useState, useEffect } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import ReactSelect from "react-select";
import DeleteIcon from "@material-ui/icons/Delete";

import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Header from "../../components/Header";
import api from "../../services/api";

import "./style.css";

export default function Create() {
  const buttonRef = useRef(null);
  const closeRef = useRef(null);
  const [dialog, setDialog] = useState({
    title: "",
    message: ""
  });

  const [type, setType] = useState("");
  const [newAttribute, setNewAttribute] = useState("");
  const [newRelationship, setNewRelationship] = useState("");
  const [entities, setEntities] = useState([]);
  const [numOfAttributes, setNumOfAttributes] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  // const [selectedObject, setSelectedObject] = useState({
  //   value: "SoilProbe",
  //   acceptableEntities: ["ManagementZone"],
  //   label: "SoilProbe"
  // });

  useEffect(() => {
    async function loadEntities() {
      const { data } = await api.get("/v2/entities?limit=1000");

      setEntities(data);
      console.log(data);
    }

    loadEntities();
  }, []);

  // object types to be selected in the SelectBox
  const objectTypes = [
    {
      value: "SoilProbe",
      acceptableEntities: ["ManagementZone"],
      label: "SoilProbe"
    },
    {
      value: "Farmer",
      acceptableEntities: ["Farm"],
      label: "Farmer"
    },
    {
      value: "Farm",
      acceptableEntities: ["Farmer", "ManagementZone"],
      label: "Farm"
    },
    {
      value: "ManagementZone",
      acceptableEntities: ["Farm", "SoilProbe"],
      label: "ManagementZone"
    }
  ];

  // types that can be selected for each entity attribute
  const validTypes = [
    {
      value: "Number",
      label: "Number"
    },
    {
      value: "Text",
      label: "Text"
    }
  ];

  // create the entity and convert it to JSON file
  async function handleSubmit(entity, { reset }) {
    let error = false;
    const { data } = await api.get(`/v2/entities?type=${type}&limit=100`);
    let newId;
    if (data.length !== 0) {
      let substring = data[data.length - 1].id.split(`urn:ngsi-ld:${type}:`);
      newId = parseInt(substring[1]) + 1;
      console.log(substring[1]);
    } else {
      newId = 1;
    }
    entity.id = `urn:ngsi-ld:${type}:${newId}`;

    if (relationships.length !== 0) {
      relationships.map(async relationship => {
        relationship[`ref${type}`] = {
          type: "Relationship",
          value: entity.id
        };
        const id = relationship.id;
        delete relationship.id;
        delete relationship.type;
        await api.put(`v2/entities/${id}/attrs`, relationship);
      });
    }

    // send the new entity to ORION
    try {
      await api.post("/v2/entities", entity);
    } catch (e) {
      error = true;
      console.log(e);
    }
    if (error) {
      setDialog({
        message: "It was not possible to create a new entity!",
        title: "ERROR"
      });
    } else {
      setDialog({
        message: "Entity created successfully!",
        title: "SUCCESS"
      });
    }
    buttonRef.current.TriggerEl.click();
    closeRef.current.focus();
  }

  const addNewAttribute = () => {
    if (newAttribute !== "") {
      let sumOfAttributes = numOfAttributes + 1;
      setNumOfAttributes(sumOfAttributes);
      let object = {
        id: sumOfAttributes,
        name: newAttribute
      };
      setAttributes([...attributes, object]);
    } else {
      setDialog({
        message: "Please, type the attribute name to create a new attribute!",
        title: "ERROR"
      });
      buttonRef.current.TriggerEl.click();
      closeRef.current.focus();
    }
    setNewAttribute("");
    console.table(attributes);
  };

  const deleteAttribute = id => {
    if (attributes.length >= 1) {
      const newAttributes = attributes.filter(attribute => attribute.id !== id);
      setAttributes(newAttributes);
    }
  };

  const addNewRelationship = () => {
    if (newRelationship !== "") {
      const entitiesId = entities.map(entity => entity.id);
      const indexId = entitiesId.indexOf(`urn:ngsi-ld:${newRelationship}`);
      if (indexId !== -1) {
        // let sumOfRelationships = numOfRelationships + 1;
        // setNumOfRelationships(sumOfRelationships);
        let object = entities[indexId];
        const newEntities = entities.filter(
          entity => entity.id !== entities[indexId].id
        );
        setEntities(newEntities);
        console.log(object);
        setRelationships([...relationships, object]);
        setNewRelationship("");
      } else {
        setDialog({
          message: "The entity id specified does not exist!",
          title: "ERROR"
        });
      }
    } else {
      setDialog({
        message: "Please, type a valid entity id to create a relationship!",
        title: "ERROR"
      });
    }
    buttonRef.current.TriggerEl.click();
    closeRef.current.focus();
  };

  const deleteRelationship = id => {
    const removedEntity = relationships.find(
      relationship => relationship.id === id
    );
    const newRelationships = relationships.filter(
      relationship => relationship.id !== id
    );
    setRelationships(newRelationships);
    setEntities([...entities, removedEntity]);
  };

  // function handleObjectChange(selectedOption) {
  //   setSelectedObject(selectedOption);
  // }

  // const customSelectObjectStyles = {
  //   control: base => ({
  //     ...base,
  //     height: 25,
  //     fontSize: 14,
  //     minHeight: 35,
  //     borderRadius: 2
  //   }),
  //   menu: base => ({
  //     ...base,
  //     borderRadius: 2,
  //     hyphens: "auto",
  //     marginTop: 0,
  //     textAlign: "left",
  //     wordWrap: "break-word"
  //   }),
  //   menuList: base => ({
  //     ...base,
  //     padding: 0,
  //     opacity: 1
  //   })
  // };

  return (
    <>
      <Header />
      <Modal
        closeRef={closeRef}
        ref={buttonRef}
        title={dialog.title}
        message={dialog.message}
      />
      <main>
        <div className="form-block">
          <div className="header-block">
            <p className="title">Entity Form</p>
          </div>

          {/* <div className="select-box">
            <label htmlFor="object-type">Select the Object Type: </label>
            <ReactSelect
              name="name"
              id="object-type"
              value={selectedObject}
              onChange={handleObjectChange}
              options={objectTypes}
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "#15b097",
                  primary: "#333"
                }
              })}
              styles={customSelectObjectStyles}
            />
          </div> */}

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
              onChange={e => setType(e.target.value)}
              field="type"
              name="type"
              required
            />

            <div className="attributes-header-block">
              <Input
                form=""
                name="attributes"
                field="new attribute"
                type="text"
                value={newAttribute}
                onChange={e => setNewAttribute(e.target.value)}
                onKeyPress={e => {
                  if (e.which === 13) return addNewAttribute();
                }}
                required
              />

              <button
                className="button style-btn"
                onClick={addNewAttribute}
                type="button"
              >
                <div className="translate"></div>
                <span> Add New Attribute</span>
              </button>
            </div>

            {attributes.map(attribute => (
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
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#15b097",
                            primary: "#333"
                          }
                        })}
                        required={true}
                      />
                    </div>

                    <div className="input-block">
                      <Input name="value" field="value" required />
                    </div>

                    <button
                      className="button style-btn"
                      onClick={() => deleteAttribute(attribute.id)}
                      type="button"
                    >
                      <div className="translate"></div>
                      <span className="trash-icon">
                        <DeleteIcon />
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
                onChange={e => setNewRelationship(e.target.value)}
                onKeyPress={e => {
                  if (e.which === 13) return addNewRelationship();
                }}
                required
              />

              <button
                className="button style-btn"
                onClick={addNewAttribute}
                type="button"
              >
                <div className="translate"></div>
                <span> Add New Relationship</span>
              </button>
            </div>

            {relationships.map(relationship => (
              <Scope key={relationship.id} path={`ref${relationship.type}`}>
                <div className="attributes-container">
                  <span className="attribute-title">{`ref${relationship.type}`}</span>

                  <div className="attributes-block relate">
                    <div className="relationship-block">
                      <span>value: </span>

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
                    </div>
                    <button
                      className="button style-btn relate-btn"
                      onClick={() => deleteRelationship(relationship.id)}
                      type="button"
                    >
                      <div className="translate"></div>
                      <span className="trash-icon">
                        <DeleteIcon />
                      </span>
                    </button>
                  </div>
                </div>
              </Scope>
            ))}

            <button className="button style-btn" type="submit">
              <div className="translate"></div>
              <span> Create Entity </span>
            </button>
          </Form>
        </div>
      </main>
    </>
  );
}
