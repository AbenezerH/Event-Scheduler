import "./notFound.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import Astronaut from "../../components/Astronaut";

const NotFound = ({
  errorCode = "404",
  message = "Oops! You've ventured into uncharted space.",
  buttonText = "Return back"
}) => {
  const navigate = useNavigate();
  return (
    <div className="not-found-wrapper">

      <div className="not-found-content">
        <h1 className="not-found-error">{errorCode}</h1>
        <Astronaut />
        <p className="not-found-p">{message}</p>
        <button className="btn" onClick={() => navigate(-1)}>{buttonText}</button>
      </div>
    </div>
  )
};

export default NotFound;