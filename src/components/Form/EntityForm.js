import React, { useRef, useState } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import ReactSelect from "react-select";

import "./EntityForm.css";

// import * as Yup from "yup";
import Input from "../CustomInput/Input";
import Select from "../SelectBox/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function EntityForm() {
  // const formRef = useRef(null);

  const [type, setType] = useState("");
  const [newAttribute, setNewAttribute] = useState("");
  const [entity, setEntity] = useState({});
  const [numOfAttributes, setNumOfAttributes] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [selectedObject, setSelectedObject] = useState({
    value: "devices",
    label: "devices"
  });

  // initial value for the type Select
  const [selectedType, setSelectedType] = useState({
    value: "Prototype",
    label: "Prototype"
  });

  // object types to be selected in the Select
  const objectTypes = [
    {
      value: "devices",
      label: "devices"
    },
    {
      value: "farmer",
      label: "farmer"
    },
    {
      value: "farm",
      label: "farm"
    },
    {
      value: "management_zone",
      label: "management_zone"
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

  const management_zone = [
    {
      value: "urn:ngsi-ld:ManagementZone:001",
      label: "urn:ngsi-ld:ManagementZone:001"
    },
    {
      value: "urn:ngsi-ld:ManagementZone:002",
      label: "urn:ngsi-ld:ManagementZone:002"
    },
    {
      value: "urn:ngsi-ld:ManagementZone:003",
      label: "urn:ngsi-ld:ManagementZone:003"
    }
  ];

  // create the entity and convert it to JSON file
  async function handleSubmit(data, { reset }) {
    console.log(JSON.stringify(data));
    console.log(data);
    setEntity(data);
    let vetor = [];
    for (let i = 0; i <= 20; i++) {
      vetor[i] = data;
    }

    for (let i = 1; i <= 20; i++) {
      vetor[i].id = `urn:ngsi-ld:${vetor[i].type}:${vetor[i].type}${i}`;
      console.log(vetor[i]);
    }
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
      alert("Please, type the attribute name to create a new attribute!");
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

  function handleObjectChange(selectedOption) {
    setSelectedObject(selectedOption);
  }

  function handleTypeChange(selectedOption) {
    setSelectedType(selectedOption);
  }

  const customSelectObjectStyles = {
    control: base => ({
      ...base,
      height: 25,
      fontSize: 14,
      minHeight: 35,
      borderRadius: 2
    }),
    menu: base => ({
      ...base,
      borderRadius: 2,
      hyphens: "auto",
      marginTop: 0,
      textAlign: "left",
      wordWrap: "break-word"
    }),
    menuList: base => ({
      ...base,
      padding: 0,
      opacity: 1
    })
  };

  return (
    <div className="form-block">
      <div className="header-block">
        <p className="title">Entity Form</p>
      </div>

      <div className="select-box">
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
      </div>

      <Form onSubmit={handleSubmit}>
        <Input
          name="id"
          value={`urn:ngsi-ld:${type}:${type}001`}
          field="id"
          onChange={() => {}}
          required
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
            name="attributes"
            field="new attribute"
            type="text"
            value={newAttribute}
            onChange={e => setNewAttribute(e.target.value)}
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
                <div className="input-block">
                  <Input name={`name`} field="value" required />
                </div>
                <div className="select-box">
                  <label htmlFor="type">type: </label>
                  <Select
                    className="select"
                    name={`type`}
                    width={130}
                    defaultValue={{ value: "Text", label: "Text" }}
                    options={validTypes}
                    onChange={handleTypeChange}
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#15b097",
                        primary: "#333"
                      }
                    })}
                  />
                </div>

                <button
                  className="button style-btn"
                  onClick={() => deleteAttribute(attribute.id)}
                  type="button"
                >
                  <div className="translate"></div>
                  <span>
                    <FontAwesomeIcon icon={faTrash} color="#333" />
                  </span>
                </button>
              </div>
            </div>
          </Scope>
        ))}

        {/* <div className="relationship-block">
          <span>Do you want to create a relationship?</span>
          <div className="select-box">
            <label htmlFor="type">type: </label>
            <Select
              className="select"
              name={`type`}
              options={management_zone}
              onChange={handleTypeChange}
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "#15b097",
                  primary: "#333"
                }
              })}
            />
          </div>
        </div> */}
        <button className="button style-btn" type="submit">
          <div className="translate"></div>
          <span> Create Entity </span>
        </button>
      </Form>
    </div>
  );
}
