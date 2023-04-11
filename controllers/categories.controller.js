const { fetchCategories } = require("../models/categories.model");
const fs = require("fs");

exports.getCategories = (req, res, next) => {
    fetchCategories()
        .then((categoryArray) => {
            res.status(200).send({ categories: categoryArray });
        })
        .catch((err) => {
            next(err);
        });
};

exports.errNotFound = (req, res) => {
    res.status(404).send({ msg: "Not found" });
};

exports.serverRunning = (req, res) => {
    const fileContents = fs.readFileSync(`${__dirname}/../endpoints.json`, "utf-8");

    res.status(200).json({ fileContents });
};
