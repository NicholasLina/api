import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import getErrorMessage from "../util/getErrorMessage";

dotenv.config()

const fallbackRouter = express.Router();

fallbackRouter.get('/', async (req: Request ,res: Response) => {
    if(req) // Keeping TS happy
    try{
        res.header("Access-Control-Allow-Origin", '*');
        res.status(200).json({ message: "This endpoint has yet to be implemented! Are you from the future??" })

    } catch (error: unknown) {
        res.header("Access-Control-Allow-Origin", '*');
        res.status(500).json({ message: getErrorMessage(error) })
    }
});

export default fallbackRouter;