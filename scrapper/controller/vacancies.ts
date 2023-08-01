import {
    asyncChunkScrapping,
    IFilterParams,
    syncChunkScrapping,
    transformScrappedVacancies,
    urlGenerator
} from '../helpers';
import { scrapPagination, scrapVacancies } from '../../shared/services/scrapper';
import { IVacancy, IVacancyTransformed, TYPE_SECTIONS } from '../../shared/types';
import { DB } from '../../shared/services/db';
import { vacancyModel } from '../../shared/models';

export const getVacancies = async ({
    fromCache,
    browser,
    filterParams,
    SCRAPPER_WORKER_HOST,
    url,
    section
}:{
    fromCache: boolean;
    browser: any;
    filterParams: IFilterParams;
    SCRAPPER_WORKER_HOST: string;
    url: string;
    section: TYPE_SECTIONS;
}) => {
    console.log('-----------------vacancies-----------------');

    const VacancyDB = new DB<IVacancyTransformed>({ model: vacancyModel });

    if(fromCache) {
        const vacanciesDB: IVacancyTransformed[] = await VacancyDB.getAll();

        return vacanciesDB;
    }

    const urlVacancies = urlGenerator({ url, section, filterParams });

    console.log('urlVacancies', urlVacancies);

    const paginationVacanciesPages = await scrapPagination({ url: urlVacancies, browser });

    console.log('paginationPages:', paginationVacanciesPages.length);

    // const vacanciesScrapped = await syncChunkScrapping({
    //     paginationPages: paginationVacanciesPages,
    //     url: urlVacancies,
    //     browser,
    //     chunkSize: 50,
    //     scrapper: scrapVacancies
    // });

    const vacanciesScrapped: IVacancy[][] = await asyncChunkScrapping({
        paginationPages: paginationVacanciesPages,
        url: urlVacancies,
        scrapperURL: `http://${SCRAPPER_WORKER_HOST}/scrapper-worker/vacancies`,
        chunkSize: 10,
    });


    if(!vacanciesScrapped.length) {
        return Error('Scrapping error');
    }

    await VacancyDB.deleteAll();

    const vacancies = vacanciesScrapped.flat(1);
    const vacanciesTransformed = vacancies.map(transformScrappedVacancies) as IVacancyTransformed[];

    await Promise.all(
        vacanciesTransformed.map(async vacancy => {
            await VacancyDB.create(vacancy);
        })
    );

    return vacanciesTransformed;
};
