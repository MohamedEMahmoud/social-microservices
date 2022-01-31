import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

router.post('/api/auth/signout', async (req: Request, res: Response) => {

    req.session = null;

    res.status(204).send({});
});

export { router as signoutRouter };