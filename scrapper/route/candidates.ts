import createRouter, { IRouter } from 'express';
import { getCandidates } from '../controller';
import { ICandidateTransformed } from '../../shared/types';
import { SECTIONS } from '../../shared/constants';

const routesConstructor = ({ options }:{ options: Record<string, any>; }) => ({
    scrapp: async (req: any, res: any) => {
        try {
            const { fromCache, filterParams } = req.query;
            const { URL, browser, SCRAPPER_WORKER_HOST, channelRabbitmq } = options;

            const candidates: ICandidateTransformed[] | Error = await getCandidates({
                channel: channelRabbitmq,
                url: URL,
                SCRAPPER_WORKER_HOST,
                fromCache: fromCache === 'true',
                section: SECTIONS.developers,
                browser,
                filterParams: JSON.parse(filterParams)
            });

            if (candidates) {
                res.json(candidates);
            }
        } catch (err: any) {
            res.status(404).send(err.message);
        }
    },
});

export const defineCandidatesRouter = ({ options }:{ options: Record<string, any>; }): IRouter => {
    const routes = routesConstructor({ options });
    const router = createRouter.Router() as IRouter;

    router.get('/scrapp', routes.scrapp);

    return router;
};
