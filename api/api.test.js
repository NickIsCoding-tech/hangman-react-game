import request from "supertest";
import { app } from "./api.js";

describe("API validation routes", () => {
  test("GET /api/player returns 400 when playerName is missing", async () => {
    const response = await request(app).get("/api/player");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/playerName/i);
  });

  test("POST /api/players returns 400 when playerName is missing", async () => {
    const response = await request(app)
      .post("/api/players")
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/playerName/i);
  });

  test("PUT /api/player returns 400 when required fields are missing", async () => {
    const response = await request(app)
      .put("/api/player")
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/required/i);
  });
});