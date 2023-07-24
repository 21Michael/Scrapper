import { VacancyController } from "../controller";
import createRouter from "express";
import { IVacancyTransformed } from '../../shared/types';

const router = createRouter.Router();

const routes = {
  getAll: async (req: any, res: any) => {
    try {
      const sortParams = req.query as Record<string, 1 | -1>;
      const vacancies: IVacancyTransformed[] = await VacancyController.getAll({ sortParams });

      if (vacancies) {
        res.json(vacancies);
      }
    } catch (err: any) {
      res.status(404).send(err.message);
    }
  },
  create: async (req: any, res: any) => {
    try {
      const vacancy: IVacancyTransformed = req.body as IVacancyTransformed;
      const newVacancy: IVacancyTransformed = await VacancyController.create(vacancy);

      if (newVacancy) {
        res.json(newVacancy);
      }
    } catch (err: any) {
      res.status(404).send(err.message);
    }
  },
  deleteAll: async (req: any, res: any) => {
    try {
      await VacancyController.deleteAll();

    } catch (err: any) {
      res.status(404).send(err.message);
    }
  }
}

router.get("/", routes.getAll);
router.post("/", routes.create);
router.delete("/", routes.deleteAll);

export default router;
