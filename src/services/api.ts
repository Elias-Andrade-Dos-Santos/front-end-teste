import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5143', // API backend
});

export default api;
