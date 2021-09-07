const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function validateReviewId(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await reviewsService.read(reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  return next({ status: 404, message: "Review cannot be found." });
}

async function destroy(req, res) {
  const { review_id } = res.locals.review;
  const data = await reviewsService.delete(review_id);
  res.sendStatus(204);
}

async function update(req, res) {
  const reviewId = res.locals.review.review_id;
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: reviewId,
  };
  await reviewsService.update(updatedReview);
  updatedReview.critic = await reviewsService.criticList(
    updatedReview.critic_id
  );

  res.json({ data: updatedReview });
}

module.exports = {
  delete: [asyncErrorBoundary(validateReviewId), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(validateReviewId), asyncErrorBoundary(update)],
};
