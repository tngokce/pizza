import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrderForm from "./pages/OrderForm";
import Success from "./pages/Success";
import "./App.css";

function App() {
  const [orderData, setOrderData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleOrderSubmit = (formData, response) => {
    setOrderData(formData);
    setApiResponse(response);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/order" 
          element={<OrderForm onOrderSubmit={handleOrderSubmit} />} 
        />
        <Route 
          path="/success" 
          element={<Success orderData={orderData} apiResponse={apiResponse} />} 
        />
      </Routes>
    </div>
  );
}

export default App;
