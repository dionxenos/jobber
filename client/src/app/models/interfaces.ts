export interface Skill {
  id: number;
  name: string;
}

export interface RecommendedSkill {
  id: number;
  name: string;
  occurences: number;
}

export interface Language {
  code: string;
  name: string;
  level: string;
}

export interface LanguageLevel {
  code: string;
  level: number;
}

export interface EducationField {
  id: number;
  name: string;
}

export interface EducationLevel {
  id: number;
  level: string;
}

export interface Education {
  id: number;
  name: string;
  from: number;
  to: number | null;
  level: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  fullName: string;
  email: string;
  password: string;
  telephone: string;
  roleCode: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  roleCode: string;
  telephone: string;
  createdOn: Date;
}

export interface UserDetails {
  details: User | null;
  skills: Skill[];
  languages: Language[];
  education: Education[];
}

export interface UserSkillResponse {
  csId: number;
  id: number;
  name: string;
}

export interface UserLanguageResponse {
  id: number;
  languageLevelCode: string;
  language: { code: string; name: string };
}

export interface UserEducationResponse {
  userId: number;
  degrees: UserDegree[];
}

export interface UserDegree {
  id: number;
  fieldName: string;
  level: string;
  from: number;
  to: number;
}

export interface Job {
  id: number;
  title: string;
  userId: number;
  createdOn: string;
}

export interface JobLanguageResponse {
  id: number;
  jobId: number;
  languageCode: string;
  languageLevelCode: string;
  languageName: string;
}

export interface JobEducationResponse {
  id: number;
  jobId: number;
  educationLevelId: number;
  fieldId: number;
  name: string;
  level: string;
}

export interface Interview {
  id: number;
  email: string;
  fullName: string;
  userId: number;
  hasAccepted: boolean | null;
}

export interface TotalScore {
  rowNum: number;
  id: number;
  fullName: string;
  skillScore: number;
  langScore: number;
  eduScore: number;
  totalScore: number;
}

export enum Role {
  CANDI = "Candidate",
  EMPLO = "Employer",
  ADMIN = "Admin",
}

export type FetchStatus = "idle" | "pending";
