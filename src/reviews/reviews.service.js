const knex = require("../db/connection");

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

async function criticList(criticId) {
  const data = await knex("critics")
    .select("*")
    .where({ "critics.critic_id": criticId });
  return data[0];
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  update,
  criticList,
  delete: destroy,
};
