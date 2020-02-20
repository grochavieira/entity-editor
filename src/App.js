import React, { useRef, useEffect, useState } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import "./App.css";
import "./global.css";
import "./EntityForm.css";

// import * as Yup from "yup";
import Input from "./components/Form/Input";

function App() {
  const formRef = useRef(null);
  const [user, setEntity] = useState({});

  async function handleSubmit(data, { reset }) {
    console.log(data);
  }

  return (
    <div className="App">
      <aside>
        <div className="form-block">
          <p className="title">Entity2JSON</p>

          <Form onSubmit={handleSubmit}>
            <Scope path="devices">
              <Input name="name" required />
              <Input name="id" required />
              <Input name="type" required />

              <Scope path="attributes">
                <Input name="name" required />
                <Input name="type" required />
              </Scope>
            </Scope>

            <button type="submit">
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
