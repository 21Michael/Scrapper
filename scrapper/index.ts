import puppeteer from 'puppeteer';
import express from 'express';
import { defineRouter } from './route';
import { URL } from '../shared/constants';
import { connectToDB } from '../shared/services/db';
import { createChannel, assertQueue } from '../shared/services/rabbitmq';
import {
    AMQP_HOST,
    CHANNEL_EXCHANGE_NAME,
    CHANNEL_EXCHANGE_TYPE,
    DB_HOST,
    PORT,
    SCRAPPER_QUEUE,
    SCRAPPER_WORKER_HOST,
    SCRAPPER_BINDING_KEY,
} from './config';

const app = express();

app.use(express.json());

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const channelRabbitmq = await createChannel({
            AMQP_HOST,
            CHANNEL_EXCHANGE_NAME,
            CHANNEL_EXCHANGE_TYPE,
        });

        await assertQueue({
            channel: channelRabbitmq,
            BINDING_KEY: SCRAPPER_BINDING_KEY,
            CHANNEL_EXCHANGE_NAME,
            QUEUE_NAME: SCRAPPER_QUEUE
        });

        await connectToDB({ DB_HOST });

        const router = defineRouter({
            options: {
                browser,
                channelRabbitmq,
                URL,
                SCRAPPER_WORKER_HOST
            }
        });

        app.use('/scrapper', router);

        const server = app.listen(PORT, () => {
            console.log('Server works on port: ' + PORT);
        });

        process.on('SIGINT', async () => {
            console.log('Closing http server.');

            await browser.close();
            channelRabbitmq.close();

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
