import Queue from "bull";
import { ExpirationBanPublisher } from "../events/publishers/expiration-ban-publisher";
import { natsWrapper } from "../nats-wrapper";

interface PayLoad {
    userId: string;
    banId: string;
}

const expirationQueue = new Queue<PayLoad>("ban:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    new ExpirationBanPublisher(natsWrapper.client).publish({
        userId: job.data.userId,
        banId: job.data.banId
    });
});

export { expirationQueue };