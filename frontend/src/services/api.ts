//api.ts

import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3333", // ajuste conforme sua API
});

// Interceptor para enviar o token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



