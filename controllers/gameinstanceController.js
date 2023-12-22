const GameInstance = require("../models/gameinstance");
const asyncHandler = require("express-async-handler");

// Displays a list of all GamesInstances.
exports.gameinstance_list = asyncHandler(async (req, res, next) => {
  const allGameInstances = await GameInstance.find({})
    .populate("game")
    .sort()
    .exec();

  res.render("gameinstance/list", {
    title: "Game Instance List",
    gameinstance_list: allGameInstances,
  });
});

// Displays the detail page for a specific GameInstance.
exports.gameinstance_detail = asyncHandler(async (req, res, next) => {
  const gameInstance = await GameInstance.findById(req.params.id)
    .populate("game console")
    .exec();

  if (gameInstance === null) {
    const err = "Game copy not found";
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance/detail", {
    title: `Game Instance: ${gameInstance.game.title}`,
    gameinstance: gameInstance,
  });
});

// Displays GameInstance create form on GET.
exports.gameinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GameInstance create GET");
});

// Handles GameInstance create on POST.
exports.gameinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GameInstance create POST");
});

// Displays GameInstance delete form on GET.
exports.gameinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GameInstance delete GET");
});

// Handles GameInstance delete on POST.
exports.gameinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GameInstance delete POST");
});

// Displays GameInstance update on GET.
exports.gameinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GameInstance update GET");
});

// Handles GameInstance update on POSt.
exports.gameinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GameInstance update POST");
});
