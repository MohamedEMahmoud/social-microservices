import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@mesocial/common";
import { newProductRouter } from "./routes/new";
import { updateProductRouter } from "./routes/update";
import { like_unlikeProductRouter } from "./routes/like-unlike";
import { showProductRouter } from "./routes/show";
import { show_allProductRouter } from "./routes/show-all";
import { timeLineProductRouter } from "./routes/timeline";
import { searchProductRouter } from "./routes/search";
import { searchAllProductRouter } from "./routes/search-all";
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
    newProductRouter,
    updateProductRouter,
    like_unlikeProductRouter,
    showProductRouter,
    show_allProductRouter,
    timeLineProductRouter,
    searchProductRouter,
    searchAllProductRouter

]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;