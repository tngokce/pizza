import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
import "../styles/OrderForm.css";

function OrderForm({ onOrderSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    toppings: [],
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        toppings: checked
          ? [...prev.toppings, value]
          : prev.toppings.filter((topping) => topping !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://reqres.in/api/pizza", formData);
      onOrderSubmit(response.data);
      toast.success('Siparişiniz başarıyla alındı!');
      navigate("/success");
    } catch (error) {
      toast.error('Sipariş gönderilirken bir hata oluştu: ' + 
        (error.response?.data?.message || 'İnternet bağlantınızı kontrol edin'));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.length >= 3 && 
                     formData.size && 
                     formData.toppings.length >= 4 && 
                     formData.toppings.length <= 10;

  return (
    <div className="order-form">
      <h1>Pizza Siparişi</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              İsim:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                minLength={3}
                required
                className="custom-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Boyut:
              <div className="radio-group">
                {["Küçük", "Orta", "Büyük"].map((size) => (
                  <label key={size} className="radio-label">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={formData.size === size}
                      onChange={handleChange}
                    />
                    <span className="custom-radio"></span>
                    {size}
                  </label>
                ))}
              </div>
            </label>
          </div>

          <div className="form-group">
            <h3>Malzemeler: (En az 4, en fazla 10 seçim yapın)</h3>
            <div className="toppings-grid">
              {["Pepperoni", "Mantar", "Soğan", "Sucuk", "Zeytin", "Biber", 
                "Mısır", "Domates", "Salam", "Mozarella"].map((topping) => (
                <label key={topping} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="toppings"
                    value={topping}
                    checked={formData.toppings.includes(topping)}
                    onChange={handleChange}
                  />
                  <span className="custom-checkbox"></span>
                  {topping}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              Not:
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Siparişiniz için ekstra notunuz var mı?"
                className="custom-textarea"
              />
            </label>
          </div>

          <div className="order-summary">
            <h3>Sipariş Özeti</h3>
            <p>İsim: {formData.name}</p>
            <p>Boyut: {formData.size}</p>
            <p>Seçilen Malzemeler: {formData.toppings.join(", ")}</p>
            {formData.note && <p>Not: {formData.note}</p>}
          </div>

          <button 
            type="submit" 
            disabled={!isFormValid || loading}
            className="submit-button"
          >
            {loading ? "Sipariş Gönderiliyor..." : "Sipariş Ver"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;