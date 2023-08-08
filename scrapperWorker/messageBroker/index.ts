import { asyncScrappCandidates, asyncScrappVacancies } from '../controller';
import { subscribeMessage } from '../../shared/services/rabbitmq';
import { observeRequest } from '../../shared/services/RPC';
import { EVENT_SCRAPP_CANDIDATES, EVENT_SCRAPP_VACANCIES } from '../config';

const eventSubscriber = {
    [EVENT_SCRAPP_CANDIDATES]: asyncScrappCandidates,
    [EVENT_SCRAPP_VACANCIES]: asyncScrappVacancies
};

export const defineMessageBroker = ({ options }: { options: Record<string, any> }) => {
    const { SCRAPPER_QUEUE, channelRabbitmq, browser } = options;

    observeRequest({
        channel: channelRabbitmq,
        queueName: SCRAPPER_QUEUE,
        options: { browser },
        service: eventSubscriber
    });

    // subscribeMessage({
    //     channel: channelRabbitmq,
    //     queueName: SCRAPPER_QUEUE,
    //     options: { browser },
    //     service: eventSubscriber
    // });
};
