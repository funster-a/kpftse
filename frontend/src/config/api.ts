// API Configuration
// В продакшне замените на реальный URL вашего backend сервера
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  'http://localhost:3000';

export const API_ENDPOINTS = {
  ORDERS: `${API_BASE_URL}/api/orders`,
  CONTACT: `${API_BASE_URL}/api/contact`,
};

export default API_BASE_URL;

