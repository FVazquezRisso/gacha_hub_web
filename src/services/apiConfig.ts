import axios from 'axios'

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  // baseURL: "gacha-hub-api.onrender.com/api",
});