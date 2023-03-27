const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const { getReviewById } = require("./controllers/reviews.controller")

app.use(express.json());

app.get("/api", (req, res) => {
    res.status(200).send({ msg: "Server is up and running" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

module.exports = app;
