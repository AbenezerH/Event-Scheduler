import "./notFound.scss";
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

      <div className="content">
        <h1>{errorCode}</h1>
        <Astronaut />
        <p>{message}</p>
        <button className="btn" onClick={() => navigate(-1)}>{buttonText}</button>
      </div>
    </div>
  )
};

export default NotFound;