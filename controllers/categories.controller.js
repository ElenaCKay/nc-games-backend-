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
