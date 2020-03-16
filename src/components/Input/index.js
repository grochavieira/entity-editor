import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

import "./style.css";

export default function Input({ name, field, invisible, ref, ...refs }) {
  const inputRef = useRef(null);
  const { fieldName, registerField, error } = useField(name);

  useEffect(() => {
    if (name !== "attributes") {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: "value"
      });
    }
  }, [fieldName, registerField]);

  return (
    <div className="main-input-container" hidden={invisible}>
      <div className="input-block">
        <input ref={inputRef} {...refs} />
        <label className="label-name" htmlFor={field}>
          <span className="content-name">
            {field} <span className="content-error">{error}</span>
          </span>
        </label>
      </div>
    </div>
  );
}
