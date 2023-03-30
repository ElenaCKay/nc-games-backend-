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
            `SELECT reviews.title, reviews.review_id, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, 
            reviews.owner, reviews.created_at, 
            CAST(COUNT(comments.review_id) AS INT) as comment_count
            FROM reviews
            LEFT JOIN comments
            ON reviews.review_id = comments.review_id
            GROUP BY title, reviews.review_id, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, 
            reviews.owner, reviews.created_at       
            ORDER BY reviews.created_at DESC;`
        )
        .then((result) => {
            return result.rows;
        });
};

exports.selectCommentsById = (review_id) => {
    return db
        .query(
            `SELECT * FROM comments 
        WHERE review_id = $1
        ORDER BY created_at DESC;`,
            [review_id]
        )
        .then((result) => {
            return result.rows;
        });
};

exports.insertComment = (newComment, review_id) => {
    const { username, body } = newComment;
    const votes = 0;
    const commentArray = [username, body, votes, review_id]
    return db
        .query(
            `
        INSERT INTO comments (author, body, votes, review_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
            commentArray
        )
        .then((result) => {
            return result.rows[0];
        })
};

exports.updateReviewVotes = (inc_votes, review_id) => {
    return db.query(
        `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;
        `,
        [inc_votes, review_id]
    )
    .then((result) => {
        console.log(result.rows)
        return result.rows
    })
}
