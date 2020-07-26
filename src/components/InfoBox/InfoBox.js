import React from "react";
import "./InfoBox.css";

function InfoBox({ title, cases, isRed, active, total, ...props }) {
  return (
    <div
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <div>
        <div className="infoBox__title">
          {title}
        </div>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
        <div className="infoBox__total">
          {total} Total
        </div>
      </div>
    </div>
  );
}

export default InfoBox;
