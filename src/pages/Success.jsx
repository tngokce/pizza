import React from "react";
import { Link, Navigate } from "react-router-dom";
import "../styles/Success.css";

function Success({ orderData }) {
  if (!orderData) {
    return <Navigate to="/" />;
  }

  return (
    <div className="success-page">
      <div className="success-content">
        <h1>Siparişiniz Alındı!</h1>
        
        <div className="order-details">
          <h2>Sipariş Detayları</h2>
          <div className="details-grid">
            <p><strong>Sipariş ID:</strong> {orderData.id}</p>
            <p><strong>İsim:</strong> {orderData.name}</p>
            <p><strong>Boyut:</strong> {orderData.size}</p>
            <p><strong>Malzemeler:</strong> {orderData.toppings.join(", ")}</p>
            {orderData.note && (
              <p><strong>Not:</strong> {orderData.note}</p>
            )}
            <p><strong>Sipariş Tarihi:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>

        <Link to="/" className="home-button">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

export default Success;