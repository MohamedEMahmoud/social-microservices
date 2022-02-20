import mongoose from "mongoose";
import { v2 as Cloudinary } from "cloudinary";
import { natsWrapper } from "./nats-wrapper";
import app from "./app";
import { UserCreatedListener } from "./events/listeners/user-created-listener";
import { UserUpdatedListener } from "./events/listeners/user-updated-listener";
import { UserDeletedListener } from "./events/listeners/user-deleted-listener";
import { FollowCreatedListener } from "./events/listeners/follow-created-listener";
import { UnFollowCreatedListener } from "./events/listeners/unfollow-created-listener";
import { CommentCreatedListener } from "./events/listeners/comment-created-listener";
import { CommentDeletedListener } from "./events/listeners/comment-deleted-listener";
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
            console.log("NATS Connection Closed! From Post Service");
            process.exit();
        });

        natsWrapper.client.on("SIGINT", () => natsWrapper.client.close());
        natsWrapper.client.on("SIGTERM", () => natsWrapper.client.close());

        new UserCreatedListener(natsWrapper.client).listen();
        new UserUpdatedListener(natsWrapper.client).listen();
        new UserDeletedListener(natsWrapper.client).listen();
        new FollowCreatedListener(natsWrapper.client).listen();
        new UnFollowCreatedListener(natsWrapper.client).listen();
        new CommentCreatedListener(natsWrapper.client).listen();
        new CommentDeletedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        mongoose.Promise = global.Promise;
        console.log("Connected to MongoDB success From Post Service");

        await Cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => console.log("Listening To Port 3000! From Post Service"));
})();