const Developer = require("../models/developer");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

// Displays a list of all Developers.
exports.developer_list = asyncHandler(async (req, res, next) => {
  const allDevelopers = await Developer.find({}).sort().exec();

  res.render("developer/list", {
    title: "Developer List",
    developer_list: allDevelopers,
  });
});

// Displays the detail page for a specific Developer.
exports.developer_detail = asyncHandler(async (req, res, next) => {
  const [developer, gamesByDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id })
      .populate("consoles_available genres")
      .exec(),
  ]);

  if (developer === null) {
    const err = new Error("Developer not found");
    err.status = 404;
    return next(err);
  }

  res.render("developer/detail", {
    title: `Developer: ${developer.name}`,
    developer: developer,
    developer_games: gamesByDeveloper,
  });
});

// Displays Developer create form on GET.
exports.developer_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Developer create GET");
});

// Handles Developer create on POST.
exports.developer_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Developer create POST");
});

// Displays Developer delete form on GET.
exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Developer delete GET");
});

// Handles Developer delete on POST.
exports.developer_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Developer delete POST");
});

// Displays Developer update on GET.
exports.developer_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Developer update GET");
});

// Handles Developer update on POSt.
exports.developer_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Developer update POST");
});
