exports.handlePSQL400s = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid ID" });
    } else {
        next(err);
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    const { status, msg } = err;
    if (status && msg) {
        res.status(status).send({ msg });
    } else {
        next(err);
    }
};

exports.handle500Statuses = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Server error has occured" });
};
