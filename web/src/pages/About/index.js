import React from "react";

import "./styles.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <>
      <Header about={"current"} />
      <div className="about-container">
        <div className="company-container">
          <div className="header">
            <span>InteliDev</span>
          </div>
          <div className="content">
            <h2 className="title">A little about our company... </h2>
            <p>
              <b>InteliDev</b> is a fictional company created in 2020 by{" "}
              <b>Guilherme Rocha Vieira</b> and <b>Thomas Anderson Ferrari</b>{" "}
              for the sole reason of developing this project for our software
              engineering discipline in the computer science course at the
              <b> university center FEI</b>, in which we received the proposal
              from our colleagues at the{" "}
              <b>FEI Laboratory of Innovation in Internet of Things</b> to
              develop a website capable of integrating with their API of the
              SWAMP project, in which they participated, to facilitate their
              work in creating, editing and relating entities that would later
              be used in their respective projects.
            </p>
            <a
              className="github-link"
              href="https://github.com/grochavieira/Entity-Editor"
            >
              Project Github Link
            </a>
          </div>
        </div>
        <div className="version-block">
          <div className="header">Version v1.00</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
