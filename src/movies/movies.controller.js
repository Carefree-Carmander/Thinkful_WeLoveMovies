const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await moviesService.read(movieId);
  // console.log("movie: ", req.params);
  if (movie) {
    res.locals.movieId = movieId;
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res) {
  const isShowing = req.query.is_showing === "true";
  const movies = await moviesService.list(isShowing);
  res.json({ data: movies });
}

function read(req, res) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function listTheatersForMovie(req, res) {
  const { movieId } = res.locals;
  const theaters = await moviesService.listTheatersForMovie(movieId);
  res.json({ data: theaters });  
}

async function listReviews(req, res) {
  const { movieId } = res.locals;
  const reviews = await moviesService.listReviews(movieId);
  res.json({ data: reviews });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheatersForMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheatersForMovie),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
  // movieExists: asyncErrorBoundary(movieExists),
};
