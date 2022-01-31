import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler } from "@mesocial/common";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
const app = express();

app.set("trust proxy", true);

app.use([
    json(),
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test"
    }),
    morgan("dev"),
    signupRouter,
    signinRouter,
    currentUserRouter,
    signoutRouter,

]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;