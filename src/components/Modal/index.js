import React, { forwardRef } from "react";
import Popup from "reactjs-popup";

import "./styles.css";

const Modal = (props, ref) => {
  return (
    <Popup
      ref={ref}
      trigger={
        <button hidden={true} className="trigger-popup">
          Open Modal
        </button>
      }
      modal
    >
      {close => (
        <div className="modal-container">
          <button ref={props.closeRef} className="close" onClick={close}>
            &times;
          </button>
          <div className="modal-header"> {props.title} </div>
          <div className="modal-content">{props.message}</div>
        </div>
      )}
    </Popup>
  );
};

export default forwardRef(Modal);
