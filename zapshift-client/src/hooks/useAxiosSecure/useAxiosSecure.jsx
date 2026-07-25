import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../useAuth/useAuth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

// Attaches the JWT (stored by AuthProvider on login/register) to every
// outgoing request, and logs the user out automatically if the token is
// rejected (expired/invalid) by the backend.
const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("zapshift-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          logout().then(() => navigate("/auth/login"));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return instance;
};

export default useAxiosSecure;
