const { selectReview } = require("../models/reviews.model");

exports.getReviewById = (req, res) => {
    console.log("IM IN THE CONTROLLER");
    const { review_id } = req.params;
    selectReview(review_id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            res.status(400).send({ msg: "Invalid ID" });
        });
};
