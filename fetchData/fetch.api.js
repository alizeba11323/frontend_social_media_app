import axios from "axios";
export const BASE_URL = import.meta.env.BASE_URL;
axios.defaults.baseURL = "https://social-media-app-backend-xixq.onrender.com";
axios.defaults.withCredentials = true;
export const PostData = (url, data) => {
  return axios.post(url, data, { withCredentials: true });
};

export const GetData = (url) => {
  return axios.get(url, { withCredentials: true });
};

export const PatchData = (url, data) => {
  return axios.patch(url, data, { withCredentials: true });
};
export const DeleteData = (url) => {
  return axios.delete(url, { withCredentials: true });
};
