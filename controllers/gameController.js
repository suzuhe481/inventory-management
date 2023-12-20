const game = require("../models/game");
const asyncHandler = require("express-async-handler");

// Displays the Inventory home page
exports.index = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Home page");
});

// Displays a list of all Games.
exports.game_list = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Game list");
});

// Displays the detail page for a specific Game.
exports.game_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not implemented: Game detail: ${req.params.id} `);
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
