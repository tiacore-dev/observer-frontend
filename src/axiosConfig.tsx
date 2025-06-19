import axios from "axios";
import { refreshToken } from "./api/authApi";

export const axiosInstance = axios.create({});
// Добавляем уникальный идентификатор для запросов
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Функция для повторной отправки запросов после обновления токена
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Интерцептор запросов
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор ответов
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isLoginRequest = originalRequest.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    // Пропускаем обработку для логина/обновления токена
    if (isLoginRequest || isRefreshRequest) {
      return Promise.reject(error);
    }

    // Если ошибка 401 и токен не обновляется в данный момент
    if (isUnauthorized && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        if (newToken) {
          // Обновляем токен в заголовке
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Запускаем ожидающие запросы
          onRefreshed(newToken);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Очищаем хранилище и перенаправляем на логин
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Если токен уже обновляется, ставим запрос в очередь
    if (isUnauthorized && isRefreshing) {
      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
