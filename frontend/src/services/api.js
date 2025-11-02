
import axios from 'axios';
const api = axios.create({ baseURL: '/' }); // proxied to backend in vite config
export default api;
const API = import.meta.env.VITE_API_URL;
export const getStudents = async () => {
  const res = await fetch(`${API}/students`);
  return res.json();
};

