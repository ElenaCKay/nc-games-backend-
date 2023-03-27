const { fetchCategories } = require("../models/categories.model");

exports.getCategories = (req, res) => {
    fetchCategories().then((categoryArray) => {
        res.status(200).send({ categories: categoryArray });
    });
};
