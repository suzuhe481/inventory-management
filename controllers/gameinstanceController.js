const gameinstance = require("../models/gameinstance");
const asyncHandler = require("express-async-handler");

// Displays a list of all GamesInstances.
exports.gameinstance_list = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GameInstance list");
});

// Displays the detail page for a specific GameInstance.
exports.gameinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not implemented: GameInstance detail: ${req.params.id} `);
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
