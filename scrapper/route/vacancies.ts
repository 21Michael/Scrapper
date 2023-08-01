import createRouter from 'express';
import { getVacancies } from '../controller';
import { IVacancyTransformed } from '../../shared/types';
import { SECTIONS } from '../../shared/constants';

const router = createRouter.Router();

const routes = {
    scrapp: async (req: any, res: any) => {
        try {
            const { fromCache, filterParams } = req.query;
            const { url, browser, SCRAPPER_WORKER_HOST } = req.scrapp_config;

            const vacancies: IVacancyTransformed[] | Error = await getVacancies({
                url,
                SCRAPPER_WORKER_HOST,
                fromCache: fromCache === 'true',
                section: SECTIONS.jobs,
                browser,
                filterParams: JSON.parse(filterParams)
            });

            if (vacancies) {
                res.json(vacancies);
            }
        } catch (err: any) {
            res.status(404).send(err.message);
        }
    },
};

router.get('/scrapp', routes.scrapp);

export default router;
