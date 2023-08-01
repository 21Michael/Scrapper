import { scrapCandidates } from '../../shared/services/scrapper';

export const asyncScrappCandidates = async (req: any, res: any) => {
    try {
        const { chunk, url } = req.body;
        const { browser } = req.scrapp_config;

        console.log('Scrapper-worker candidates start');

        const scrappedData = await Promise.all(
            chunk.map(async ({ href }: { href: string; }) => {
                const res = await scrapCandidates({ url: url + href, browser });

                return res;
            })
        );

        console.log('Scrapper-worker finish');

        if (scrappedData) {
            res.json(scrappedData.flat(1));
        }
    } catch (err: any) {
        console.log(err);
        res.status(404).send(err.message);
    }
};
