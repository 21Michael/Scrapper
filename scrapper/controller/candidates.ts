import { Browser } from 'puppeteer';
import { IFilterParams, syncChunkScrapping, transformScrappedDate, urlGenerator } from '../helpers';
import { scrapCandidates, scrapPagination } from '../services/scrapper';
import { ICandidate, TYPE_SECTIONS, ICandidateTransformed } from '../../shared/types';
import { DB } from '../../shared/services/db';
import { candidateModel } from '../../shared/models';

export const getCandidates = async ({
    fromCache,
    browser,
    filterParams,
    url,
    section,
}:{
    fromCache: boolean;
    browser: Browser;
    filterParams: IFilterParams;
    url: string;
    section: TYPE_SECTIONS;
}) => {
    console.log('-----------------candidates-----------------');

    const CandidateDB = new DB<ICandidateTransformed>({ model: candidateModel });

    let candidates = [];

    if(fromCache) {
        candidates = await CandidateDB.getAll();
    }

    if(!fromCache || !candidates.length) {
        const urlCandidates = urlGenerator({ url, section, filterParams });

        console.log('urlCandidates', urlCandidates);

        const paginationCandidatesPages = await scrapPagination({ url: urlCandidates, browser });

        console.log('paginationPages:', paginationCandidatesPages.length);

        const candidatesScrapped = await syncChunkScrapping({
            paginationPages: paginationCandidatesPages,
            url: urlCandidates,
            browser,
            chunkSize: 100,
            scrapper: scrapCandidates
        });

        if(!candidatesScrapped.length) {
            return Error('Scrapping error');
        }

        await CandidateDB.deleteAll();

        candidates = candidatesScrapped.flat(1);

        const candidatesTransformed = candidates.map(transformScrappedDate) as ICandidateTransformed[];

        await Promise.all(
            candidatesTransformed.map(async candidate => {
                await CandidateDB.create(candidate);
            })
        );
    }

    return candidates;
};
