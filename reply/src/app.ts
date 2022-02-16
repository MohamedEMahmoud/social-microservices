import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@mesocial/common";

const app = express();

app.set("trust proxy", true);

app.use([
    json(),
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test"
    }),
    morgan("dev"),
    currentUser,


]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;