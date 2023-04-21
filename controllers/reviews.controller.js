const {
    selectReview,
    fetchReviews,
    selectCommentsById,
    insertComment,
    updateReviewVotes,
    removeCommentById,
} = require("../models/reviews.model");

const { fetchCategories } = require("../models/categories.model");

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;

    selectReview(review_id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getReviews = async (req, res, next) => {
    let { category, sort_by, order } = req.query;

    if (category) {
        try {
            const categories = await fetchCategories();
            const slugs = categories.map((category) => category.slug);
            //added this
            if (category === "all") {
                category = undefined;
            } else if (!slugs.includes(category)) {
                res.status(404).send({ msg: "Invalid Category" });
                return;
            }
        } catch (error) {
            next(error);
        }
    }

    try {
        const reviews = await fetchReviews(category, sort_by, order);

        res.status(200).send({ reviews });
    } catch (error) {
        next(error);
    }
};

exports.getCommentsById = (req, res, next) => {
    const { review_id } = req.params;

    const commentPromises = [selectCommentsById(review_id)];
    if (review_id) {
        commentPromises.push(selectReview(review_id));
    }

    Promise.all(commentPromises)
        .then(([comments]) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const newComment = req.body;
    if (!newComment.username || !newComment.body) {
        res.status(400).send({ msg: "Error: Missing required information" });
        return;
    }
    const commentPromises = [insertComment(newComment, review_id), selectReview(review_id)];

    Promise.all(commentPromises)
        .then(([comment]) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};

exports.patchReviewVotes = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== "number" || inc_votes === undefined) {
        res.status(400).send({ msg: "Error: incorrect object" });
    } else {
        const votesPromises = [updateReviewVotes(inc_votes, review_id), selectReview(review_id)];

        Promise.all(votesPromises)
            .then(([review]) => {
                res.status(200).send({ review });
            })
            .catch((err) => {
                next(err);
            });
    }
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    if (typeof parseInt(comment_id) === "number") {
        removeCommentById(comment_id)
            .then((deletedComment) => {
                if (deletedComment > 0) {
                    res.sendStatus(204);
                } else {
                    res.status(404).send({ msg: "ID not found" });
                }
            })
            .catch((err) => {
                next(err);
            });
    }
};
