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
    test("200: accepts a category query", () => {
        return request(app)
            .get("/api/reviews?category=dexterity")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toHaveLength(1);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        designer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: "dexterity",
                        owner: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });
    test("200: Responds with array of objects sorted by a sort by query", () => {
        return request(app)
            .get("/api/reviews?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy("votes", { descending: true });
            });
    });
    test("200: Responds with array of objects ordered by ascending", () => {
        return request(app)
            .get("/api/reviews?order=ASC")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy("created_at", { descending: false });
            });
    });
    test("200: accepts a category, sort_by and order query", () => {
        return request(app)
            .get("/api/reviews?category=social deduction&sort_by=votes&order=ASC")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy("votes", { descending: false });
                expect(reviews).toHaveLength(11);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        designer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: "social deduction",
                        owner: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });
    test("200: accepts a valid category which has no reviews", () => {
        return request(app)
            .get("/api/reviews?category=children's games")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toHaveLength(0);
                expect(reviews).toEqual([]);
            });
    });
    test("400: GET responds with error for an invaild sort_by", () => {
        return request(app)
            .get("/api/reviews?sort_by=banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Sort Query");
            });
    });
    test("404: GET responds with error for an invaild category", () => {
        return request(app)
            .get("/api/reviews?category=banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Category");
            });
    });
    test("400: GET responds with error for an invaild order", () => {
        return request(app)
            .get("/api/reviews?order=banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Order");
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
                expect(comments[0]).toMatchObject({
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
                expect(comment).toMatchObject({
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
            .post("/api/reviews/50/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid information");
            });
    });
    test("404: POST responds with error message when an invalid username", () => {
        const newComment = {
            username: "Aragorn",
            body: "This game was more fun then the skirmish at Weathertop",
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid information");
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

describe("PATCH /api/reviews/:review_id", () => {
    test("200: PATCH responds with updated review (adding votes)", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                (review) => {
                    expect(review).toMatchObject({
                        review_id: 1,
                        title: "Agricola",
                        designer: "Uwe Rosenberg",
                        owner: "mallionaire",
                        review_img_url: "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                        review_body: "Farmyard fun!",
                        category: "euro game",
                        created_at: expect.any(String),
                        votes: 2,
                    });
                };
            });
    });
    test("200: PATCH responds with updated review (removing votes)", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                (review) => {
                    expect(review).toMatchObject({
                        review_id: 1,
                        title: "Agricola",
                        designer: "Uwe Rosenberg",
                        owner: "mallionaire",
                        review_img_url: "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                        review_body: "Farmyard fun!",
                        category: "euro game",
                        created_at: expect.any(String),
                        votes: -99,
                    });
                };
            });
    });
    test("404: PATCH responds with error message when given a valid id, which doesnt exist", () => {
        return request(app)
            .patch("/api/reviews/50")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
    test("400: PATCH responds with error message when given an invaild object", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: "hi" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Error: incorrect object");
            });
    });
    test("400: PATCH responds with error message when given an invaild object", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Error: incorrect object");
            });
    });
    test("400: PATCH responds with error message when given invalid id", () => {
        return request(app)
            .patch("/api/reviews/not-a-num")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID");
            });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
    test("204: DELETE responds with no content", () => {
        return request(app).delete("/api/comments/1").expect(204);
    });
    test("400: DELETE Responds with error when give an incorrect comment_id", () => {
        return request(app)
            .delete("/api/comments/not-a-num")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid ID");
            });
    });
    test("404: DELETE responds with error message when given a valid id, which doesnt exist", () => {
        return request(app)
            .delete("/api/comments/100")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("ID not found");
            });
    });
});

describe("GET /api/users", () => {
    test("200: Responds with an array of user objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users).toBeInstanceOf(Array);
                expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    });
                });
            });
    });
});
