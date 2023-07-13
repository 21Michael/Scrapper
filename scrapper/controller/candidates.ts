import { Browser } from 'puppeteer';
import { IFilterParams, syncChunkScrapping, urlGenerator } from '../helpers';
import { scrapCandidates, scrapPagination } from '../services/scrapper';
import { ICandidate, TYPE_SECTIONS } from '../types';
const fs = require('fs');

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
    let candidates: ICandidate[] = [];

    if(fromCache) {
        const candidatesFile = await fs.readFileSync('./JSON/candidates.json');
        const candidatesFromFile = candidatesFile?.length ? JSON.parse(candidatesFile) : null;

        candidates = candidatesFromFile || [];
    }

    if(!fromCache || !candidates.length) {
        const urlCandidates = urlGenerator({ url, section, filterParams });

        const paginationCandidatesPages = await scrapPagination({ url: urlCandidates, browser });

        console.log('paginationPages:', paginationCandidatesPages.length);

        const candidatesScrapped = await syncChunkScrapping({
            paginationPages: paginationCandidatesPages,
            url: urlCandidates,
            browser,
            chunkSize: 100,
            scrapper: scrapCandidates
        });

        if(candidatesScrapped.length) {
            await fs.writeFileSync('./JSON/candidates.json', JSON.stringify(candidatesScrapped));
        }

        candidates = candidatesScrapped;
    }

    return candidates;
};
