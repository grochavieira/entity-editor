import React from "react";
import { render } from "@testing-library/react";
import { Link } from "react-router-dom";

import "./style.css";

export default function Header() {
  return (
    <header>
      <span>Entity Editor</span>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/create">Create</Link>
          </li>
          <li>
            <Link to="/list">List/Update</Link>
          </li>
          <li>
            <Link to="/delete">Delete</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <span></span>
    </header>
  );
}
