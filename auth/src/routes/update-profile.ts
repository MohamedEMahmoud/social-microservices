import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, upload, validateImage } from "@mesocial/common";
import { User } from "../models/user.model";
import { v2 as Cloudinary } from "cloudinary";
import { Password } from "../services/Password";
import _ from "lodash";

const router = express.Router();

router.patch("/api/auth/user",
    upload.fields([{ name: "profilePicture", maxCount: 1 }, { name: "coverPicture", maxCount: 1 }]),
    requireAuth,
    validateImage,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const user = await User.findById(req.currentUser!.id);

        if (!user) {
            throw new BadRequestError("Invalid credentials");
        }

        if (req.body.username) {
            const existingUserName = await User.findOne({ username: req.body.username });

            if (existingUserName) {
                throw new BadRequestError("username already exists");
            }

            user.username = req.body.username;
        }

        if (req.body.email) {
            const existingEmail = await User.findOne({ email: req.body.email });

            if (existingEmail) {
                throw new BadRequestError("Email already exists");
            }

            user.email = req.body.email;
        }

        if (req.body.password) {
            const passwordSpecialCharsValidation = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

            if (req.body.password.length < 8) {
                throw new BadRequestError("Password must be more 8 characters");
            }

            let isTheSamePassword = await Password.compare(
                user.password,
                req.body.password,
            );

            if (isTheSamePassword) {
                throw new BadRequestError("Can not change password with the previous one");
            }
            if (!passwordSpecialCharsValidation.test(req.body.password)) {
                throw new BadRequestError("Password must contain a special character");
            }

            if (req.body.password.toLowerCase().includes("password") || req.body.password.toLowerCase().includes("qwerty") || req.body.password.toLowerCase().includes("asdf")) {
                throw new BadRequestError("For security reasons! The Password can contain neither 'password' nor 'qwerty' nor 'asdf'.");
            }

            user.password = req.body.password;
        }

        if (files.profilePicture) {
            await new Promise((resolve, reject) => {
                Cloudinary.uploader.upload_stream({
                    public_id: `profile-picture/social-${user.username}`,
                    use_filename: true,
                    tags: `${user.username}-tag`,
                    width: 500,
                    height: 500,
                    crop: "scale",
                    placeholder: true,
                    resource_type: 'auto'
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        user.profilePicture = result?.secure_url!;
                        resolve(user.profilePicture);
                    }
                }).end(files.profilePicture[0].buffer);
            });
        }

        if (files.coverPicture) {
            await new Promise((resolve, reject) => {
                Cloudinary.uploader.upload_stream({
                    public_id: `profile-cover-picture/social-${user.username}`,
                    use_filename: true,
                    tags: `${user.username}-tag`,
                    width: 500,
                    height: 500,
                    crop: "scale",
                    placeholder: true,
                    resource_type: 'auto'
                }, async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        user.coverPicture = result?.secure_url!;
                        resolve(user.coverPicture);
                    }
                }).end(files.coverPicture[0].buffer);
            });
        }

        user.updatedAt = new Date().toISOString();
        _.extend(user, req.body);
        await user.save();

        res.status(200).send({ status: 200, user, success: true });
    });

export { router as updateProfileRouter };