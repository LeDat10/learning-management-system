import axios from "axios";
import { tokenExpiredUser } from "../../actions/auth";
import store from "../../store/store";
import { message } from "antd";
const API_DOMAIN = 'http://localhost:7000/api/';

const axiosInstance = axios.create();

// ✅ Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    // Trường hợp server trả về code 401 trong dữ liệu
    if (response?.data?.code === 401) {
      store.dispatch(tokenExpiredUser());
    }
    return response;
  },
  (error) => {
    // Trường hợp response lỗi 401 từ status code
    if (error?.response?.status === 401) {
      // console.log("Token hết hạn (status 401)");
      store.dispatch(tokenExpiredUser());
    }
    return Promise.reject(error);
  }
);



export const get = async (path, config = {}) => {
  const response = await axiosInstance.get(API_DOMAIN + path, config);
  return response;
};

export const post = async (path, option, config = {}) => {
  const response = await axiosInstance.post(API_DOMAIN + path, option, config);
  return response;
};

export const patch = async (path, option, config = {}) => {
  const response = await axiosInstance.patch(API_DOMAIN + path, option, config);
  return response;
};

export const del = async (path, config = {}) => {
  const response = await axiosInstance.delete(API_DOMAIN + path, config);
  return response;
};