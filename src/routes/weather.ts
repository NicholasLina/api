import express, { Request, Response } from "express";
import { fetchWeatherApi } from 'openmeteo';
import dotenv from 'dotenv';
import apicache from 'apicache'
import getErrorMessage from "../util/getErrorMessage";

dotenv.config()

let cache = apicache.middleware;

const weatherRouter = express.Router();
const URL = process.env.OPEN_METEO_URL || "test";

weatherRouter.get('/:lat-:lon', cache('15 minutes'), async (req: Request, res: Response) => {
    const params = {
        "latitude": req.params.lat,
        "longitude": req.params.lon,
        "current": ["temperature_2m", "apparent_temperature", "relative_humidity_2m", "weather_code", "cloud_cover", "wind_speed_10m", "wind_direction_10m"],
        "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
        "timeformat": "unixtime",
        "forecast_days": 1
    };
    try {
        const responses = await fetchWeatherApi(URL, params);
        const response = responses[0];
        const current = response.current()!;
        const daily = response.daily()!;


        // Variables index must match index in the params arrays
        const weatherData = {
            temperature:            Math.round(current.variables(0)!.value()),
            apparentTemperature:    Math.round(current.variables(1)!.value()),
            temperatureMax:         Math.round(daily.variables(0)!.valuesArray()!["0"]),
            temperatureMin:         Math.round(daily.variables(1)!.valuesArray()!["0"]),
            relativeHumidity:       current.variables(2)!.value(),
            precipitation:          daily.variables(2)!.valuesArray()!["0"],
            weatherCode:            current.variables(3)!.value(),
            cloudCover:             current.variables(4)!.value(),
            windSpeed:              Math.round(current.variables(5)!.value()),
            windDirection:          current.variables(6)!.value(),
        };

        res.header("Access-Control-Allow-Origin", '*');
        res.status(200).json(weatherData)
    } catch (error: unknown) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
});

weatherRouter.get('/', async (req: Request ,res: Response) => {
    if(req) // Keeping TS happy
    try{
        res.status(200).json({ message: "No latitude or longitude specified" })

    } catch (error: unknown) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
});

export default weatherRouter;