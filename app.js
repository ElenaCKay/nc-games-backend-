const express = require("express");
const app = express();
const { getCategories, errNotFound, serverRunning } = require("./controllers/categories.controller");
const { getReviewById, getReviews, getCommentsById, postComment } = require("./controllers/reviews.controller");
const { handlePSQL400s, handleCustomErrors, handle500Statuses, handleUsernameErrors } = require("./error_handling");

app.use(express.json());

app.get("/api", serverRunning);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsById);

app.post("/api/reviews/:review_id/comments", postComment);

app.all("/*", errNotFound);

app.use(handlePSQL400s);
app.use(handleUsernameErrors);
app.use(handleCustomErrors);
app.use(handle500Statuses);
module.exports = app;
