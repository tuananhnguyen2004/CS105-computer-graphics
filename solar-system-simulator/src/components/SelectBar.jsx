
import React from "react";
import planets from "../data/formatedPlanets";


const SelectBar = ({ onSelect }) => {

    const handleClick = (name) => { 
        console.log(name)
        onSelect(name)
    }
  return (
    <div
      className="panel"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        position: "fixed",
        top: "0px",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        padding: "10px",
        zIndex: "50",
      }}
    >
      {planets.map((planet) => (
        <button
          key={planet.name}
          onClick={() => handleClick(planet.name)}
          className="select_item"
        >
          <img src={planet.image} alt="planet" height={32} />
          {planet.name}
        </button>
      ))}
    </div>
  );
};

export default SelectBar;
