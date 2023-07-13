import puppeteer from 'puppeteer';
import { URL, SECTIONS, PROGRAMMING_LANGUAGE, REGION } from './constants';
import { getVacancies, getCandidates } from './controller';
const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect('mongodb://scrapper-db:27017/scrapper');

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        // Scrap Vacancies Data
        const vacancies = await getVacancies({
            url: URL,
            fromCache: true,
            section: SECTIONS.jobs,
            browser,
            filterParams: {
                region: [REGION.UKR],
                programmingLanguage: [PROGRAMMING_LANGUAGE['Node.js']]
            }
        });

        vacancies.forEach(vacancy => {
            console.log(vacancy);
        });

        // Scrap Candidates Data
        const candidates = await getCandidates({
            url: URL,
            fromCache: true,
            section: SECTIONS.developers,
            browser,
            filterParams: {
                region: [REGION.UKR],
                programmingLanguage: [PROGRAMMING_LANGUAGE['Node.js']]
            }
        });

        candidates.forEach(candidate => {
            console.log(candidate);
        });

        await browser.close();
    } catch (e) {
        console.log('Error:', e);
    }
})();
