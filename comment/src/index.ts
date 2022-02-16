import mongoose from "mongoose";
import { v2 as Cloudinary } from "cloudinary";
import { natsWrapper } from "./nats-wrapper";
import app from "./app";

(async () => {
    const Environment = [
        "JWT_KEY",
        "MONGO_URI",
        "CLOUDINARY_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
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
            console.log("NATS Connection Closed! From Comment Service");
            process.exit();
        });

        natsWrapper.client.on("SIGINT", () => natsWrapper.client.close());
        natsWrapper.client.on("SIGTERM", () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        mongoose.Promise = global.Promise;
        console.log("Connected to MongoDB success From Comment Service");

        await Cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => console.log("Listening To Port 3000! From Comment Service"));
})();