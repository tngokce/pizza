import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import OrderForm from "./pages/OrderForm";
import Success from "./pages/Success";
import "./App.css";

function App() {
  const [orderData, setOrderData] = useState(null);

  const handleOrderSubmit = (data) => {
    setOrderData(data);
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/order" 
            element={<OrderForm onOrderSubmit={handleOrderSubmit} />} 
          />
          <Route 
            path="/success" 
            element={<Success orderData={orderData} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
