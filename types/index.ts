import {
    SECTIONS,
    REGION,
    PROGRAMMING_LANGUAGE,
    EXP_LVL,
    EMPLOYMENT,
    COMPANY_TYPE,
    ENGlISH_LVL,
    OTHER
} from '../constants';
import { ICandidate, IVacancy } from './entities';

export type TYPE_SECTIONS = (typeof SECTIONS)[keyof typeof SECTIONS];
export type TYPE_REGION = (typeof REGION)[keyof typeof REGION];
export type TYPE_PROGRAMMING_LANGUAGE = (typeof PROGRAMMING_LANGUAGE)[keyof typeof PROGRAMMING_LANGUAGE];
export type TYPE_EXP_LVL = (typeof EXP_LVL)[keyof typeof EXP_LVL];
export type TYPE_EMPLOYMENT = (typeof EMPLOYMENT)[keyof typeof EMPLOYMENT];
export type TYPE_COMPANY_TYPE = (typeof COMPANY_TYPE)[keyof typeof COMPANY_TYPE];
export type TYPE_ENGlISH_LVL = (typeof ENGlISH_LVL)[keyof typeof ENGlISH_LVL];
export type TYPE_OTHER = (typeof OTHER)[keyof typeof OTHER];

export { ICandidate, IVacancy };
