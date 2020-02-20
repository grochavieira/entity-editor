import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

import "./index.css";
import "../../../src/global.css";

export default function Input({ name, ...refs }) {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value"
    });
  }, [fieldName, registerField]);

  return (
    <div className="main-input-container">
      <div className="input-block">
        <input ref={inputRef} {...refs} />
        <label className="label-name" htmlFor={name}>
          <span className="content-name">
            {name} {error}
          </span>
        </label>
      </div>
    </div>
  );
}
