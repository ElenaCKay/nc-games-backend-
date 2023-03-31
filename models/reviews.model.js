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

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
    if (sort_by && sort_by !== "created_at" && sort_by !== "votes") {
        return Promise.reject({ status: 404, msg: "Invalid Sort Query" });
    }
    if (category && category !== "euro game" && category !== "dexterity" && category !== "social deduction") {
        return Promise.reject({ status: 404, msg: "Invalid Category" });
    }
    if (order && order !== "ASC" && order !== "DESC") {
        return Promise.reject({ status: 404, msg: "Invalid Order" });
    }

    whereCategory = category ? `WHERE category = '${category}'` : "";

    const queryString = `
    SELECT *, (SELECT CAST(COUNT(*) AS INT) FROM comments WHERE comments.review_id = reviews.review_id) AS comment_count
    FROM reviews 
    ${whereCategory}     
    ORDER BY ${sort_by} ${order};`;

    return db.query(queryString).then((result) => {
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
    const commentArray = [username, body, votes, review_id];
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
        });
};

exports.updateReviewVotes = (inc_votes, review_id) => {
    return db
        .query(
            `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;
        `,
            [inc_votes, review_id]
        )
        .then((result) => {
            return result.rows;
        });
};

exports.removeCommentById = (comment_id) => {
    return db
        .query(
            `
    DELETE FROM comments 
    WHERE comment_id = $1
    RETURNING *;
    `,
            [comment_id]
        )
        .then((deletedRows) => {
            return deletedRows.rowCount;
        });
};

// `SELECT *, (SELECT COUNT * FROM comments WHERE comments.review_id = reviews.review_id) AS comment_count
//  FROM reviews
//  ${ORDER_BY_CLAUSE}
//  ${WHERE_CLAUSE};`
