import mongoose from "mongoose";
import { v2 as Cloudinary } from "cloudinary";
import { natsWrapper } from "./nats-wrapper";
import app from "./app";
import { ExpirationBanListener } from "./events/listeners/expiration-ban-listener";
(async () => {
    const Environment = [
        "MONGO_URI",
        "JWT_KEY",
        "CLOUDINARY_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "MAIL_USER",
        "MAIL_PASS",
        "MAIL_SERVER_PORT",
        "CLIENT_ID",
        "CLIENT_SECRET",
        "REFRESH_TOKEN",
        "REDIRECT_URI",
        "EXPIRATION_WINDOW_MILLIE_SECOND",
        "NATS_CLUSTER_ID",
        "NATS_CLIENT_ID",
        "NATS_URL"
    ];
    Environment.forEach(el => {
        if (!process.env[el]) {
            throw new Error(`${el} Must Be Defined`);
        }
    });
    try {

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);

        natsWrapper.client.on("close", () => {
            console.log("NATS Connection Closed! From Auth Service");
            process.exit();
        });

        natsWrapper.client.on("SIGINT", () => natsWrapper.client.close());
        natsWrapper.client.on("SIGTERM", () => natsWrapper.client.close());

        new ExpirationBanListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        mongoose.Promise = global.Promise;
        console.log("Connected to MongoDB success From Auth Service");

        await Cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => console.log("Listening To Port 3000! From Auth Service"));
})();