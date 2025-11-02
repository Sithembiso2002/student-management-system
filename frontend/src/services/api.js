
import axios from 'axios';
const api = axios.create({ baseURL: '/' }); // proxied to backend in vite config
export default api;
