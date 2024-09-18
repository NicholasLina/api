import request, { Response } from "supertest";
import app from "../src/server";

describe("Test fallback endpoint", (): void => {
  it("returns default error message", async (): Promise<void> => {
    const res: Response = await request(app).get('/')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')

    // Property Checks
    expect(res.body).toHaveProperty('message')
  
    // Value Checks
    expect(res.body).toEqual({ message: "This endpoint has yet to be implemented! Are you from the future??" })
  });
});
