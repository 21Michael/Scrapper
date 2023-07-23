import mongoose from 'mongoose';
import { ICandidateTransformed, IVacancyTransformed } from '../types';
const { Schema } = mongoose;

export const candidateSchema = new Schema<ICandidateTransformed>({
    name: { type: String },
    href: { type: String },
    salary: { type: String },
    date: { type: Date },
    englishLevel: { type: String },
    expLVL: { type: String },
    city: { type: String },
    views: { type: String },
    skills: { type: [String] },
});

export const vacancySchema = new Schema<IVacancyTransformed>({
    name: { type: String },
    href: { type: String },
    date: { type: Date },
    views: { type: String },
    responses: { type: String },
    salaryForkMin: { type: String },
    salaryForkMax: { type: String },
    relocate: { type: Boolean },
    countries: { type: [String] },
    cities: { type: [String] },
    englishLevel: { type: String },
    companyType: { type: String },
    expLVL: { type: String },
});

export const candidateModel = mongoose.model('Candidate', candidateSchema);
export const vacancyModel = mongoose.model('Vacancy', vacancySchema);
