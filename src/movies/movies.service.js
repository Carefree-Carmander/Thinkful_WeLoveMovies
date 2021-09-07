const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCriticDetails = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list(isShowing) {
  if (isShowing) {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .distinct("mt.movie_id")
      .select("m.*")
      .where({ is_showing: true });
  } else {
    return knex("movies").select("*");
  }
}

function read(movieId) {
  return (
    knex("movies")
      .select("*")
      .where({ movie_id: movieId })
      .first()
  );
}

function listTheatersForMovie(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: movieId, is_showing: true });
}

function listReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "r.movie_id": movieId })
    .then((reviews) => {
      const reviewsWithCriticDetails = [];
      reviews.forEach((review) => {
        const addedCritic = addCriticDetails(review);
        reviewsWithCriticDetails.push(addedCritic);
      });
      return reviewsWithCriticDetails;
    });
}

module.exports = {
  list,
  read,
  listTheatersForMovie,
  listReviews,
};
