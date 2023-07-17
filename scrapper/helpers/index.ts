import {
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
import { SECTIONS } from '../../shared/constants';

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
        console.log(i);

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
