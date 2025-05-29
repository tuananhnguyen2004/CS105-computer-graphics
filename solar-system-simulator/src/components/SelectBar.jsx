import React, { useContext } from "react";
import planets from "../data/formatedPlanets";
import sun from "../data/sun.json";
import moons from "../data/moon.json";
import { SelectContext } from "../App";
import { Scene } from "three";

const SelectBar = () => {
  const { selectPlanet } = useContext(SelectContext);
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
      <button
        key={sun.name}
        onClick={() => selectPlanet(sun.name)}
        className="select_item"
      >
        <img src={sun.image} alt="planet" height={32} />
        {sun.name}
      </button>
      {moons.map((moon) => (
        <button
          key={moon.name}
          onClick={() => selectPlanet(moon.name)}
          className="select_item"
        >
          <img src={moon.image} alt="planet" height={32} />
          {moon.name}
        </button>
      ))}
      {planets.map((planet) => (
        <button
          key={planet.name}
          onClick={() => selectPlanet(planet.name)}
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
