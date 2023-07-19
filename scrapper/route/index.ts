import candidatesRouter from './candidates';
import vacanciesRouter from './vacancies';

import createRouter from 'express';

const router = createRouter.Router();

router.use('/candidates', candidatesRouter);
router.use('/vacancies', vacanciesRouter);

export default router;
