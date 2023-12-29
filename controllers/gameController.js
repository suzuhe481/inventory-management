const Game = require("../models/game");
const GameInstance = require("../models/gameinstance");
const Genre = require("../models/genre");
const Developer = require("../models/developer");
const Console = require("../models/console");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Displays the Inventory home page
exports.index = asyncHandler(async (req, res, next) => {
  // Get the count of all games, game instances, consoles, developers, and genres in parallel.
  const [numGames, numGameInstances, numConsoles, numDevelopers, numGenres] =
    await Promise.all([
      Game.countDocuments({}).exec(),
      GameInstance.countDocuments({}).exec(),
      Console.countDocuments({}).exec(),
      Developer.countDocuments({}).exec(),
      Genre.countDocuments({}).exec(),
    ]);

  res.render("index", {
    title: "Video Game Inventory Home",
    game_count: numGames,
    game_instance_count: numGameInstances,
    console_count: numConsoles,
    developer_count: numDevelopers,
    genre_count: numGenres,
  });
});

// Displays a list of all Games.
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({}, "title developer consoles_available")
    .sort({ title: 1 })
    .populate("developer consoles_available")
    .exec();

  res.render("game/list", { title: "Game List", game_list: allGames });
});

// Displays the detail page for a specific Game.
exports.game_detail = asyncHandler(async (req, res, next) => {
  // Get details for a specific game and all their game instances.
  const [game, gameInstances] = await Promise.all([
    Game.findById(req.params.id)
      .populate("developer consoles_available genres description")
      .exec(),
    GameInstance.find({ game: req.params.id }).populate("game console").exec(),
  ]);

  // No results.
  if (game === null) {
    const error = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game/detail", {
    title: game.title,
    game: game,
    game_instances: gameInstances,
  });
});

// Displays Game create form on GET.
exports.game_create_get = asyncHandler(async (req, res, next) => {
  const [allDevelopers, allGenres, allConsoles] = await Promise.all([
    Developer.find({}).sort({ name: 1 }).exec(),
    Genre.find({}).sort({ name: 1 }).exec(),
    Console.find({}).sort({ name: 1 }).exec(),
  ]);

  res.render("game/form", {
    title: "Create Game",
    developers_list: allDevelopers,
    genres_list: allGenres,
    consoles_list: allConsoles,
  });
});

// Handles Game create on POST.
exports.game_create_post = [
  // Convert genres and consoles to arrays.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }

    if (!(req.body.consoles_available instanceof Array)) {
      if (typeof req.body.consoles_available === "undefined") {
        req.body.consoles_available = [];
      } else {
        req.body.consoles_available = new Array(req.body.consoles_available);
      }
    }
    next();
  },

  // Validate form data
  body("title", "Title must not be empty").trim().isLength({ min: 5 }).escape(),
  body("developer")
    .trim()
    .isLength({ min: 1 })
    .optional({ values: "falsy" })
    .escape(),
  // The wildcard (*) is used to individually validate each of the genre array entries.
  body("genre.*").optional({ values: "falsy" }).escape(),
  body("description")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ min: 1 })
    .escape(),
  body("released").optional({ values: "falsy" }).escape(),
  // The wildcard (*) is used to individually validate each of the consoles_available array entries.
  body("consoles_available.*").optional({ values: "falsy" }).escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create Game object.
    const game = new Game({
      title: req.body.title,
      developer: req.body.developer,
      genres: req.body.genres,
      description: req.body.description,
      released: req.body.released,
      consoles_available: req.body.consoles_available,
    });

    // Render form again if errors exist.
    if (!errors.isEmpty()) {
      const [allDevelopers, allGenres, allConsoles] = await Promise.all([
        Developer.find({}).sort({ name: 1 }).exec(),
        Genre.find({}).sort({ name: 1 }).exec(),
        Console.find({}).sort({ name: 1 }).exec(),
      ]);

      // Marking selected genres.
      for (const genre of allGenres) {
        if (game.genres.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      // Marking selected consoles.
      for (const console of allConsoles) {
        if (game.consoles_available.includes(console._id)) {
          console.checked = "true";
        }
      }

      res.render("game/form", {
        title: "Create Game",
        developers_list: allDevelopers,
        genres_list: allGenres,
        consoles_list: allConsoles,
        errors: errors.array(),
        game: game,
      });
      return;
    }
    // Valid form data.
    // Save object and redirect to it's page.
    else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

// Displays Game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  // Get the game and it's game instances.
  const [game, gameInstancesForGame] = await Promise.all([
    Game.findById(req.params.id).exec(),
    GameInstance.find({ game: req.params.id }).populate("game").exec(),
  ]);

  // No results.
  // Redirect to games list.
  if (game === null) {
    res.redirect("inventory/games");
  }

  res.render("game/delete", {
    title: "Delete Game",
    game: game,
    game_gameinstances: gameInstancesForGame,
  });
});

// Handles Game delete on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  // Only delete game if it has no game instances.
  const [game, gameInstancesForGame] = await Promise.all([
    Game.findById(req.params.id).exec(),
    GameInstance.find({ game: req.params.id }).populate("game").exec(),
  ]);

  if (gameInstancesForGame.length > 0) {
    res.render("game/delete", {
      title: "Delete Game",
      game: game,
      game_gameinstances: gameInstancesForGame,
    });
    return;
  }
  // Game has no instances. Safe to delete.
  // Redirect to games list.
  else {
    await Game.findByIdAndDelete(req.params.id).exec();

    res.redirect("/inventory/games");
  }
});

// Displays Game update on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  const [game, allDevelopers, allGenres, allConsoles] = await Promise.all([
    Game.findById(req.params.id).exec(),
    Developer.find({}).sort({ name: 1 }).exec(),
    Genre.find({}).sort({ name: 1 }).exec(),
    Console.find({}).sort({ name: 1 }).exec(),
  ]);

  // No results.
  if (game === null) {
    const error = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  // Marking selected genres.
  for (const genre of allGenres) {
    if (game.genres.includes(genre._id)) {
      genre.checked = "true";
    }
  }

  // Marking selected consoles.
  for (const console of allConsoles) {
    if (game.consoles_available.includes(console._id)) {
      console.checked = "true";
    }
  }

  res.render("game/form", {
    title: "Update Game",
    developers_list: allDevelopers,
    genres_list: allGenres,
    consoles_list: allConsoles,
    game: game,
  });
});

// Handles Game update on POSt.
exports.game_update_post = [
  // Convert genres and consoles to arrays.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }

    if (!(req.body.consoles_available instanceof Array)) {
      if (typeof req.body.consoles_available === "undefined") {
        req.body.consoles_available = [];
      } else {
        req.body.consoles_available = new Array(req.body.consoles_available);
      }
    }
    next();
  },

  // Validate form data
  body("title", "Title must not be empty").trim().isLength({ min: 5 }).escape(),
  body("developer")
    .trim()
    .isLength({ min: 1 })
    .optional({ values: "falsy" })
    .escape(),
  // The wildcard (*) is used to individually validate each of the genre array entries.
  body("genre.*").optional({ values: "falsy" }).escape(),
  body("description")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ min: 1 })
    .escape(),
  body("released").optional({ values: "falsy" }).escape(),
  // The wildcard (*) is used to individually validate each of the consoles_available array entries.
  body("consoles_available.*").optional({ values: "falsy" }).escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create Game object.
    const game = new Game({
      title: req.body.title,
      developer: req.body.developer,
      genres: req.body.genres,
      description: req.body.description,
      released: req.body.released,
      consoles_available: req.body.consoles_available,
      _id: req.params.id,
    });

    // Render form again if errors exist.
    if (!errors.isEmpty()) {
      const [allDevelopers, allGenres, allConsoles] = await Promise.all([
        Developer.find({}).sort({ name: 1 }).exec(),
        Genre.find({}).sort({ name: 1 }).exec(),
        Console.find({}).sort({ name: 1 }).exec(),
      ]);

      // Marking selected genres.
      for (const genre of allGenres) {
        if (game.genres.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      // Marking selected consoles.
      for (const console of allConsoles) {
        if (game.consoles_available.includes(console._id)) {
          console.checked = "true";
        }
      }

      res.render("game/form", {
        title: "Update Game",
        developers_list: allDevelopers,
        genres_list: allGenres,
        consoles_list: allConsoles,
        errors: errors.array(),
        game: game,
      });
      return;
    }
    // Valid form data.
    // Update object and redirect to it's page.
    else {
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});

      res.redirect(updatedGame.url);
    }
  }),
];
