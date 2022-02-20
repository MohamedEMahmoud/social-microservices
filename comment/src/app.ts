import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@mesocial/common";
import { newCommentRouter } from "./routes/new";
import { showCommentRouter } from "./routes/show";
import { updateCommentRouter } from "./routes/update";
import { deleteCommentRouter } from "./routes/delete";
import { showCommentByUserIdRouter } from "./routes/show-by-userId";
import { showAllCommentRouter } from "./routes/show-all";

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
    newCommentRouter,
    showCommentRouter,
    updateCommentRouter,
    deleteCommentRouter,
    showCommentByUserIdRouter,
    showAllCommentRouter,

]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;