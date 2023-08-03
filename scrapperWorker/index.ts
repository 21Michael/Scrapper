import puppeteer from 'puppeteer';
import 'dotenv/config';
import express from 'express';
import routes from './route';

const app = express();
const port: string | number = process.env.PORT || 4002;

app.use(express.json());

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            timeout: 150000,
            args: ['--no-sandbox']
        });

        app.use('/scrapper-worker', function (req: any, res: any, next) {
            req.scrapp_config = {
                browser
            };
            next();
        }, routes);

        const server = app.listen(port, () => {
            console.log('Server works on port: ' + port);
        });

        process.on('SIGINT', async () => {
            console.log('Closing http server.');

            await browser.close();

            server.close((err) => {
                console.log('Http server closed.');
                process.exit(err ? 1 : 0);
            });
        });
    } catch (e) {
        console.log('Error:', e);

        process.exit(1);
    }
})();
