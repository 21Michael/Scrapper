import { CandidateController } from "../controller";
import createRouter from "express";
import { ICandidateTransformed } from '../../shared/types';

const router = createRouter.Router();

const routes = {
  getAll: async (req: any, res: any) => {
    try {
      const sortParams = req.query as Record<string, 1 | -1>;
      const candidates: ICandidateTransformed[] = await CandidateController.getAll({ sortParams });

      if (candidates) {
        res.json(candidates);
      }
    } catch (err: any) {
      res.status(404).send(err.message);
    }
  },
  create: async (req: any, res: any) => {
    try {
      const candidate: ICandidateTransformed = req.body as ICandidateTransformed;
      const newCandidate: ICandidateTransformed = await CandidateController.create(candidate);

      if (newCandidate) {
        res.json(newCandidate);
      }
    } catch (err: any) {
      res.status(404).send(err.message);
    }
  },
  deleteAll: async (req: any, res: any) => {
    try {
      await CandidateController.deleteAll();

    } catch (err: any) {
      res.status(404).send(err.message);
    }
  }
}

router.get("/", routes.getAll);
router.post("/", routes.create);
router.delete("/", routes.deleteAll);

export default router;
