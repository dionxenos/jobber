import axios, { AxiosError, AxiosResponse } from "axios";
import { Login } from "../models/interfaces";
import { toast } from "react-toastify";

const sleep = async (delay: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, delay));

axios.defaults.baseURL = "http://localhost:5256/api/";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 404:
        console.log(error.message);
        break;
      case 401:
        data && toast.error(data);
        break;
    }
    return Promise.reject(error.response);
  }
);

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Skills = {
  list: () => requests.get("skills"),
  recommendedSkills: (id: number) => requests.get(`recommendedFor:${id}`),
};

const Account = {
  login: (body: Login) => requests.post("account/login", body),
  currentUser: () => requests.get("account/getCurrentUser"),
  logout: () => requests.post("account/logout", {}),
};

const User = {
  details: (id: number) => requests.get(`user/${id}`),
  skills: (id: number) => requests.get(`user/${id}/skills`),
};

const agent = {
  Skills,
  Account,
  User,
};

export default agent;
