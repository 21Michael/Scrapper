import { Channel } from 'amqplib';
import { v4 as uuid4 } from 'uuid';

const publishMessage = async ({
    channel,
    data,
    queueName,
    event
}:{
    channel: Channel;
    data: Record<string, any>;
    queueName: string;
    event: string;
}) => {
    // 1) Send message to SCRAPPER_QUEUE
    const messageUUID = uuid4();
    const message = JSON.stringify({ event, data });

    const requestQueue = queueName;
    const replyQueue = await channel.assertQueue("");

    channel.sendToQueue(requestQueue, Buffer.from(message), {
        replyTo: replyQueue.queue,
        correlationId: messageUUID
    });

    // 2) Get message from replyQueue (unique queue without name)
    return new Promise((resolve) => {
        channel.consume(replyQueue.queue, message => {
            if (!message) {
                throw Error('No data passed in message')
            }

            const { content, properties } = message;
            const { correlationId } = properties;
            const { data } = JSON.parse(content.toString());

            if (correlationId === messageUUID) {
                resolve(data);
            }
        },{ noAck: true })
    })
}

export const sendRequest = async ({
    ...props
}:{
    channel: Channel;
    data: Record<string, any>;
    queueName: string;
    event: string;
}) => {
    return await publishMessage({ ...props });
}

export const observeRequest = async ({
    channel,
    service,
    queueName,
    options,
}:{
    channel: Channel;
    service: Record<string, any>;
    queueName: string;
    options: Record<string, any>;
}) => {
    const requestQueue = queueName;

    channel.prefetch(3);

    channel.consume(requestQueue, async message => {
        // 1) Get message from SCRAPPER_QUEUE
        if(!message) {
            throw Error('No data passed in message')
        }

        const { content, properties } = message;
        const { replyTo: replyQueue, correlationId: messageUUID } = properties;
        const { event, data: dataTransformed } = JSON.parse(content.toString());

        const responseData = await service[event]({...dataTransformed, ...options})

        const replyMessage = JSON.stringify({ data: responseData });

        // 2) Send response message by replyQueue (unique queue without name)
        channel.sendToQueue(replyQueue, Buffer.from(replyMessage), {
            replyTo: replyQueue,
            correlationId: messageUUID
        });
        channel.ack(message);
    }, { noAck: false })
}
