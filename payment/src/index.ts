import mongoose from "mongoose";
import app from "./app";
(async () => {
    const Environment = [
        "JWT_KEY",
        "MONGO_URI",
        "STRIPE_KEY"
    ];
    Environment.forEach(el => {
        if (!process.env[el]) {
            console.log(el);
            throw new Error(`${el} Must Be Defined`);
        }
    });
    try {
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