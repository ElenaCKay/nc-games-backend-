const db = require("../db/connection");
const { fetchCategories } = require("./categories.model");

exports.selectReview = (reviewId) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
        return result.rows[0];
    });
};

exports.fetchReviews = () => {
    return db
        .query(
            `SELECT reviews.title, reviews.review_id, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, 
            reviews.owner, reviews.created_at, 
            CAST(COUNT(comments.review_id) AS INT) as comment_count
            FROM reviews
            LEFT JOIN comments
            ON reviews.review_id = comments.review_id
            GROUP BY title, reviews.review_id, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, 
            reviews.owner, reviews.created_at       
            ORDER BY reviews.created_at DESC;`
        )
        .then((result) => {
            return result.rows;
        });
};
