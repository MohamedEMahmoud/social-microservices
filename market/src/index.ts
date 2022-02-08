import mongoose from "mongoose";
import { v2 as Cloudinary } from "cloudinary";
import app from "./app";
(async () => {
    const Environment = [
        "MONGO_URI",
        "CLOUDINARY_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET"
    ];
    Environment.forEach(el => {
        if (!process.env[el]) {
            throw new Error(`${el} Must Be Defined`);
        }
    });
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        mongoose.Promise = global.Promise;
        console.log("Connected to MongoDB success From Market Service");

        await Cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => console.log("Listening To Port 3000! From Market Service"));
})();