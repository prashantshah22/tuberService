import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "universal-cookie";
const HttpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER,
  withCredentials: true,
});

HttpRequest.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const cookie = new Cookies();
    const accessToken = cookie.get("accessToken");
    config.headers = config.headers || {};
    if (accessToken) config.headers["X-Auth-Token"] = accessToken;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default HttpRequest;
