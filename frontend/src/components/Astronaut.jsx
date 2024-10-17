import React from "react";
const Astronaut = () => (
    React.createElement("svg", { className: "astronaut", viewBox: "0 0 200 200", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("circle", { cx: "100", cy: "100", r: "90", fill: "#f2f2f2" }),
        React.createElement("circle", { cx: "100", cy: "100", r: "80", fill: "#e6e6e6" }),
        React.createElement("circle", { cx: "100", cy: "100", r: "70", fill: "#d9d9d9" }),
        React.createElement("rect", { x: "70", y: "80", width: "60", height: "40", rx: "20", fill: "#4d4d4d" }),
        React.createElement("circle", { cx: "85", cy: "100", r: "10", fill: "#ffffff" }),
        React.createElement("circle", { cx: "115", cy: "100", r: "10", fill: "#ffffff" }),
        React.createElement("path", { d: "M90 115 Q100 125 110 115", stroke: "#4d4d4d", strokeWidth: "3", fill: "none" })
    )
);

export default Astronaut;