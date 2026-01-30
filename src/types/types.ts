export interface Area {
  id: string;
  name: string;
}

export interface Salary {
  from: string;
  to: string;
  currency: string;
}

export interface Employer {
  id: string;
  name: string;
}

export interface WorkFormat {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  name: string;
}

export interface Key_skill {
  name: Array<{ name: string }>;
}

export interface Vacancy {
  id: string;
  name: string;
  area: Area;
  salary: Salary;
  employer: Employer;
  work_format: WorkFormat;
  experience: Experience;
  key_skill: Key_skill;
}

export interface VacanciesResponse {
  items: Vacancy[];
  pages: number;
  page: number;
  per_page: number;
}
