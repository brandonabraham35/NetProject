import axios from "axios";
import { baseUrl } from "./Constants/Constance";
import { getAuth } from "firebase/auth";

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
