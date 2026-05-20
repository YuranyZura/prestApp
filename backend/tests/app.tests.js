import request from "supertest";
import app from "../src/app.js";

describe("GET /", () => {
  it("debe responder 200", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
  });
});