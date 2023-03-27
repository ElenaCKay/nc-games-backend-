const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");

app.get("/api", (req, res) => {
    res.status(200).send({ msg: "Server is up and running" });
});

app.get("/api/categories", getCategories);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});
module.exports = app;
