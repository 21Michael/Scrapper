import { asyncChunkScrapping, IFilterParams, syncChunkScrapping, transformScrappedCandidates, urlGenerator } from '../helpers';
import { scrapCandidates, scrapPagination } from '../../shared/services/scrapper';
import { ICandidate, TYPE_SECTIONS, ICandidateTransformed } from '../../shared/types';
import { DB } from '../../shared/services/db';
import { candidateModel } from '../../shared/models';

export const getCandidates = async ({
    fromCache,
    browser,
    filterParams,
    url,
    SCRAPPER_WORKER_HOST,
    section,
}:{
    fromCache: boolean;
    browser: any;
    filterParams: IFilterParams;
    SCRAPPER_WORKER_HOST: string;
    url: string;
    section: TYPE_SECTIONS;
}) => {
    console.log('-----------------candidates-----------------');

    const CandidateDB = new DB<ICandidateTransformed>({ model: candidateModel });

    if(fromCache) {
        const candidatesDB: ICandidateTransformed[] = await CandidateDB.getAll();

        return candidatesDB;
    }

    const urlCandidates = urlGenerator({ url, section, filterParams });

    console.log('urlCandidates', urlCandidates);

    const paginationCandidatesPages = await scrapPagination({ url: urlCandidates, browser });

    console.log('paginationPages:', paginationCandidatesPages.length);

    // const candidatesScrapped: ICandidate[][] = await syncChunkScrapping({
    //     paginationPages: paginationCandidatesPages,
    //     url: urlCandidates,
    //     browser,
    //     chunkSize: 40,
    //     scrapper: scrapCandidates
    // });

    const candidatesScrapped: ICandidate[][] = await asyncChunkScrapping({
        paginationPages: paginationCandidatesPages,
        url: urlCandidates,
        scrapperURL: `http://${SCRAPPER_WORKER_HOST}/scrapper-worker/candidates`,
        chunkSize: 10,
    });

    if(!candidatesScrapped.length) {
        return Error('Scrapping error');
    }

    await CandidateDB.deleteAll();

    const candidates = candidatesScrapped.flat(1);
    const candidatesTransformed = candidates.map(transformScrappedCandidates) as ICandidateTransformed[];

    await Promise.all(
        candidatesTransformed.map(async candidate => {
            await CandidateDB.create(candidate);
        })
    );

    return candidatesTransformed;
};
