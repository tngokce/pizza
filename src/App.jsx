import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrderForm from "./pages/OrderForm";
import Success from "./pages/Success";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App
