const Game = require("../models/game");
const GameInstance = require("../models/gameinstance");
const Genre = require("../models/genre");
const Developer = require("../models/developer");
const Console = require("../models/console");

const asyncHandler = require("express-async-handler");

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
  res.send("Not implemented: Game create GET");
});

// Handles Game create on POST.
exports.game_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Game create POST");
});

// Displays Game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Game delete GET");
});

// Handles Game delete on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Game delete POST");
});

// Displays Game update on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Game update GET");
});

// Handles Game update on POSt.
exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Game update POST");
});
