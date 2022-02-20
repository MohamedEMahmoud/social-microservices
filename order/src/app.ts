import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@mesocial/common";
import { newOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes/index";
import { showOrderRouter } from "./routes/show";
import { updateOrderRouter } from "./routes/update";

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
    newOrderRouter,
    indexOrderRouter,
    showOrderRouter,
    updateOrderRouter,

]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;