import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

describe("POST /auth/token", () => {
  it("returns a token for a valid apiKey", async () => {
    const res = await request(app).post("/auth/token").send({ apiKey: process.env.SEED_API_KEY });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });

  it("rejects an invalid apiKey with 401", async () => {
    const res = await request(app).post("/auth/token").send({ apiKey: "wrong-key" });

    expect(res.status).toBe(401);
  });

  it("rejects a request missing apiKey with 400", async () => {
    const res = await request(app).post("/auth/token").send({});

    expect(res.status).toBe(400);
  });
});
