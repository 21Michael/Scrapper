import { IFilterParams, syncChunkScrapping, urlGenerator } from '../helpers';
import { scrapPagination, scrapVacancies } from '../services/scrapper';
import { Browser } from 'puppeteer';
import { IVacancy, TYPE_SECTIONS } from '../shared/types';
import { DB } from '../shared/services/db';
import { vacancyModel } from '../shared/models';

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
    const VacancyDB = new DB<IVacancy>({ model: vacancyModel });
    let vacancies: IVacancy[] = [];

    if(fromCache) {
        vacancies = await VacancyDB.getAll();
    }

    if(!fromCache || !vacancies.length) {
        const urlVacancies = urlGenerator({ url, section, filterParams });

        const paginationVacanciesPages = await scrapPagination({ url: urlVacancies, browser });

        console.log('paginationPages:', paginationVacanciesPages.length);

        const vacanciesScrapped = await syncChunkScrapping({
            paginationPages: paginationVacanciesPages,
            url: urlVacancies,
            browser,
            chunkSize: 50,
            scrapper: scrapVacancies
        });

        if(!vacanciesScrapped.length) {
            return Error('Scrapping error');
        }

        await VacancyDB.deleteAll();

        vacancies = vacanciesScrapped.flat(1);

        await Promise.all(
            vacancies.map(async vacancy => {
                await VacancyDB.create(vacancy);
            })
        );
    }

    return vacancies;
};
