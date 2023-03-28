const { selectReview, fetchReviews } = require("../models/reviews.model");

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
    fetchReviews().then((reviews) => {
        console.log(reviews)
        res.status(200).send({ reviews });
    })
    .catch((err) => {
        next(err)
    })
};
