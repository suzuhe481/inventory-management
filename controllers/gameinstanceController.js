const GameInstance = require("../models/gameinstance");
const Game = require("../models/game");
const Console = require("../models/console");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
    const err = new Error("Game copy not found");
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
  const allGames = await Game.find({}, "title")
    .populate("consoles_available")
    .sort({ title: 1 })
    .exec();

  res.render("gameinstance/form", {
    title: "Create Game Instance (copy)",
    game_list: allGames,
  });
});

// Handles GameInstance create on POST.
exports.gameinstance_create_post = [
  // Validate form data
  body("password", "Invalid password")
    .trim()
    .escape()
    .equals(process.env.ADMIN_PASS),
  body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),
  body("console", "Console must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be greater than 0.01")
    .trim()
    .isFloat({ min: 0.01 })
    .escape(),
  body("condition", "Invalid condition").escape(),

  // Async
  asyncHandler(async (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);

    // Create Game Instance object
    const gameInstance = new GameInstance({
      game: req.body.game,
      console: req.body.console,
      price: req.body.price,
      condition: req.body.condition,
    });

    // Return form again if errors exist.
    if (!errors.isEmpty()) {
      const allGames = await Game.find({}, "title")
        .populate("consoles_available")
        .sort({ title: 1 })
        .exec();

      res.render("gameinstance/form", {
        title: "Create Game Instance",
        game_list: allGames,
        errors: errors.array(),
        gameinstance: gameInstance,
      });
      return;
    }
    // Form data is valid. Save object and redirect to it's page.
    else {
      await gameInstance.save();

      res.redirect(gameInstance.url);
    }
  }),
];

// Displays GameInstance delete form on GET.
exports.gameinstance_delete_get = asyncHandler(async (req, res, next) => {
  // Get the game instance
  const gameInstance = await GameInstance.findById(req.params.id)
    .populate("game console")
    .exec();

  // No results.
  // Redirect to game instances list.
  if (gameInstance === null) {
    res.redirect("inventory/gameinstances");
  }

  res.render("gameinstance/delete", {
    title: "Delete Game Instance (copy)",
    gameinstance: gameInstance,
  });
});

// Handles GameInstance delete on POST.
exports.gameinstance_delete_post = [
  // Validating password.
  body("password", "Invalid password")
    .trim()
    .escape()
    .equals(process.env.ADMIN_PASS),

  asyncHandler(async (req, res, next) => {
    // Extract errors. (Password incorrect)
    const errors = validationResult(req);

    const gameInstance = await GameInstance.findById(req.params.id)
      .populate("game")
      .exec();

    // There are errors.
    // Render form again with sanitized values and error messages.
    if (!errors.isEmpty()) {
      res.render("gameinstance/delete", {
        title: "Delete Game Instance (copy)",
        gameinstance: gameInstance,
        errors: errors.array(),
      });
      return;
    } else {
      next();
    }
  }),

  asyncHandler(async (req, res, next) => {
    // Game instance can be deleted in any circumstance.
    await GameInstance.findByIdAndDelete(req.params.id).exec();

    // Redirect to game instances list page.
    res.redirect("/inventory/gameinstances");
  }),
];

// Displays GameInstance update on GET.
exports.gameinstance_update_get = asyncHandler(async (req, res, next) => {
  const [gameInstance, allGames] = await Promise.all([
    GameInstance.findById(req.params.id).exec(),
    Game.find({}, "title")
      .populate("consoles_available")
      .sort({ title: 1 })
      .exec(),
  ]);

  // No results.
  if (gameInstance === null) {
    const err = new Error("Game copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance/form", {
    title: "Update Game Instance (copy)",
    game_list: allGames,
    gameinstance: gameInstance,
  });
});

// Handles GameInstance update on POSt.
exports.gameinstance_update_post = [
  // Validate form data
  body("password", "Invalid password")
    .trim()
    .escape()
    .equals(process.env.ADMIN_PASS),
  body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),
  body("console", "Console must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be greater than 0.01")
    .trim()
    .isFloat({ min: 0.01 })
    .escape(),
  body("condition", "Invalid condition").escape(),

  // Async
  asyncHandler(async (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);

    // Create Game Instance object
    const gameInstance = new GameInstance({
      game: req.body.game,
      console: req.body.console,
      price: req.body.price,
      condition: req.body.condition,
      _id: req.params.id,
    });

    // Return form again if errors exist.
    if (!errors.isEmpty()) {
      const allGames = await Game.find({}, "title")
        .populate("consoles_available")
        .sort({ title: 1 })
        .exec();

      res.render("gameinstance/form", {
        title: "Update Game Instance",
        game_list: allGames,
        errors: errors.array(),
        gameinstance: gameInstance,
      });
      return;
    }
    // Form data is valid. Update object and redirect to it's page.
    else {
      const updatedGameInstance = await GameInstance.findByIdAndUpdate(
        req.params.id,
        gameInstance,
        {}
      );

      res.redirect(updatedGameInstance.url);
    }
  }),
];
