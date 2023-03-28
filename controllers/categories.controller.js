const { fetchCategories } = require("../models/categories.model");

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
    res.status(200).send({ msg: "Server is up and running" });
}