import { IFilterParams, syncChunkScrapping, urlGenerator } from '../helpers';
import { scrapPagination, scrapVacancies } from '../services/scrapper';
import { Browser } from 'puppeteer';
import { IVacancy, TYPE_SECTIONS } from '../types';
const fs = require('fs');

export const getVacancies = async ({
    fromCache,
    browser,
    filterParams,
    url,
    section
}:{
    fromCache: boolean;
    browser: Browser;
    filterParams: IFilterParams;
    url: string;
    section: TYPE_SECTIONS;
}) => {
    let vacancies: IVacancy[] = [];

    if(fromCache) {
        const vacanciesFile = await fs.readFileSync('./JSON/vacancies.json');
        const vacanciesFromFile = vacanciesFile?.length ? JSON.parse(vacanciesFile) : null;

        vacancies = vacanciesFromFile || [];
    }

    if(!fromCache || !vacancies.length) {
        const urlVacancies = urlGenerator({ url, section, filterParams });

        const paginationVacanciesPages = await scrapPagination({ url: urlVacancies, browser });

        console.log('paginationPages:', paginationVacanciesPages.length);

        if(!vacancies.length) {
            const vacanciesScrapped = await syncChunkScrapping({
                paginationPages: paginationVacanciesPages,
                url: urlVacancies,
                browser,
                chunkSize: 50,
                scrapper: scrapVacancies
            });

            if(vacanciesScrapped.length) {
                await fs.writeFileSync('./JSON/vacancies.json', JSON.stringify(vacanciesScrapped));
            }

            vacancies = vacanciesScrapped;
        }
    }

    return vacancies;
};
