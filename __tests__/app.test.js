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
});

describe("GET /api with wrong endpoint", () => {
    test("404: Returns an error message Not Found when an endpoint is not specified", () => {
        return request(app)
            .get("/api/categories/incorrectendpoint")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("GET /api/reviews/:review_id", () => {
    test("200: Responds with an object with the corresponding review_id", () => {
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                (review) => {
                    expect(review).toMatchObject({
                        review_id: 1,
                        title: expect.any(String),
                        review_body: expect.any(String),
                        desginer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: expect.any(String),
                        owner: expect.any(String),
                    });
                };
            });
    });
    test("400: responds with a bad request for an invalid review ID", () => {
        return request(app)
            .get("/api/reviews/not-a-num")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID");
            });
    });
    test("404: GET response for a valid but non existant review ID", () => {
        return request(app)
            .get("/api/reviews/1000")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("GET /api/reviews", () => {
    test("200: Responds with an array of review objects", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toHaveLength(13);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        designer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: expect.any(String),
                        owner: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });
    test("200: Responds with array of objects sorted by date in descending order", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy("created_at", { descending: true });
            });
    });
});

describe("GET /api/reviews/:review_id/comments", () => {
    test("200: Responds with an array of comments", () => {
        return request(app)
            .get("/api/reviews/3/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toHaveLength(3);
                expect(comments[0]).toEqual({
                    comment_id: 6,
                    body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
                    review_id: 3,
                    author: "philippaclaire9",
                    votes: 10,
                    created_at: "2021-03-27T19:49:48.110Z",
                });
            });
    });
    test("200: Responds with array of comments sorted by most recent first", () => {
        return request(app)
            .get("/api/reviews/3/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toBeSortedBy("created_at", { descending: true });
            });
    });
    test("200: Responds with an empty comment array when given an id with no comments", () => {
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toEqual([]);
            });
    });
    test("400: responds with a bad request for an invalid review ID", () => {
        return request(app)
            .get("/api/reviews/not-a-num/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID");
            });
    });
    test("404: GET response for a valid but non existant review ID", () => {
        return request(app)
            .get("/api/reviews/1000/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("POST /api/reviews/:review_id/comments", () => {
    test("201: POST adds a comment to the database for a specific review_id and responds with created comment", () => {
        const newComment = {
            username: "philippaclaire9",
            body: "This game was more fun then the skirmish at Weathertop",
        };

        return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toEqual({
                    comment_id: expect.any(Number),
                    author: "philippaclaire9",
                    body: "This game was more fun then the skirmish at Weathertop",
                    votes: 0,
                    review_id: 1,
                    created_at: expect.any(String),
                });
            });
    });
    test("400: POST responds with error message when missing information", () => {
        const newComment = {
            body: "This games is so rubbish I can not even give you my own username",
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Error: Missing required information");
            });
    });
    test("404: POST responds with error message when given a valid id, which doesnt exist", () => {
        const newComment = {
            username: "philippaclaire9",
            body: "This game was more fun then the skirmish at Weathertop",
        };
        return request(app)
            .post("/api/reviews/1000/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
    test("400: POST responds with error message when given invalid id", () => {
        const newComment = {
            username: "philippaclaire9",
            body: "This game was more fun then the skirmish at Weathertop",
        };
        return request(app)
            .post("/api/reviews/not-a-num/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID");
            });
    });
});
