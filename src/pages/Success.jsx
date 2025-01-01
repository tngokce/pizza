import React from "react";
import { Link } from "react-router-dom";
import "../styles/Success.css";

function Success() {
  return (
    <div className="success">
      <h1>Tebrikler!</h1>
      <p>Siparişiniz başarıyla alındı!</p>
      <Link to="/" className="home-button">Anasayfa</Link>
    </div>
  );
}

export default Success;