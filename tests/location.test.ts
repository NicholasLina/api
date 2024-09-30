import request, { Response } from 'supertest'
import app from "../src/server"

const locationDataParams = [
    'lat',
    'lon',
    'locationString'
]

describe('Get location from string', () => {
    it('should retrieve an object containing valid location data', async () => {
        const res: Response = await request(app)
            .get('/location/cabo')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')

        for (let param of locationDataParams) {
            expect(res.body).toHaveProperty(param)
        }

        // Ensure latitude and longitude are within acceptable range
        const ACCEPTABLE_MINIMUM_DEGREES = -90;
        const ACCEPTABLE_MAXIMUM_DEGREES = 90;

        expect(res.body.lat).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_DEGREES)
        expect(res.body.lat).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_DEGREES)
        expect(res.body.lon).toBeLessThanOrEqual(ACCEPTABLE_MAXIMUM_DEGREES)
        expect(res.body.lon).toBeGreaterThanOrEqual(ACCEPTABLE_MINIMUM_DEGREES)

        // Ensure location string to be a string with length greater than 1
        expect(res.body.locationString.length).toBeGreaterThan(1)
    })
})

describe('Get location with missing params', () => {
    it('should return an error message', async () => {
        const res: Response = await request(app)
            .get('/location/')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual("No location specified")
    })
})
