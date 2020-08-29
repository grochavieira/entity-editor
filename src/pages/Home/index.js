import React from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "./styles.css";

export default function Home() {
  return (
    <>
      <Header home={"current"} />
      <div className="home-container">
        <div className="overview">
          <div className="title">
            <span>Welcome to the Entity Editor!!!</span>
          </div>
          <div className="content">
            <p>
              Below we have an overview of each tab of our site to inform you
              about what you can do in each one of them.
            </p>

            <span className="sub-title">Create Tab</span>
            <p>
              The <b>Create</b> tab is used to create new entities, where you
              have the option to add new attributes to them or create
              relationships with existing entities.
            </p>
            <span className="sub-title">Edit Tab</span>
            <p>
              The <b>Edit</b> tab is used to list, update and delete the
              entities already created in your database. In the list action, you
              can list the entities by their type, which is gonna list all the
              entities of that type, or you can list just one of them by typing
              their id, and when you list a entity, it will appear some
              information about them and two buttons to update or delete the
              entity, then, if you press the update button you will be
              redirected to a form which contains all the information about the
              chosen entity so you can update it, by adding new attributes or
              relationships, or deleting some of them. And if you choose to
              delete the entity, it will prompt a message to confirm the action,
              and if confirmed, it will delete the entity and the relationship
              of the entities that were related to this entity.
            </p>
            <span className="sub-title">About Tab</span>
            <p>
              The <b>About</b> tab is where you can find more information about
              our company and the people responsible for this project.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
