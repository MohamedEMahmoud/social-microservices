import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../models/post.model";
const router = express.Router();

router.get("/api/post/search-all",
    requireAuth,
    async (req: Request, res: Response) => {

        const { search } = req.query;
        if (!search) {
            throw new BadRequestError("Search Query is Required");
        }

        const posts = await Post.find({});

        const postSearch = posts.filter(product => product.content.toLowerCase().includes(search.toString().toLowerCase()));

        if (posts.length === 0 || postSearch.length === 0) {
            throw new BadRequestError("Posts Not Found");
        }

        res.status(200).send({ status: 200, posts: postSearch, success: true });

    });

export { router as searchAllPostRouter };