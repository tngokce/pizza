import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
import "../styles/OrderForm.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validateSize = (size) => {
  if (!size) return 'Lütfen bir pizza boyutu seçin';
  return '';
};

const validateToppings = (toppings) => {
  if (toppings.length < 4) return 'En az 4 malzeme seçmelisiniz';
  if (toppings.length > 10) return 'En fazla 10 malzeme seçebilirsiniz';
  return '';
};

function OrderForm({ onOrderSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    size: "",
    toppings: [],
    note: "",
    dough: "",
    quantity: 1
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    toppings: '',
    size: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updatedToppings = checked
        ? [...formData.toppings, value]
        : formData.toppings.filter((topping) => topping !== value);

      setFormData(prev => ({
        ...prev,
        toppings: updatedToppings
      }));

    
      if (updatedToppings.length > 10) {
        setErrors(prev => ({
          ...prev,
          toppings: 'En fazla 10 malzeme seçebilirsiniz'
        }));
      } else if (updatedToppings.length < 4) {
        setErrors(prev => ({
          ...prev,
          toppings: 'En az 4 malzeme seçmelisiniz'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          toppings: ''
        }));
      }
    } else if (type === "radio") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setErrors(prev => ({
        ...prev,
        size: ''
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const sizeError = validateSize(formData.size);
    const toppingsError = validateToppings(formData.toppings);

    setErrors({
      size: sizeError,
      toppings: toppingsError
    });

    return !sizeError && !toppingsError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Lütfen tüm alanları doğru şekilde doldurun');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://reqres.in/api/pizza", formData);
      
      console.log('API Yanıtı:', response.data);
      console.log('Sipariş Özeti:', {
        boyut: response.data.size,
        malzemeler: response.data.toppings,
        not: response.data.note
      });

      onOrderSubmit(formData, response.data);
      toast.success('Siparişiniz başarıyla alındı!');
      navigate("/success");
    } catch (error) {
      console.error('API Hatası:', error);
      toast.error(
        error.response?.data?.message || 
        'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = 
    formData.size && 
    formData.toppings.length >= 4 && 
    formData.toppings.length <= 10 &&
    !errors.toppings &&
    !errors.size;

  const calculateToppingsPrice = () => {
    return formData.toppings.length * 5;
  };

  const calculateBasePrice = () => {
    switch(formData.size) {
      case 'Küçük': return 85.50;
      case 'Orta': return 140;
      case 'Büyük': return 200;
      default: return 0;
    }
  };

  const calculateTotalPrice = () => {
    return (calculateBasePrice() + calculateToppingsPrice()) * formData.quantity;
  };

  const increaseQuantity = () => {
    setFormData(prev => ({
      ...prev,
      quantity: prev.quantity + 1
    }));
  };

  const decreaseQuantity = () => {
    if (formData.quantity > 1) {
      setFormData(prev => ({
        ...prev,
        quantity: prev.quantity - 1
      }));
    }
  };

  return (
    <div className="order-form">
      <header className="site-header">
        <div className="header-content">
          <h1>Teknolojik Yemekler</h1>
          <p className="subtitle">Anasayfa • Sipariş Oluştur</p>
        </div>
      </header>

      <div className="form-container">
        <h2>Pizza Siparişi</h2>
        
        <div className="pizza-description">
          <h2 className="pizza-title">Position Absolute Acı Pizza</h2>
          <div className="price-rating">
            <span className="price">85.50₺</span>
            <div className="rating">
              <span className="rating-score">4.8</span>
              <span className="rating-count">(200)</span>
            </div>
          </div>
          <p className="description">
            Frontend Dev olarak hala position:absolute kullanıyorsan bu çok acı pizza tam sana göre...
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="size-dough-container">
            <div className="form-group size-group">
              <label>
                Boyut:
                <div className="radio-group-vertical">
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
                {errors.size && <span className="error-message">{errors.size}</span>}
              </label>
            </div>

            <div className="form-group dough-group">
              <label htmlFor="dough">
                Hamur Seç:
                <select
                  id="dough"
                  name="dough"
                  value={formData.dough}
                  onChange={handleChange}
                  className="custom-select"
                >
                  <option value="">Hamur kalınlığı seçin</option>
                  <option value="İnce">İnce Hamur</option>
                  <option value="Normal">Normal Hamur</option>
                  <option value="Kalın">Kalın Hamur</option>
                </select>
              </label>
            </div>
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
                    disabled={formData.toppings.length >= 10 && !formData.toppings.includes(topping)}
                  />
                  <span className="custom-checkbox"></span>
                  {topping}
                </label>
              ))}
            </div>
            {errors.toppings && <span className="error-message">{errors.toppings}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="note">
              Sipariş Notu:
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Siparişiniz için notunuz var mı? (Ör: Az pişmiş, ekstra sos, vb.)"
                className="custom-textarea"
                maxLength={200}
              />
              <span className="char-count">
                {formData.note.length}/200 karakter
              </span>
            </label>
          </div>

          <div className="quantity-summary-container">
            <div className="form-group quantity-group">
              <label>
                Adet:
                <div className="quantity-controls">
                  <button 
                    type="button" 
                    onClick={decreaseQuantity}
                    className="quantity-button"
                    disabled={formData.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{formData.quantity}</span>
                  <button 
                    type="button" 
                    onClick={increaseQuantity}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
              </label>
            </div>

            <div className="order-summary">
              <h3>Sipariş Özeti</h3>
              <p>
                <span className="label">Pizza Boyutu:</span>
                <span>{formData.size || '-'}</span>
              </p>
              <p>
                <span className="label">Hamur:</span>
                <span>{formData.dough || '-'}</span>
              </p>
              <p>
                <span className="label">Malzemeler:</span>
                <div className="toppings-list">
                  {formData.toppings.length > 0 ? (
                    formData.toppings.map(topping => (
                      <span key={topping} className="topping-tag">
                        {topping}
                      </span>
                    ))
                  ) : (
                    '-'
                  )}
                </div>
              </p>
              {formData.note && (
                <p>
                  <span className="label">Sipariş Notu:</span>
                  <span>{formData.note}</span>
                </p>
              )}
              <p>
                <span className="label">Adet:</span>
                <span>{formData.quantity}</span>
              </p>
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
      <ToastContainer />
    </div>
  );
}



export default OrderForm;