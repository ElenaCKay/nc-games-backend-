const db = require("../db/connection");
exports.selectReview = (reviewId) => {
    let selectReviewQueryString = `SELECT * FROM reviews`;
    const queryParameters = [];

    if (reviewId) {
        selectReviewQueryString += ` WHERE review_id = $1;`;
        queryParameters.push(reviewId);
    }
    return db.query(selectReviewQueryString, queryParameters).then((result) => {
        return result.rows;
    });
};
