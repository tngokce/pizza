import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
import "../styles/OrderForm.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validateName = (name) => {
  if (!name) return 'İsim alanı zorunludur';
  if (name.length < 3) return 'İsim en az 3 karakter olmalıdır';
  return '';
};

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
    name: "",
    size: "",
    toppings: [],
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
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

    // İsim 
    if (name === 'name') {
      const error = validateName(value);
      setErrors(prev => ({
        ...prev,
        name: error
      }));
    }
  };

  // Form güncelle
  const validateForm = () => {
    const nameError = validateName(formData.name);
    const sizeError = validateSize(formData.size);
    const toppingsError = validateToppings(formData.toppings);

    setErrors({
      name: nameError,
      size: sizeError,
      toppings: toppingsError
    });

    return !nameError && !sizeError && !toppingsError;
  };

  // handleSubmit  güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Lütfen tüm alanları doğru şekilde doldurun');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("https://reqres.in/api/pizza", formData);
      
      // konsola yazdir
      console.log('API Yanıtı:', response.data);
      console.log('Sipariş Özeti:', {
        isim: response.data.name,
        boyut: response.data.size,
        malzemeler: response.data.toppings,
        not: response.data.note
      });

      onOrderSubmit(formData, response.data);
      toast.success('Siparişiniz başarıyla alındı!');
      navigate("/success");
    } catch (error) {
      console.error('API Hatası:', error);
      toast.error('Sipariş gönderilirken bir hata oluştu: ' + 
        (error.response?.data?.message || 'İnternet bağlantınızı kontrol edin'));
    } finally {
      setLoading(false);
    }
  };

  // Form kontrol
  const isFormValid = 
    formData.name.length >= 3 && 
    formData.size && 
    formData.toppings.length >= 4 && 
    formData.toppings.length <= 10 &&
    !errors.name &&
    !errors.toppings &&
    !errors.size;

  const calculateToppingsPrice = () => {
    return formData.toppings.length * 5; // Her malzeme 5 TL
  };

  const calculateBasePrice = () => {
    switch(formData.size) {
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
    <div className="order-form">
      <header className="site-header">
        <div className="header-content">
          <h1>Teknolojik Yemekler</h1>
          <p className="subtitle">Anasayfa • Sipariş Oluştur</p>
        </div>
      </header>

      <div className="form-container">
        <h2>Pizza Siparişi</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              İsim:
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                minLength={3}
                required
                className={errors.name ? 'error' : 'custom-input'}
                placeholder="İsminizi giriniz (en az 3 karakter)"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
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
              {errors.size && <span className="error-message">{errors.size}</span>}
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
              Özel Notlar:
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Siparişiniz için ekstra notunuz var mı? (Ör: Az pişmiş, ekstra sos, vb.)"
                className="custom-textarea"
                maxLength={200}
              />
              <span className="char-count">
                {formData.note.length}/200 karakter
              </span>
            </label>
          </div>

          <div className="order-summary">
            <h3>Sipariş Özeti</h3>
            <p>
              <span className="label">İsim:</span>
              <span>{formData.name || '-'}</span>
            </p>
            <p>
              <span className="label">Pizza Boyutu:</span>
              <span>{formData.size || '-'}</span>
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
                <span className="label">Özel Not:</span>
                <span>{formData.note}</span>
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