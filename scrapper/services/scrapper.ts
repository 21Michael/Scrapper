import { Browser } from 'puppeteer';
import { EXP_LVL_ARRAY, COMPANY_TYPE_ARRAY, ENGlISH_LVL_ARRAY, MONTH_UKR_ARRAY, CITY_UKR_ARRAY, HREF_PREFIX } from '../../shared/constants';
import { ICandidate, IVacancy } from '../../shared/types';

export const scrapPagination = async ({
    url,
    browser,
}:{
    url: string;
    browser: Browser;
}) => {
    const page = await browser.newPage();

    await page.goto(url);

    const paginationPages = await page.evaluate(() => {
        const paginationPages = [];

        const paginationElement = document.querySelector('.pagination') as Element;
        const pageElements = Array.from(paginationElement.querySelectorAll('.page-item > a'));
        const lastPageElement = pageElements[pageElements.length - 2];

        const lastPage = {
            href: lastPageElement.getAttribute('href'),
            num: Number(lastPageElement.innerHTML)
        };

        for (let i = 1; i <= lastPage.num; i++) {
            paginationPages.push({
                href: '&page=' + String(i),
                num: i
            });
        }

        return paginationPages;
    });

    return paginationPages;
};


export const scrapCandidates = async ({
    url,
    browser,
}:{
    url: string;
    browser: Browser;
}) => {
    const page = await browser.newPage();

    await page.goto(url);

    const candidatesPages: ICandidate[] = await page.evaluate((HREF_PREFIX, EXP_LVL_ARRAY, COMPANY_TYPE_ARRAY, ENGlISH_LVL_ARRAY, MONTH_UKR_ARRAY, CITY_UKR_ARRAY) => {
        const englishLevelRegExp = new RegExp(`${ENGlISH_LVL_ARRAY.join('|')}+`, 'g');

        const todayRegExp = new RegExp('(сьогодні)|(вчора)', 'g');
        const monthRegExp = new RegExp(`(${MONTH_UKR_ARRAY.join('|')})`, 'g');

        const cityRegExp = new RegExp(`${CITY_UKR_ARRAY.join('|')}`, 'g');

        const candidatesElement = document.querySelector('.searchresults') as Element;
        const candidatesElements = Array.from(candidatesElement.querySelectorAll('.card'));

        return candidatesElements.map(( candidate: any) => {
            const developerDetailsElement = candidate.querySelector('.order-1').lastElementChild;
            const developerDetailsElementText = developerDetailsElement?.textContent;
            const dateElementText = developerDetailsElement.firstElementChild.textContent.replace(/\s/g, '');

            const nameText = candidate.querySelector('.profile').textContent;
            const href = candidate.querySelector('.profile').getAttribute('href');
            const salaryText = candidate.querySelector('.text-success').textContent;
            const viewsText = candidate.querySelector('.card-footer').lastElementChild.textContent;
            const skillsText = candidate.querySelector('.card-body').lastElementChild.lastElementChild.textContent;

            const englishLevel = developerDetailsElementText.match(englishLevelRegExp)?.[0] || null;
            const expLVL = developerDetailsElementText.match(/(Без досвіду)|(\d+.*досвіду)/g)?.[0] || null;

            const today = dateElementText.match(todayRegExp)?.[0] || null;
            const day = dateElementText.match(/(?<=Опубліковано)\d+/g)?.[0] || null;
            const month = dateElementText.match(monthRegExp)?.[0] || null;

            const city = developerDetailsElementText.match(cityRegExp)?.[0] || null;
            const name = nameText.match(/\w+/g)?.join(' ') || null;
            const salary = salaryText.match(/\$\d+/g)?.[0] || null;
            const views = viewsText.match(/\d+/g)?.[0] || null;
            const skills = skillsText.match(/\w+/gi) || null;

            return {
                name: developerDetailsElementText,
                href: HREF_PREFIX + href,
                salary,
                date: today || (day + ' ' + month),
                englishLevel,
                expLVL,
                city,
                views,
                skills
            };
        });

    }, HREF_PREFIX, EXP_LVL_ARRAY, COMPANY_TYPE_ARRAY, ENGlISH_LVL_ARRAY, MONTH_UKR_ARRAY, CITY_UKR_ARRAY);

    await page.close();

    return candidatesPages;
};

export const scrapVacancies = async ({
    url,
    browser,
}:{
    url: string;
    browser: Browser;
}) => {
    const page = await browser.newPage();

    await page.goto(url);

    const vacanciesPages: IVacancy[] = await page.evaluate( (HREF_PREFIX, EXP_LVL_ARRAY, COMPANY_TYPE_ARRAY, ENGlISH_LVL_ARRAY) => {
        const englishLevelRegExp = new RegExp(`${ENGlISH_LVL_ARRAY.join('|')}+`, 'g');
        const companyTypeRegExp = new RegExp(`${COMPANY_TYPE_ARRAY.join('|')}+`, 'g');

        const vacancyElement = document.querySelector('.list-jobs') as Element;
        const vacancyElements = Array.from(vacancyElement.querySelectorAll('li'));

        return vacancyElements.map((vacancy: any) => {
            const dateText = vacancy.querySelector('.text-date').firstChild.textContent;
            const viewsText = vacancy.querySelectorAll('.text-date > span')[0].textContent;
            const responsesText = vacancy.querySelectorAll('.text-date > span')[1].textContent;
            const salaryText = vacancy.querySelector('.public-salary-item')?.textContent;
            const locationText = vacancy.querySelector('.location-text')?.textContent;
            const jobDetailsElementText = vacancy.querySelector('.list-jobs__details__info')?.textContent;
            const titleElement = vacancy.querySelector('.list-jobs__title > a');
            const titleElementText = titleElement.textContent;

            const salaryFork = salaryText && {
                min: salaryText.match(/\d+/g)[0],
                max: salaryText.match(/\d+/g)[1],
            };
            const location = {
                relocate: locationText.includes('Релокейт'),
                countries: locationText.match(/(?![^(]*\))([^\(\)]+)/g)?.[0].replace('Релокейт','')?.match(/[а-яії]+/gi),
                cities: locationText.match(/\((.*)?\)/g)?.[0].match(/[а-яії]+/gi),
            };

            const englishLevel = jobDetailsElementText.match(englishLevelRegExp)?.[0] || null;
            const companyType = jobDetailsElementText.match(companyTypeRegExp)?.[0] || null;
            const expLVL = jobDetailsElementText.match(/(Без досвіду)|(\d+.*досвіду)/g)?.[0] || null;
            const date = dateText.match(/(\d+\s[а-я]+\s*|сьогодні)/)?.[0].trim() || null;
            const views = viewsText.match(/(\d+)/)?.[0].trim() || null;
            const responses = responsesText.match(/(\d+)/)?.[0].trim() || null;
            const name = titleElementText.match(/(\w+)/gi)?.join(' ') || null;
            const href = titleElement.getAttribute('href') || null;

            return {
                name,
                href: HREF_PREFIX + href,
                date,
                views,
                responses,
                salaryForkMin: salaryFork?.min || null,
                salaryForkMax: salaryFork?.max || null,
                relocate: location?.relocate,
                countries: location?.countries || null,
                cities: location?.cities || null,
                englishLevel,
                companyType,
                expLVL
            };
        });
    }, HREF_PREFIX, EXP_LVL_ARRAY, COMPANY_TYPE_ARRAY, ENGlISH_LVL_ARRAY);

    await page.close();

    return vacanciesPages;
};
