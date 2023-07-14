import puppeteer from 'puppeteer';
import { URL, SECTIONS, PROGRAMMING_LANGUAGE, REGION } from './shared/constants';
import { getVacancies, getCandidates } from './controller';
import mongoose from 'mongoose';

(async () => {
    try {
        await mongoose.connect('mongodb://172.18.0.2:27017');

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        // Scrap Vacancies Data
        await getVacancies({
            url: URL,
            fromCache: true,
            section: SECTIONS.jobs,
            browser,
            filterParams: {
                region: [REGION.UKR],
                programmingLanguage: [PROGRAMMING_LANGUAGE['Node.js']]
            }
        });

        // console.log(vacancies);

        // Scrap Candidates Data
        await getCandidates({
            url: URL,
            fromCache: true,
            section: SECTIONS.developers,
            browser,
            filterParams: {
                region: [REGION.UKR],
                programmingLanguage: [PROGRAMMING_LANGUAGE['Node.js']]
            }
        });

        // console.log(candidates);
        console.log('Scrapping Finished');
        await browser.close();
    } catch (e) {
        console.log('Error:', e);
    }
})();
