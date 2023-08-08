import puppeteer from 'puppeteer';
import 'dotenv/config';
import express from 'express';
import { defineRouter } from './route';
import { createChannel, assertQueue } from '../shared/services/rabbitmq';
import {
    AMQP_HOST,
    CHANNEL_EXCHANGE_NAME,
    CHANNEL_EXCHANGE_TYPE,
    PORT,
    SCRAPPER_QUEUE,
    SCRAPPER_WORKER_HOST,
    SCRAPPER_BINDING_KEY,
} from './config';
import { defineMessageBroker } from './messageBroker';

const app = express();

app.use(express.json());

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            timeout: 150000,
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

        defineMessageBroker({
            options: {
                browser,
                channelRabbitmq,
                URL,
                SCRAPPER_WORKER_HOST,
                SCRAPPER_QUEUE,
            }
        });

        const router = defineRouter({
            options: {
                browser,
                URL,
                SCRAPPER_WORKER_HOST,
            }
        });

        app.use('/scrapper-worker', router);

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
