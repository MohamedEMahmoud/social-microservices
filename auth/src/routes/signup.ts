import express, { Request, Response } from "express";
import { validateRequest, BadRequestError, validateImage, upload } from "@mesocial/common";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { v2 as Cloudinary } from "cloudinary";
import address from "address";

const router = express.Router();

router.post("/api/auth/signup",
    upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "coverPicture", maxCount: 1 }
    ]),
    validateImage,
    validateRequest,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const email = await User.findOne({ email: req.body.email });
        if (email) {
            throw new BadRequestError("Email is already exist");
        }

        const username = await User.findOne({ username: req.body.username });
        if (username) {
            throw new BadRequestError("username is already exist");
        }

        const user = User.build({ ...req.body });

        const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
        req.session = {
            jwt: userJwt
        };
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
                }, async (err, result) => {
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

        await address.mac((err, addr) => {
            if (err) {
                throw new BadRequestError("Can not reach to MAC Address");
            }
            else {
                return user.macAddress.push({ MAC: addr });
            }
        });

        await user.save();

        res.status(201).send({ status: 201, user, success: true });
    });

export { router as signupRouter };