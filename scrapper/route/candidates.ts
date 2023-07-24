import createRouter from 'express';
import { getCandidates } from '../controller';
import { ICandidateTransformed } from '../../shared/types';
import { SECTIONS } from '../../shared/constants';

const router = createRouter.Router();

const routes = {
    scrapp: async (req: any, res: any) => {
        try {
            const { fromCache, filterParams } = req.query;
            const { url, browser } = req.scrapp_config;

            const candidates: ICandidateTransformed[] | Error = await getCandidates({
                url,
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
};

router.get('/scrapp', routes.scrapp);

export default router;
