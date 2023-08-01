import createRouter from 'express';
import { asyncScrappCandidates, asyncScrappVacancies } from '../controller';

const router = createRouter.Router();

router.post('/candidates', asyncScrappCandidates);
router.post('/vacancies', asyncScrappVacancies);

export default router;
