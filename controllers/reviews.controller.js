const { selectReview } = require("../models/reviews.model");

exports.getReviewById = (req, res) => {
    
    const { review_id } = req.query;
    
    selectReview(review_id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            res.status(400).send({ msg: "Invalid ID" });
        });
};
