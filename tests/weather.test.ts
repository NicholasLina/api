import request, { Response } from 'supertest'
import app from "../src/server"

const weatherDataParams = [
  'temperature',
  'apparentTemperature',
  'temperatureMax',
  'temperatureMin',
  'relativeHumidity',
  'precipitation',
  'weatherCode',
  'cloudCover',
  'windSpeed',
  'windDirection'
]

describe('Get weather from latitude and longitude', () => {
  it('should retrieve an object containing valid weather data', async () => {
    const res: Response = await request(app)
      .get('/weather/43.653225--79.383186')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')

    for (let param of weatherDataParams) {
      expect(res.body).toHaveProperty(param)
    }

    // Ensure all temperatures are within acceptable range
    const ACCEPTABLE_MINIMUM_TEMPERATURE = -100;
    const ACCEPTABLE_MAXIMUM_TEMPERATURE = 60;

    expect(res.body.temperature).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_TEMPERATURE)
    expect(res.body.temperature).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_TEMPERATURE)
    expect(res.body.apparentTemperature).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_TEMPERATURE)
    expect(res.body.apparentTemperature).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_TEMPERATURE)
    expect(res.body.temperatureMin).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_TEMPERATURE)
    expect(res.body.temperatureMin).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_TEMPERATURE)
    expect(res.body.temperatureMax).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_TEMPERATURE)
    expect(res.body.temperatureMax).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_TEMPERATURE)

    // Ensure all percentage values are within acceptable range
    const ACCEPTABLE_MINIMUM_PERCENTAGE = 0;
    const ACCEPTABLE_MAXIMUM_PERCENTAGE = 100;

    expect(res.body.relativeHumidity).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_PERCENTAGE)
    expect(res.body.relativeHumidity).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_PERCENTAGE)
    expect(res.body.precipitation).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_PERCENTAGE)
    expect(res.body.precipitation).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_PERCENTAGE)
    expect(res.body.cloudCover).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_PERCENTAGE)
    expect(res.body.cloudCover).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_PERCENTAGE)

    // Ensure all percentage values are within acceptable range
    const ACCEPTABLE_MINIMUM_WIND_SPEED = 0;
    const ACCEPTABLE_MAXIMUM_WIND_SPEED = 410;

    expect(res.body.windSpeed).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_WIND_SPEED)
    expect(res.body.windSpeed).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_WIND_SPEED)

    // Ensure all direction degree values are within acceptable range
    const ACCEPTABLE_MINIMUM_DEGREE = 0;
    const ACCEPTABLE_MAXIMUM_DEGREE = 360;

    expect(res.body.windDirection).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_DEGREE)
    expect(res.body.windDirection).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_DEGREE)
  })
})

describe('Get weather with missing params', () => {
  it('should return an error message', async () => {
    const res: Response = await request(app)
      .get('/weather/')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual("No latitude or longitude specified")
  })
})
