const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const { getReviewById } = require("./controllers/reviews.controller");
const { handlePSQL400s, handleCustomErrors, handle500Statuses } = require("./error_handling");

app.use(express.json());

app.get("/api", (req, res) => {
    res.status(200).send({ msg: "Server is up and running" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});

app.use(handlePSQL400s)
app.use(handleCustomErrors)
app.use(handle500Statuses)
module.exports = app;
 