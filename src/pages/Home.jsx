import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <header>
        <img src="/images/iteration-1-images/logo.svg" alt="Teknolojik Yemekler Logo" />
      </header>
      <div className="banner">
        <img src="/images/iteration-1-images/home-banner.png" alt="Pizza Banner" />
        <h1>KOD ACIKTIRIR, PIZZA DOYURUR</h1>
        <Link to="/order" className="order-button">Acıktım</Link>
      </div>
    </div>
  );
}

export default Home;