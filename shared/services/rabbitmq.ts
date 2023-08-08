import * as amqplib from 'amqplib';
import { Channel } from 'amqplib';

export const createChannel = async ({
    AMQP_HOST,
    CHANNEL_EXCHANGE_NAME,
    CHANNEL_EXCHANGE_TYPE
}:{
    AMQP_HOST: string;
    CHANNEL_EXCHANGE_NAME: string;
    CHANNEL_EXCHANGE_TYPE:  string; // 'direct' | 'topic' | 'fanout' | 'headers';
}) => {
    try {
        const connection = await amqplib.connect(AMQP_HOST);
        const channel = await connection.createChannel();

        await channel.assertExchange(CHANNEL_EXCHANGE_NAME, CHANNEL_EXCHANGE_TYPE);

        console.log(`Connected to AMQP_HOST: ${AMQP_HOST}`);

        return channel;
    } catch (e) {
        throw Error(e as string);
    }
};

export const assertQueue = async ({
    channel,
    BINDING_KEY,
    CHANNEL_EXCHANGE_NAME,
    QUEUE_NAME
}:{
    channel: Channel;
    CHANNEL_EXCHANGE_NAME: string;
    BINDING_KEY: string;
    QUEUE_NAME: string;
}) => {
    try {
        const { queue } = await channel.assertQueue(QUEUE_NAME);

        channel.bindQueue(queue, CHANNEL_EXCHANGE_NAME, BINDING_KEY)
    } catch (e) {
        throw Error(e as string);
    }
};

export const publishMessage = async ({
    channel,
    queueName,
    data,
    event
}:{
    channel: Channel;
    queueName: string;
    data: Record<string, any>;
    event: string;
}) => {
    try {
        const message = JSON.stringify({ event, data });

        channel.sendToQueue(queueName, Buffer.from(message))
    } catch (e) {
        throw Error(e as string);
    }
};

export const subscribeMessage = async ({
    channel,
    queueName,
    options,
    service
}:{
    channel: Channel;
    queueName: string;
    options: Record<string, any>;
    service: any;
}) => {
    try {
        channel.prefetch(3);

        channel.consume(queueName, async data => {
            if(!data) {
                throw Error('No data passed in message')
            }

            const { content } = data;
            const { event, data: dataTransformed } = JSON.parse(content.toString());

            await service[event]({...dataTransformed, ...options})

            channel.ack(data);
        })
    } catch (e) {
        throw Error(e as string);
    }
};
