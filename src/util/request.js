import axios from "axios";
const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: '', 
  // timeout: 5000 // request timeout
});
/**
 * HTTP方法
 */
service.interceptors.request.use(
  config => {
    // 对请求的数据做点什么
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response 
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
