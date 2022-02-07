import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@mesocial/common";
import { signupRouter } from "./routes/signup";
import { activeRouter } from "./routes/active";
import { signinRouter } from "./routes/signin";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { forgetPasswordRouter } from "./routes/forget-password";
import { checkPasswordKeyRouter } from "./routes/check-password-key";
import { resetPasswordRouter } from "./routes/reset-password";
import { resendKeyRouter } from "./routes/resend-key";
import { updateProfileRouter } from "./routes/update-profile";
import { deleteProfileRouter } from "./routes/delete-profile";
import { followUserRouter } from "./routes/follow-user";
import { unfollowUserRouter } from "./routes/unfollow-user";
import { adminListOfUsers } from "./routes/admin-list-of-users";
import { adminDeleteUsers } from "./routes/admin-delete-users";
import { adminBanUsers } from "./routes/admin-ban-users";
import { adminDeleteBan } from "./routes/admin-delete-ban";


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
    forgetPasswordRouter,
    checkPasswordKeyRouter,
    resetPasswordRouter,
    resendKeyRouter,
    currentUser,
    activeRouter,
    updateProfileRouter,
    deleteProfileRouter,
    followUserRouter,
    unfollowUserRouter,
    adminListOfUsers,
    adminDeleteUsers,
    adminBanUsers,
    adminDeleteBan,


]);

app.use("*", async () => { throw new NotFoundError(); }, errorHandler);

export default app;