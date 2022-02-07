import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@mesocial/common";
import { newPostRouter } from "./routes/new";
import { updatePostRouter } from "./routes/update";
import { deletePostRouter } from "./routes/delete";
import { like_unlikePostRouter } from "./routes/like-unlike";
import { showPostRouter } from "./routes/show";
import { show_allPostRouter } from "./routes/show-all";
import { timeLinePostRouter } from "./routes/timeline";
import { searchPostRouter } from "./routes/search";
import { searchAllPostRouter } from "./routes/search-all";

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
    newPostRouter,
    updatePostRouter,
    deletePostRouter,
    like_unlikePostRouter,
    showPostRouter,
    show_allPostRouter,
    timeLinePostRouter,
    searchPostRouter,
    searchAllPostRouter

]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;