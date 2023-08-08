import 'dotenv/config';

const AMQP_HOST: string = process.env.AMQP_HOST || '';
const CHANNEL_EXCHANGE_NAME: string = process.env.CHANNEL_EXCHANGE_NAME || '';
const CHANNEL_EXCHANGE_TYPE: string = process.env.CHANNEL_EXCHANGE_TYPE || '';
const SCRAPPER_QUEUE: string = process.env.SCRAPPER_QUEUE || '';
const PORT: string | number = process.env.PORT || 4000;
const SCRAPPER_WORKER_HOST: string = process.env.SCRAPPER_WORKER_HOST || '';
const SCRAPPER_BINDING_KEY: string = process.env.SCRAPPER_BINDING_KEY || '';
const EVENT_SCRAPP_CANDIDATES: string = process.env.EVENT_SCRAPP_CANDIDATES || '';
const EVENT_SCRAPP_VACANCIES: string = process.env.EVENT_SCRAPP_VACANCIES || '';

export {
    AMQP_HOST,
    CHANNEL_EXCHANGE_NAME,
    CHANNEL_EXCHANGE_TYPE,
    SCRAPPER_QUEUE,
    PORT,
    SCRAPPER_WORKER_HOST,
    SCRAPPER_BINDING_KEY,
    EVENT_SCRAPP_CANDIDATES,
    EVENT_SCRAPP_VACANCIES
};
