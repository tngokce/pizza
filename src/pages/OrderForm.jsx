import React, { useState } from "react";
import axios from "axios";
import "../styles/OrderForm.css";

function OrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    crust: "",
    toppings: [],
    note: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/pizza", formData)
      .then((response) => {
        console.log("Order Response:", response.data);
        window.location.href = "/success";
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="order-form">
      <h1>Pizza Siparişi</h1>
      <form onSubmit={handleSubmit}>
        <label>
          İsim:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            minLength={3}
            required
          />
        </label>
        <label>
          Boyut:
          <select name="size" value={formData.size} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            <option value="small">Küçük</option>
            <option value="medium">Orta</option>
            <option value="large">Büyük</option>
          </select>
        </label>
        <label>
          Hamur:
          <select name="crust" value={formData.crust} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            <option value="thin">İnce</option>
            <option value="thick">Kalın</option>
          </select>
        </label>
        <div className="toppings">
          <h3>Malzemeler:</h3>
          {["Pepperoni", "Mantar", "Soğan", "Sucuk"].map((topping, index) => (
            <label key={index}>
              <input
                type="checkbox"
                name="toppings"
                value={topping}
                onChange={handleChange}
              />
              {topping}
            </label>
          ))}
        </div>
        <label>
          Not:
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Siparişe eklemek istediğiniz bir not var mı?"
          />
        </label>
        <button type="submit">Sipariş Ver</button>
      </form>
    </div>
  );
}

export default OrderForm;
