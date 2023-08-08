import { asyncScrappVacancies } from '../controller';

export const defineVacanciesRouter = ({ options }:{ options: Record<string, any>; }) => {
    return async (req: any, res: any) => {
        try {
            const { chunk, url } = req.body;
            const { browser } = options;

            const scrappedData = await asyncScrappVacancies({
                chunk,
                url,
                browser
            });

            if (scrappedData) {
                res.json(scrappedData.flat(1));
            }
        } catch (err: any) {
            console.log(err);
            res.status(404).send(err.message);
        }
    };
};
