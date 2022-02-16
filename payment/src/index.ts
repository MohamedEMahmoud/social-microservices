import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import app from "./app";

(async () => {
    const Environment = [
        "JWT_KEY",
        "MONGO_URI",
        "STRIPE_KEY",
        "NATS_CLUSTER_ID",
        "NATS_CLIENT_ID",
        "NATS_URL"
    ];
    Environment.forEach(el => {
        if (!process.env[el]) {
            console.log(el);
            throw new Error(`${el} Must Be Defined`);
        }
    });
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);

        natsWrapper.client.on("close", () => {
            console.log("NATS Connection Closed! From Order Service");
            process.exit();
        });

        natsWrapper.client.on("SIGINT", () => natsWrapper.client.close());
        natsWrapper.client.on("SIGTERM", () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        mongoose.Promise = global.Promise;
        console.log("Connected to MongoDB success From Payment Service");
    } catch (err) {
        console.error(err);

    }

    app.listen(3000, () => console.log("Listening To Port 3000! From Payment Service"));
})();