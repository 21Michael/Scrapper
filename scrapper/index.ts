import puppeteer from 'puppeteer';
import express from 'express';
import 'dotenv/config';
import routes from './route';
import { URL } from '../shared/constants';
import { connectToDB } from '../shared/services/db';

const app = express();
const port: string | number = process.env.PORT || 4000;

app.use(express.json());

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        await connectToDB();

        app.use('/', function (req: any, res: any, next) {
            req.scrapp_config = {
                browser,
                url: URL
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
