import { scrapCandidates } from '../../shared/services/scrapper';
import { Browser } from 'puppeteer';

export const asyncScrappCandidates = async ({
    chunk,
    url,
    browser
}:{
    chunk: any;
    url: string;
    browser: Browser;
}) => {
    console.log('Scrapper-worker candidates start');

    const scrappedData = await Promise.all(
        chunk.map(async ({ href }: { href: string; }) => {
            const res = await scrapCandidates({ url: url + href, browser });

            return res;
        })
    );

    console.log('Scrapper-worker finish', scrappedData.length);

    return scrappedData;
};
