import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Success.css";

function Success({ orderData, apiResponse }) {
  const navigate = useNavigate();

  if (!orderData || !apiResponse) {
    navigate('/order');
    return null;
  }

  const calculateToppingsPrice = () => {
    return orderData.toppings.length * 5;
  };

  const calculateBasePrice = () => {
    switch(orderData.size) {
      case 'Küçük': return 50;
      case 'Orta': return 75;
      case 'Büyük': return 100;
      default: return 0;
    }
  };

  const calculateTotalPrice = () => {
    return calculateBasePrice() + calculateToppingsPrice();
  };

  return (
    <div className="success-page">
      <h1>Siparişiniz Alındı!</h1>
      <div className="order-summary">
        <h3>Sipariş Detayları</h3>
        <p>
          <span className="label">Sipariş ID:</span>
          <span>{apiResponse.id}</span>
        </p>
        <p>
          <span className="label">Sipariş Tarihi:</span>
          <span>{new Date(apiResponse.createdAt).toLocaleString()}</span>
        </p>
        <p>
          <span className="label">Sipariş Sahibi:</span>
          <span>{orderData.name}</span>
        </p>
        <p>
          <span className="label">Pizza Boyutu:</span>
          <span>{orderData.size}</span>
        </p>
        <p>
          <span className="label">Seçilen Malzemeler:</span>
          <div className="toppings-list">
            {orderData.toppings.map(topping => (
              <span key={topping} className="topping-tag">
                {topping}
              </span>
            ))}
          </div>
        </p>
        {orderData.note && (
          <p>
            <span className="label">Özel Not:</span>
            <span>{orderData.note}</span>
          </p>
        )}
        <div className="price-section">
          <p>
            <span className="label">Pizza Fiyatı:</span>
            <span>{calculateBasePrice()} TL</span>
          </p>
          <p>
            <span className="label">Malzeme Fiyatı:</span>
            <span>{calculateToppingsPrice()} TL</span>
          </p>
          <p>
            <span className="label">Toplam:</span>
            <span className="total-price">{calculateTotalPrice()} TL</span>
          </p>
        </div>
      </div>

      <div className="api-response">
        <h3>API Yanıtı</h3>
        <pre>
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </div>

      <button onClick={() => navigate('/')} className="home-button">
        Ana Sayfaya Dön
      </button>
    </div>
  );
}

export default Success;