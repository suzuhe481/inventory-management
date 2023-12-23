const Genre = require("../models/genre");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Displays a list of all Genres.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find({}).sort({ name: 1 }).exec();

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
exports.genre_create_get = (req, res, next) => {
  res.render("genre/form", { title: "Create Genre" });
};

// Handles Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre must contain at least 1 character.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a genre object with the escaped/trimmed data.
    const genre = new Genre({ name: req.body.name });

    // There are errors.
    // Render form again with sanitized values and error messages.
    if (!errors.isEmpty()) {
      res.render("genre/form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    }
    // Data is valid.
    else {
      // Check if genre already exists.
      // Case insensitive search and ignores accents.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      // Redirect to existing genre's detail page.
      if (genreExists) {
        res.redirect(genreExists.url);
      }
      // Save new genre.
      // Redirect to it's detail page.
      else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

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
