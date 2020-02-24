import React, { useRef, useState } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import ReactSelect from "react-select";

import "./App.css";
import "./global.css";
import "./EntityForm.css";

// import * as Yup from "yup";
import Input from "./components/Form/Input";
import Select from "./components/SelectBox/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function App() {
  // const formRef = useRef(null);

  const [entity, setEntity] = useState({});
  const [numOfAttributes, setNumOfAttributes] = useState(0);
  const [attributes, setAttributes] = useState([0]);
  const [selectedEntity, setSelectedEntity] = useState({
    value: "devices",
    label: "devices"
  });
  const [selectedType, setSelectedType] = useState({
    value: "Number",
    label: "Number"
  });

  const entityTypes = [
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

  const formFields = {
    devices: ["id", "name", "type"],
    farmer: ["id", "name"],
    farm: ["id", "name"],
    management_zone: ["id", "name"]
  };

  async function handleSubmit(data, { reset }) {
    console.log(JSON.stringify(data));
    setEntity(data);
  }

  function addNewAttribute() {
    let sum = numOfAttributes + 1;
    setNumOfAttributes(sum);
    setAttributes([...attributes, sum]);
  }

  function deleteAttribute() {
    if (attributes.length >= 1) {
      const newAttributes = attributes.filter(
        attribute => attribute !== attributes.length - 1
      );
      setAttributes(newAttributes);
      let aux = numOfAttributes - 1;
      setNumOfAttributes(aux);
    }
  }

  function handleChange(selectedOption) {
    setSelectedEntity(selectedOption);
  }

  function handleTypeChange(selectedOption) {
    setSelectedType(selectedOption);
  }

  const customStyles = {
    control: base => ({
      ...base,
      height: 25,
      fontSize: 14,
      minHeight: 35,
      width: 185
    })
  };

  const customSelectStyles = {
    control: base => ({
      ...base,
      height: 25,
      fontSize: 14,
      minHeight: 35
    })
  };

  return (
    <div className="App">
      <aside>
        <div className="form-block">
          <div className="header-block">
            <p className="title">Entity Form</p>
          </div>
          <div className="select-box">
            <label htmlFor="entity-type">Select the Entity Type: </label>
            <ReactSelect
              name="name"
              id="entity-type"
              value={selectedEntity}
              onChange={handleChange}
              options={entityTypes}
              theme={theme => ({
                ...theme,
                borderRadius: 2,
                colors: {
                  ...theme.colors,
                  text: "orangered",
                  primary25: "#15b097",
                  primary: "#333"
                }
              })}
              styles={customSelectStyles}
            />
          </div>

          <Form onSubmit={handleSubmit}>
            <Scope path={selectedEntity.value}>
              {formFields[selectedEntity.value].map(fieldType => (
                <Input
                  key={fieldType}
                  field={fieldType}
                  name={fieldType}
                  required
                />
              ))}

              <div className="attributes-container">
                <p>Attributes</p>
                <button
                  type="button"
                  onClick={addNewAttribute}
                  className="plus-btn"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={deleteAttribute}
                  className="trash"
                >
                  <FontAwesomeIcon icon={faTrash} color="#333" />
                </button>
              </div>

              {attributes.map(attributeID => (
                <div key={attributeID} className="attributes-block">
                  <div className="input-block">
                    <Input
                      name={`attributes[${attributeID}].name`}
                      field="name"
                      required
                    />
                  </div>
                  <div className="select-box">
                    <label htmlFor="type">type: </label>
                    <Select
                      name={`attributes[${attributeID}].type`}
                      options={validTypes}
                      value={selectedType}
                      onChange={handleTypeChange}
                      theme={theme => ({
                        ...theme,
                        borderRadius: 2,
                        colors: {
                          ...theme.colors,
                          text: "orangered",
                          primary25: "#15b097",
                          primary: "#333"
                        }
                      })}
                      styles={customStyles}
                    />
                  </div>
                </div>
              ))}
            </Scope>
            <button className="submit-btn" type="submit">
              <span>Create Entity</span>
            </button>
          </Form>
        </div>
      </aside>

      <main></main>
    </div>
  );
}

export default App;
