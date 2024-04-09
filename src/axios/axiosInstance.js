import axios from "axios";
import { URL } from "../helper";

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    Accept: "application/json",
  },
});

export default axiosInstance;
