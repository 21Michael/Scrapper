import { scrapVacancies } from '../../shared/services/scrapper';
import { Browser } from 'puppeteer';

export const asyncScrappVacancies = async ({
    chunk,
    url,
    browser
}:{
    chunk: any;
    url: string;
    browser: Browser;
}) => {
    console.log('Scrapper-worker vacancies start');

    const scrappedData = await Promise.all(
        chunk.map(async ({ href }: { href: string; }) => {
            const res = await scrapVacancies({ url: url + href, browser });

            return res;
        })
    );

    console.log('Scrapper-worker finish');

    return scrappedData;
};
