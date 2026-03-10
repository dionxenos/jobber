import axios, { AxiosError, AxiosResponse } from "axios";
import { Login, Register } from "../models/interfaces";
import { toast } from "react-toastify";
import config from "../config";

const sleep = async (delay: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, delay));

axios.defaults.baseURL = config.API_BASE_URL;
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

const Account = {
  login: (body: Login) => requests.post("account/login", body),
  register: (body: Register) => requests.post("account/register", body),
  currentUser: () => requests.get("account/getCurrentUser"),
  logout: () => requests.post("account/logout", {}),
  emailExists: (email: string) => requests.get(`account/emailExists?email=${email}`),
};

const Users = {
  list: () => requests.get("user"),
  search: (query: string) => requests.get(`user/search?q=${encodeURIComponent(query)}`),
  details: (id: number) => requests.get(`user/${id}`),
  skills: (id: number) => requests.get(`user/${id}/skills`),
  update: (id: number, body: { fullName: string; email: string; telephone: string }) =>
    requests.put(`user/${id}`, body),
  remove: (id: number) => requests.delete(`user/${id}`),
};

const Skills = {
  list: () => requests.get("skills"),
};

const UserSkills = {
  list: (userId: number) => requests.get(`userskills/${userId}`),
  recommended: (userId: number) => requests.get(`userskills/recommendedskills/${userId}`),
  add: (userId: number, skillId: number) =>
    requests.post("userskills/add", { userId, skillId }),
  remove: (userId: number, skillId: number) =>
    requests.delete(`userskills/${userId}/delete/${skillId}`),
};

const UserLanguages = {
  list: (userId: number) => requests.get(`userlanguages/${userId}`),
  add: (userId: number, languageCode: string, languageLevelCode: string) =>
    requests.post("userlanguages/add", { userId, languageCode, languageLevelCode }),
  remove: (id: number) => requests.delete(`userlanguages/delete/${id}`),
};

const UserEducation = {
  list: (userId: number) => requests.get(`usereducation/${userId}`),
  add: (userId: number, fieldId: number, levelId: number, from: number, to: number) =>
    requests.post("usereducation/add", { userId, fieldId, levelId, from, to }),
  remove: (id: number) => requests.delete(`usereducation/delete/${id}`),
};

const Languages = {
  list: () => requests.get("languages"),
  levels: () => requests.get("languages/levels"),
  byName: (name: string) => requests.get(`languages/getByLangName/${name}`),
};

const Education = {
  fields: () => requests.get("education/fields"),
  levels: () => requests.get("education/levels"),
};

const Jobs = {
  list: () => requests.get("jobs"),
  byId: (id: number) => requests.get(`jobs/${id}`),
  byUserId: (userId: number) => requests.get(`jobs/getByUserId/${userId}`),
  add: (userId: number, title: string) => requests.post("jobs/add", { userId, title }),
  remove: (id: number) => requests.delete(`jobs/${id}`),
  getSkills: (jobId: number) => requests.get(`jobs/getSkills/${jobId}`),
  addSkill: (jobId: number, skillId: number) =>
    requests.post("jobs/skills/add", { jobId, skillId }),
  removeSkill: (jobId: number, skillId: number) =>
    requests.delete(`jobs/skills/delete/${jobId}/${skillId}`),
  getLanguages: (jobId: number) => requests.get(`jobs/getLanguages/${jobId}`),
  addLanguage: (jobId: number, languageCode: string, languageLevelCode: string) =>
    requests.post("jobs/languages/add", { jobId, languageCode, languageLevelCode }),
  removeLanguage: (langId: number) => requests.delete(`jobs/languages/delete/${langId}`),
  getEducation: (jobId: number) => requests.get(`jobs/getEducation/${jobId}`),
  addEducation: (jobId: number, fieldId: number, levelId: number) =>
    requests.post("jobs/education/add", { jobId, fieldId, levelId }),
  removeEducation: (eduId: number) => requests.delete(`jobs/education/delete/${eduId}`),
  getSkillScore: (jobId: number) => requests.get(`jobs/getSkillScore/${jobId}`),
  recruit: (jobId: number, skillWeight: number, langWeight: number, eduWeight: number, numOfResults: number) =>
    requests.post(`jobs/recruit/${jobId}`, { skillWeight, langWeight, eduWeight, numOfResults }),
};

const Interviews = {
  create: (emploId: number, candId: number) =>
    requests.post("interviews", { emploId, candId }),
  employerInvites: (emploId: number) => requests.get(`interviews/employer/${emploId}`),
  candidateInvites: (candId: number) => requests.get(`interviews/candidate/${candId}`),
  accept: (id: number) => requests.put("interviews/accept", id),
  decline: (id: number) => requests.delete(`interviews/${id}`),
};

const agent = {
  Account,
  Users,
  Skills,
  UserSkills,
  UserLanguages,
  UserEducation,
  Languages,
  Education,
  Jobs,
  Interviews,
};

export default agent;
