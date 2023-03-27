const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const { seed } = require("../db/seeds/seed");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    if (db.end) db.end();
});

describe("GET /api/categories", () => {
    test("200: accepts GET request and displays an array of category objects with a slug and description property", () => {});
});
