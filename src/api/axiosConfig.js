import axios from 'axios';

//aca traer el token de las cookies
const api = axios.create({
  baseURL: 'https://cuentacorrienteproveedores.up.railway.app', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer ${(token)}`
  }
});

export default api;
