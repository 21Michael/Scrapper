import {
    ICandidate,
    IVacancy,
    TYPE_COMPANY_TYPE,
    TYPE_EMPLOYMENT,
    TYPE_ENGlISH_LVL,
    TYPE_EXP_LVL,
    TYPE_OTHER,
    TYPE_PROGRAMMING_LANGUAGE,
    TYPE_REGION,
    TYPE_SECTIONS
} from '../../shared/types';
import { chunk } from 'lodash';
import { Browser } from 'puppeteer';
import { SECTIONS, MONTH_UKR_ARRAY } from '../../shared/constants';
import axios from 'axios';

export interface IFilterParams {
    region?: TYPE_REGION[];
    programmingLanguage?: TYPE_PROGRAMMING_LANGUAGE[];
    expLVL?: TYPE_EXP_LVL[];
    employment?: TYPE_EMPLOYMENT[];
    companyType?: TYPE_COMPANY_TYPE[];
    englishLVL?: TYPE_ENGlISH_LVL[];
    other?: TYPE_OTHER[];
}

export const urlGenerator = ({
    url,
    section,
    filterParams
}:{
    url: string;
    section: TYPE_SECTIONS;
    filterParams:IFilterParams;
}) => {
    const { region, programmingLanguage, expLVL, employment, companyType, englishLVL, other } = filterParams;

    let URl = `${url}/${section}/?`;

    if(region) {
        URl += region.map(region => `&region=${region}`).join('');
    }

    // Programming Language
    if(programmingLanguage && section === SECTIONS.jobs) {
        URl += programmingLanguage.map(programmingLanguage => `&primary_keyword=${programmingLanguage}`).join('');
    }

    if(programmingLanguage && section === SECTIONS.developers) {
        URl += programmingLanguage.map(programmingLanguage => `&title=${programmingLanguage}`).join('');
    }

    if(expLVL) {
        URl += expLVL.map(expLVL => `&exp_level=${expLVL}`).join('');
    }

    if(employment) {
        URl += employment.map(employment => `&employment=${employment}`).join('');
    }

    if(companyType) {
        URl += companyType.map(companyType => `&company_type=${companyType}`).join('');
    }

    if(englishLVL) {
        URl += englishLVL.map(englishLVL => `&english_level=${englishLVL}`).join('');
    }

    if(other) {
        URl += other.map(other => `&editorial=${other}`).join('');
    }

    return URl;
};

export const syncChunkScrapping = async ({
    url,
    browser,
    paginationPages,
    scrapper,
    chunkSize
}:{
    url: string;
    browser: Browser;
    paginationPages: any[];
    scrapper: any;
    chunkSize: number;
}) => {
    const chunks: any[] = chunk(paginationPages, chunkSize);

    const dataResponse = [];
    let chunkResponse = [];

    for(let i = 0; i < chunks.length;) {
        console.log('Chunk processing №:', i);

        chunkResponse = await Promise.all(chunks[i].map(async ({ href }: { href: string; }) => {
            return scrapper({ url: url + href, browser });
        }));

        if (chunkResponse.length) {
            dataResponse.push(...chunkResponse);

            chunkResponse.length = 0; // Reuse the array by clearing it
            chunks[i] = null; // Nullify the reference

            i++;
        }
    }

    return dataResponse;
};

export const asyncChunkScrapping = async ({
    url,
    paginationPages,
    scrapperURL,
    chunkSize
}:{
    url: string;
    paginationPages: any[];
    scrapperURL: string;
    chunkSize: number;
}) => {
    const chunks: any[] = chunk(paginationPages, chunkSize);

    const dataResponse = await Promise.all([chunks[0]].map(async (chunk: any) => {
        const { data } = await axios.post(scrapperURL, { chunk, url });

        console.log(data);
        return data;
    }));

    if(!dataResponse) {
        throw Error('asyncChunkScrapping error');
    }

    return dataResponse as any[];
};

export const transformScrappedVacancies = (data: IVacancy) => {
    const date = transformScrappedDate(data);
    const numbers = transformScrappedVacanciesNumbers(data);

    return {
        ...data,
        ...date,
        ...numbers
    };
};

export const transformScrappedCandidates = (data: ICandidate) => {
    const date = transformScrappedDate(data);
    const numbers = transformScrappedCandidatesNumbers(data);

    return {
        ...data,
        ...date,
        ...numbers
    };
};


const transformScrappedVacanciesNumbers = (data: IVacancy) => {
    const { responses, views, salaryForkMin, salaryForkMax } = data;

    return {
        responses: Number(responses),
        views: Number(views),
        salaryForkMin: Number(salaryForkMin) || null,
        salaryForkMax: Number(salaryForkMax) || null,
    };
};

const transformScrappedCandidatesNumbers = (data: ICandidate) => {
    const { views, salary } = data;

    const salaryNum = salary?.match(/\d+/g)?.[0];

    return {
        views: Number(views),
        salary: Number(salaryNum)
    };
};

const transformScrappedDate = (data: IVacancy | ICandidate) => {
    const { date } = data;
    let transformedDate = '';

    if(!date) {
        return { date: null };
    }

    if(date === 'сьогодні') {
        transformedDate = new Date().toISOString();
    }

    if(date === 'вчора') {
        const today = new Date();
        const yesterday = new Date(today);

        yesterday.setDate(today.getDate() - 1);

        transformedDate = yesterday.toISOString();
    }

    if(new RegExp(MONTH_UKR_ARRAY.join('|')).test(date)) {
        const monthRegExp = new RegExp(`${MONTH_UKR_ARRAY.join('|')}+`, 'g');

        const month = date.match(monthRegExp)?.[0];
        const day = date.match(/\d+/g)?.[0];

        if (!month || !day) {
            return { date: null };
        }

        const year = new Date().getFullYear();
        const monthNumber = MONTH_UKR_ARRAY.indexOf(month) + 1;

        transformedDate = `${year}-${monthNumber}-${day}`;
    }

    return { date: new Date(transformedDate) };
};
