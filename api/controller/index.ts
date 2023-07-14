import Candidate from "./candidates";
import Vacancy from "./vacancies";
import { DB } from "../shared/services/db";
import { ICandidate, IVacancy } from "../shared/types";
import { candidateModel, vacancyModel } from "../shared/models";

const CandidateDB = new DB<ICandidate>({ model: candidateModel });
const VacancyDB = new DB<IVacancy>({ model: vacancyModel });

export const CandidateController = new Candidate({ DB: CandidateDB });
export const VacancyController = new Vacancy({ DB: VacancyDB });
