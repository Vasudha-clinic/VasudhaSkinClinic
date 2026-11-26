import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

api.interceptors.response.use(undefined, async (error) => {
  const config = error.config || {};
  if (error.response?.status === 401 && !config._retried && !config.url.includes("/auth/")) {
    config._retried = true;
    try {
      await api.post("/auth/refresh");
      return api(config);
    } catch {
      // fall through
    }
  }
  return Promise.reject(error);
});

export const formatApiError = (e, fallback = "Something went wrong. Please try again.") => {
  const d = e?.response?.data?.detail;
  if (d == null) return e?.message || fallback;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => (x && typeof x.msg === "string" ? x.msg : JSON.stringify(x))).join(", ");
  if (typeof d === "object" && typeof d.msg === "string") return d.msg;
  return fallback;
};

export const fetchServices = async () => {
  const { data } = await api.get("/services");
  return data;
};

export const useServices = () =>
  useQuery({ queryKey: ["services"], queryFn: fetchServices, staleTime: 5 * 60 * 1000 });
