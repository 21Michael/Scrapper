export interface ICandidate {
  name: string | null;
  href: string | null;
  salary: string | null;
  date: string | null;
  englishLevel: string | null;
  expLVL: string | null;
  city: string | null;
  views: string | null;
  skills: string[] | null;
}

export interface IVacancy {
  name: string | null;
  href: string | null;
  date: string | null;
  views: string | null;
  responses: string | null;
  salaryForkMin: string | null;
  salaryForkMax: string | null;
  relocate: boolean;
  countries: string[] | null;
  cities: string[] | null;
  englishLevel: string | null;
  companyType: string | null;
  expLVL: string | null;
}
