import { defineCandidatesRouter } from './candidates';
import { defineVacanciesRouter } from './vacancies';
import createRouter, { IRouter } from 'express';

export const defineRouter = ({ options }: { options: Record<string, any> }): IRouter => {
    const router = createRouter.Router() as IRouter;

    const candidatesRouter = defineCandidatesRouter({ options });
    const vacanciesRouter = defineVacanciesRouter({ options });

    router.use('/candidates', candidatesRouter);
    router.use('/vacancies', vacanciesRouter);

    return router;
};
