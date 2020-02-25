import React, { useRef, useEffect } from "react";
import ReactSelect from "react-select";
import { useField } from "@unform/core";

const Select = ({ name, ...rest }) => {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  const customSelectTypeStyles = {
    control: base => ({
      ...base,
      height: 25,
      fontSize: 14,
      minHeight: 35,
      width: 185,
      borderRadius: 2
    }),
    menu: base => ({
      ...base,
      borderRadius: 2,
      hyphens: "auto",
      textAlign: "left",
      wordWrap: "break-word",
      backgroundColor: "#fff",
      marginTop: 0
    }),
    menuList: base => ({
      ...base,
      padding: 0,
      opacity: 1,
      backgroundColor: "#fff"
    })
  };

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: "state.value",
      getValue: ref => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }

          return ref.state.value.map(option => option.value);
        } else {
          if (!ref.state.value) {
            return "";
          }

          return ref.state.value.value;
        }
      }
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <ReactSelect
      defaultValue={{ value: "Number", label: "Number" }}
      ref={selectRef}
      {...rest}
      styles={customSelectTypeStyles}
    />
  );
};

export default Select;
