const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    if (db.end) db.end();
});

describe("GET /api/categories", () => {
    test("200: Responds with an array of category objects with a slug and description property", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body }) => {
                const { categories } = body;
                expect(categories).toBeInstanceOf(Array);
                expect(categories).toHaveLength(4);
                categories.forEach((category) => {
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                    });
                });
            });
    });
    test("404: Returns an error message Not Found when an endpoint is not specified", () => {
        return request(app)
            .get("/api/categories/incorrectendpoint")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Not found");
            });
    });
});

describe("GET /api/reviews/:review_id", () => {
    test("200: Responds with an object with the corresponding review_id", () => {
        return request(app)
            .get("/api/reviews?review_id=1")
            .expect(200)
            .then(({ body }) => {
                console.log(body);
                const { review } = body;
                review.forEach((review) => {
                    expect.objectContaining({
                        review_id: 1,
                        title: expect.any(String),
                        review_body: expect.any(String),
                        desginer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: expect.any(String),
                        owner: expect.any(String),
                    });
                });
            });
    });
    test("400: responds with a bad request for an invalid category ID", () => {
        return request(app)
            .get("/api/reviews?review_id=not-a-num")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID");
            });
    });
});
