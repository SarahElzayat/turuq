import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../../src/app";

const app = createApp();

function authToken(): string {
  return jwt.sign({ sub: "assessment-client" }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
}

describe("Users API", () => {
  describe("without a token", () => {
    it("rejects every user route with 401", async () => {
      await request(app).get("/users").expect(401);
      await request(app).post("/users").send({ name: "x", email: "x@example.com" }).expect(401);
      await request(app).get(`/users/${"a".repeat(24)}`).expect(401);
      await request(app).put(`/users/${"a".repeat(24)}`).send({ name: "y" }).expect(401);
      await request(app).delete(`/users/${"a".repeat(24)}`).expect(401);
    });
  });

  describe("with a valid token", () => {
    const token = authToken();
    const auth = () => ({ Authorization: `Bearer ${token}` });

    it("supports the full CRUD lifecycle", async () => {
      const createRes = await request(app)
        .post("/users")
        .set(auth())
        .send({ name: "Jane Doe", email: "jane@example.com", age: 30 });

      expect(createRes.status).toBe(201);
      expect(createRes.body).toMatchObject({ name: "Jane Doe", email: "jane@example.com", age: 30 });
      const id = createRes.body.id;

      const getRes = await request(app).get(`/users/${id}`).set(auth());
      expect(getRes.status).toBe(200);
      expect(getRes.body.email).toBe("jane@example.com");

      const updateRes = await request(app).put(`/users/${id}`).set(auth()).send({ age: 31 });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.age).toBe(31);

      const deleteRes = await request(app).delete(`/users/${id}`).set(auth());
      expect(deleteRes.status).toBe(204);

      const getAfterDeleteRes = await request(app).get(`/users/${id}`).set(auth());
      expect(getAfterDeleteRes.status).toBe(404);
    });

    it("rejects a duplicate email with 409", async () => {
      await request(app).post("/users").set(auth()).send({ name: "A", email: "dup@example.com" });
      const res = await request(app).post("/users").set(auth()).send({ name: "B", email: "dup@example.com" });

      expect(res.status).toBe(409);
    });

    it("rejects creation with a missing required field", async () => {
      const res = await request(app).post("/users").set(auth()).send({ email: "no-name@example.com" });
      expect(res.status).toBe(400);
    });

    it("returns 400 for a malformed id", async () => {
      const res = await request(app).get("/users/not-a-valid-id").set(auth());
      expect(res.status).toBe(400);
    });

    it("returns 404 for a well-formed but nonexistent id", async () => {
      const res = await request(app).get(`/users/${"b".repeat(24)}`).set(auth());
      expect(res.status).toBe(404);
    });

    it("paginates and filters by age", async () => {
      await Promise.all(
        [20, 20, 25, 30].map((age, i) =>
          request(app)
            .post("/users")
            .set(auth())
            .send({ name: `User ${i}`, email: `user${i}@example.com`, age })
        )
      );

      const page1 = await request(app).get("/users").set(auth()).query({ page: 1, limit: 2 });
      expect(page1.status).toBe(200);
      expect(page1.body.data).toHaveLength(2);
      expect(page1.body.pagination).toMatchObject({ page: 1, limit: 2 });

      const filtered = await request(app).get("/users").set(auth()).query({ age: 20 });
      expect(filtered.status).toBe(200);
      expect(filtered.body.data.every((u: { age: number }) => u.age === 20)).toBe(true);
    });
  });
});
