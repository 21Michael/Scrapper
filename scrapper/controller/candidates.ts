import { Browser } from 'puppeteer';
import { IFilterParams, syncChunkScrapping, transformScrappedDate, urlGenerator } from '../helpers';
import { scrapCandidates, scrapPagination } from '../services/scrapper';
import { ICandidate, TYPE_SECTIONS } from '../../shared/types';
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

    const CandidateDB = new DB<ICandidate>({ model: candidateModel });

    let candidates: ICandidate[] = [];

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
        candidates = candidates.map(transformScrappedDate) as ICandidate[];

        await Promise.all(
            candidates.map(async candidate => {
                await CandidateDB.create(candidate);
            })
        );
    }

    return candidates;
};
