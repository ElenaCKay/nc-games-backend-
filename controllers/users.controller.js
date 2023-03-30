const { fetchUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
    fetchUsers()
        .then((userArray) => {
            res.status(200).send({ users: userArray });
        })
        .catch((err) => {
            next(err);
        });
};
