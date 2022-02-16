import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, ModelType } from "@mesocial/common";
import { Post } from "../model/post.model";
import { Product } from "../model/product.model";
import mongoose from "mongoose";

const router = express.Router();

router.get("/api/comment-all",
    requireAuth,
    async (req: Request, res: Response) => {
        let data;
        if (!req.query.type) {
            throw new BadRequestError("Model Type is required");
        }
        const { isValid } = mongoose.Types.ObjectId;

        if (!req.query.id || !isValid(String(req.query.id))) {
            throw new BadRequestError("Id is Invalid");
        }

        if (req.query.type === ModelType.Post) {

            data = await Post.findById(req.query.id).populate("comment");

            return res.status(200).send({ status: 200, post: data, success: true });

        } else if (req.query.type === ModelType.Product) {

            data = await Product.findById(req.query.id).populate("comment");

            return res.status(200).send({ status: 200, product: data, success: true });

        } else {
            throw new BadRequestError(`${req.query.type} Not Found`);
        }


    });

export { router as showAllCommentRouter };