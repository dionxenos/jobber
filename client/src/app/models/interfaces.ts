export interface Skill {
  id: number;
  name: string;
}

export interface Language {
  code: string;
  name: string;
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

export enum Role {
  CANDI = "Candidate",
  EMPLO = "Employer",
  ADMIN = "Admin",
}

export type FetchStatus = "idle" | "pending";
