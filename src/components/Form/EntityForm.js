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

  const [entity, setEntity] = useState({});
  const [numOfAttributes, setNumOfAttributes] = useState(0);
  const [attributesId, setAttributesId] = useState([0]);
  const [selectedObject, setSelectedObject] = useState({
    value: "devices",
    label: "devices"
  });

  // initial value for the type Select
  const [selectedType, setSelectedType] = useState({
    value: "Number",
    label: "Number"
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
      value: "Float",
      label: "Float"
    },
    {
      value: "Double",
      label: "Double"
    }
  ];

  // when a object type is selected, the form will change dinamically
  // with the folowwing attributes
  const formFields = {
    devices: ["device_id", "entity_name", "entity_type"],
    farmer: ["id", "name"],
    farm: ["id", "name"],
    management_zone: ["id", "name"]
  };

  // create the entity and convert it to JSON file
  async function handleSubmit(data, { reset }) {
    console.log(JSON.stringify(data));
    setEntity(data);
  }

  const addNewAttribute = () => {
    let sumOfAttributes = numOfAttributes + 1;
    setNumOfAttributes(sumOfAttributes);
    setAttributesId([...attributesId, sumOfAttributes]);
  };

  const deleteAttribute = () => {
    if (attributesId.length >= 1) {
      const newAttributes = attributesId.filter(
        attributeId => attributeId !== attributesId.length - 1
      );
      setAttributesId(newAttributes);
      let descreasedAttributes = numOfAttributes - 1;
      setNumOfAttributes(descreasedAttributes);
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
        <Scope path={selectedObject.value}>
          {formFields[selectedObject.value].map(field => (
            <Input key={field} field={field} name={field} required />
          ))}

          <div className="attributes-header-block">
            <p>Attributes</p>

            <button
              type="button"
              onClick={addNewAttribute}
              className="plus-btn"
            >
              <span className="tooltip">Add a new attribute</span>+
            </button>

            <button
              type="button"
              onClick={deleteAttribute}
              className="trash-btn"
            >
              <span className="tooltip">Delete the last attribute</span>
              <FontAwesomeIcon icon={faTrash} color="#333" />
            </button>
          </div>

          {attributesId.map(attributeId => (
            <div key={attributeId} className="attributes-block">
              <div className="input-block">
                <Input
                  name={`attributes[${attributeId}].name`}
                  field="name"
                  required
                />
              </div>
              <div className="select-box">
                <label htmlFor="type">type: </label>
                <Select
                  className="select"
                  name={`attributes[${attributeId}].type`}
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
            </div>
          ))}
        </Scope>
        <button className="button" id="submit-btn" type="submit">
          <div className="translate"></div>
          <span> Create Entity </span>
        </button>
      </Form>
    </div>
  );
}
