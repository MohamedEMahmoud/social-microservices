import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@mesocial/common";
import { updateReplyRouter } from "./routes/update";
import { newReplyRouter } from "./routes/new";
import { deleteReplyRouter } from "./routes/delete";
import { showAllCommentRouter } from "./routes/show-all";
import { showReplyRouter } from "./routes/show";
import { showCommentByUserIdRouter } from "./routes/show-by-userId";

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
    newReplyRouter,
    updateReplyRouter,
    deleteReplyRouter,
    showReplyRouter,
    showAllCommentRouter,
    showCommentByUserIdRouter,

]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;