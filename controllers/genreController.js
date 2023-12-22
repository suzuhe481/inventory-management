const Genre = require("../models/genre");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

// Displays a list of all Genres.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find({}).sort().exec();

  res.render("genre/genre_list", {
    title: "Genre List",
    genre_list: allGenres,
  });
});

// Displays the detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, gamesInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genres: req.params.id }).exec(),
  ]);

  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre/detail", {
    title: `Genre: ${genre.name}`,
    genre: genre,
    genre_games: gamesInGenre,
  });
});

// Displays Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Genre create GET");
});

// Handles Genre create on POST.
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Genre create POST");
});

// Displays Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Genre delete GET");
});

// Handles Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Genre delete POST");
});

// Displays Genre update on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Genre update GET");
});

// Handles Genre update on POSt.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Genre update POST");
});
