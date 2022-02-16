import mongoose from "mongoose";
import app from "./app";
import { ExpirationCompletedListener } from "./events/listeners/expiration-completed-listener";
import { ProductCreatedListener } from "./events/listeners/product-created-listener";
import { ProductUpdatedListener } from "./events/listeners/product-updated-listener";
import { natsWrapper } from "./nats-wrapper";
(async () => {
    const Environment = [
        "JWT_KEY",
        "MONGO_URI",
        "EXPIRATION_WINDOW_MILLIE_SECOND",
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

        new ProductCreatedListener(natsWrapper.client).listen();
        new ProductUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompletedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        mongoose.Promise = global.Promise;
        console.log("Connected to MongoDB success From Order Service");
    } catch (err) {
        console.error(err);

    }

    app.listen(3000, () => console.log("Listening To Port 3000! From Order Service"));
})();