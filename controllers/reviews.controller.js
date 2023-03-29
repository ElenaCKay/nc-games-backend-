const { selectReview, fetchReviews, selectCommentsById } = require("../models/reviews.model");

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

exports.getReviews = (req, res, next) => {
    fetchReviews()
        .then((reviews) => {
            res.status(200).send({ reviews });
        })
        .catch((err) => {
            next(err);
        });
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
