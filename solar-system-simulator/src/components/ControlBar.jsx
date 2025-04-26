import React, { useEffect, useState } from "react";

const ControlBar = ({
  onChange,
  value,
  orbit,
  grid,
  toggleOrbit,
  toggleGrid,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [savedSpeed, setSpeed] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update date by days, not seconds
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + value); // <-- Add days, not seconds
        return newDate;
      });
    }, 1000); // Every 1 second

    return () => clearInterval(interval);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  const getDirection = (v) => {
    if (v > 0) return "TIME FORWARD";
    if (v < 0) return "TIME BACKWARD";
    return "STOP";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Orbitron, sans-serif",
        textAlign: "center",
        color: "#0ff",
        letterSpacing: "2px",
        textShadow: "0 0 8px #0ff",
        userSelect: "none",
      }}
    >
      {/* Top Big Label */}
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        {Math.abs(value)} DAYS / SEC
      </div>

      {/* Subtext */}
      <div
        style={{
          fontSize: "12px",
          marginTop: "4px",
          marginBottom: "12px",
          color: "#0af",
          textShadow: "0 0 6px #0af",
        }}
      >
        {getDirection(value)}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {/* Control */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
          }}
        >
          <div
            className="panel"
            style={{
              display: "flex",
              gap: "2px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className={`button ${grid  && "highlighted"}`}
              onClick={() => {toggleGrid(prev=>!prev)}}
            >
              Grid
            </button>
            <button
              className={`button ${orbit && "highlighted"}`}
              onClick={() => {toggleOrbit(prev=>!prev)}}
            >
              Orbit
            </button>
          </div>
          <div
            className="panel"
            style={{
              display: "flex",
              gap: "2px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className={`button ${value != 0 && "highlighted"}`}
              onClick={() => {
                onChange(savedSpeed);
              }}
            >
              Play
            </button>
            <button
              className={`button ${value == 0 && "highlighted"}`}
              onClick={() => {
                setSpeed(value||1);
                onChange(0);
              }}
            >
              Pause
            </button>
          </div>
        </div>
        {/* Range */}
        <div
          className="panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.6em",
            }}
          >
            <span>Backward</span>
            <span>Forward</span>
          </div>
          <div
            style={{
              position: "relative",
              width: "300px",
              height: "30px",
              background: "rgba(0, 255, 255, 0.1)",
              border: "1px solid #0ff",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="range"
              min={-30}
              max={30}
              step={0.1}
              value={value}
              onChange={handleChange}
              style={{
                WebkitAppearance: "none",
                width: "100%",
                height: "100%",
                background: "transparent",
                cursor: "pointer",
                backgroundImage: `
                repeating-linear-gradient(
                  to right,
                  rgba(0, 255, 255, 0.3) 0px,
                  rgba(0, 255, 255, 0.3) 1px,
                  transparent 1px,
                  transparent 10px
                )
              `,
                backgroundSize: "10px 100%",
              }}
            />
          </div>
        </div>
        {/* Date */}
        <div
          style={{
            fontSize: "1.2em",
            fontWeight: "bold",
            color: "#0ff",
            textShadow: "0 0 6px #0ff",
          }}
        >
          {currentDate.toLocaleString()}{" "}
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
