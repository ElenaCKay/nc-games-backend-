const db = require("../db/connection");
exports.selectReview = (reviewId) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
        return result.rows[0];
    });
};
