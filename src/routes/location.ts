import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import apicache from 'apicache'
import getErrorMessage from "../util/getErrorMessage";

dotenv.config()

let cache = apicache.middleware;

const locationRouter = express.Router();
const URL = process.env.GEOAPIFY_URL || "test";
const KEY = process.env.GEOAPIFY_API_KEY || "test";

locationRouter.get('/:location', cache('15 minutes'), async (req: Request, res: Response) => {
    try {
        const response = await fetch(`${URL}${req.params.location}&apiKey=${KEY}`);
        const locationData = await response.json()
        const formattedLocation = {
            lon: locationData.features[0].properties.lon,
            lat: locationData.features[0].properties.lat,
            locationString: locationData.features[0].properties.formatted
        }

        res.header("Access-Control-Allow-Origin", '*');
        res.status(200).json(formattedLocation)
    } catch (error: unknown) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
});

locationRouter.get('/', async (req: Request ,res: Response) => {
    if(req) // Keeping TS happy
    try{
        res.status(200).json({ message: "No location specified" })

    } catch (error: unknown) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
});

export default locationRouter;