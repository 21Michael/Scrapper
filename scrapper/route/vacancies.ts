import createRouter, { IRouter } from 'express';
import { getVacancies } from '../controller';
import { IVacancyTransformed } from '../../shared/types';
import { SECTIONS } from '../../shared/constants';

const routesConstructor = ({ options }:{ options: Record<string, any>; }) => ({
    scrapp: async (req: any, res: any) => {
        try {
            const { fromCache, filterParams } = req.query;
            const { URL, browser, SCRAPPER_WORKER_HOST, channelRabbitmq } = options;

            const vacancies: IVacancyTransformed[] | Error = await getVacancies({
                channel: channelRabbitmq,
                url: URL,
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
});

export const defineVacanciesRouter = ({
    options
}:{
    options: Record<string, any>;
}): IRouter => {
    const routes = routesConstructor({ options });
    const router = createRouter.Router() as IRouter;

    router.get('/scrapp', routes.scrapp);

    return router;
};
