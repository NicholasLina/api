import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import apicache from 'apicache'
import getErrorMessage from "../util/getErrorMessage";

dotenv.config()

let cache = apicache.middleware;

const ipLocationRouter = express.Router();
const URL = process.env.IPGEOLOCATION_URL || "test";
const KEY = process.env.IPGEOLOCATION_API_KEY || "test";

ipLocationRouter.get('/:ip', cache('15 minutes'), async (req: Request, res: Response) => {
    if (!validateIPaddress(req.params.ip)) {
        res.header("Access-Control-Allow-Origin", '*');
        res.status(200).json({ message: `Invalid IP Address: ${req.params.ip}` })
        return
    }

    try {
        const response = await fetch(`${URL}?apiKey=${KEY}&ip=${req.params.ip}`);
        const locationData = await response.json()

        const formattedLocation = {
            lat: locationData.latitude,
            lon: locationData.longitude,
            city: locationData.city,
            country: locationData.country_name
        }

        res.header("Access-Control-Allow-Origin", '*');
        res.status(200).json(formattedLocation)
    } catch (error: unknown) {
        res.header("Access-Control-Allow-Origin", '*');
        res.status(500).json({ message: getErrorMessage(error) })
    }
});

ipLocationRouter.get('/', async (req: Request, res: Response) => {
    if (req) // Keeping TS happy
        try {
            res.header("Access-Control-Allow-Origin", '*');
            res.status(200).json({ message: "No location specified" })

        } catch (error: unknown) {
            res.header("Access-Control-Allow-Origin", '*');
            res.status(500).json({ message: getErrorMessage(error) })
        }
});

function validateIPaddress(ip: string): boolean {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
        return (true)
    }
    return (false)
}

export default ipLocationRouter;