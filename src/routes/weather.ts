import express, { Request, Response } from "express";
import { fetchWeatherApi } from 'openmeteo';
import dotenv from 'dotenv';
dotenv.config();

const weatherRouter = express.Router();
const URL = process.env.OPEN_METEO_URL || "test";

weatherRouter.use('/', async (req: Request, res: Response) => {
    const params = {
        "latitude": 52.52,
        "longitude": 13.41,
        "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "weather_code", "cloud_cover", "wind_speed_10m", "wind_direction_10m"],
        "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "precipitation_sum"],
        "timeformat": "unixtime",
        "forecast_days": 1
    };
    try {
        const responses = await fetchWeatherApi(URL, params);
        const response = responses[0];
        const current = response.current()!;
        const daily = response.daily()!;

        if (req) { }

        const weatherData = {
            temperature: Math.round(current.variables(0)!.value()),
            relativeHumidity: current.variables(1)!.value(),
            apparentTemperature: Math.round(current.variables(2)!.value()),
            temperatureMax: Math.round(daily.variables(0)!.valuesArray()!["0"]),
            temperatureMin: Math.round(daily.variables(1)!.valuesArray()!["0"]),
            sunrise: daily.variables(2)!.valuesInt64(2)!.valueOf(),
            sunset: daily.variables(3)!.value(),
            isDay: current.variables(3)!.value(),
            precipitation: daily.variables(4)!.valuesArray()!["0"],
            weatherCode: current.variables(5)!.value(),
            cloudCover: current.variables(6)!.value(),
            windSpeed: Math.round(current.variables(7)!.value()),
            windDirection: current.variables(8)!.value(),
        };

        res.status(200).json(weatherData)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err })
    }
});

export default weatherRouter;

//dummyjson.com/test