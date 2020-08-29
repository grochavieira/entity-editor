import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./style.css";
import logo from "../../img/logo.png";

export default function Header(props) {
  const [on, setOn] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function renderMenu() {
      if (isMenuOpen) {
        setOn("on");
      } else {
        setOn("");
      }
    }

    renderMenu();
  }, [isMenuOpen]);

  return (
    <header>
      <div className="header-container">
        <img src={logo} alt="Entity Editor" />
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`menu-section ${on}`}
        >
          <div className="menu-toggle">
            <div className="one"></div>
            <div className="two"></div>
            <div className="three"></div>
          </div>
          <nav>
            <ul>
              <li>
                <Link className={`${props.home}`} to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className={`${props.create}`} to="/create">
                  Create
                </Link>
              </li>
              <li>
                <Link className={`${props.list}`} to="/list">
                  Edit
                </Link>
              </li>
              <li>
                <Link className={`${props.about}`} to="/about">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
