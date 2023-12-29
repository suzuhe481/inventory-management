const Console = require("../models/console");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Displays a list of all Consoles.
exports.console_list = asyncHandler(async (req, res, next) => {
  const allConsoles = await Console.find({}).sort({ name: 1 }).exec();

  res.render("console/list", {
    title: "Console List",
    console_list: allConsoles,
  });
});

// Displays the detail page for a specific Console.
exports.console_detail = asyncHandler(async (req, res, next) => {
  const console = await Console.findById(req.params.id).exec();

  if (console === null) {
    const err = "Console not found";
    err.status = 404;
    return next(err);
  }

  res.render("console/detail", {
    title: `Console: ${console.name}`,
    console: console,
  });
});

// Displays Console create form on GET.
exports.console_create_get = (req, res, next) => {
  res.render("console/form", { title: "Create Console" });
};

// Handles Console create on POST.
exports.console_create_post = [
  // Validate form fields.
  body("name", "Console must contain at least 1 character.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Async
  asyncHandler(async (req, res, next) => {
    // Extract errors from request.
    const errors = validationResult(req);

    // Create object
    const console = new Console({ name: req.body.name });

    // Return form if errors exist
    if (!errors.isEmpty()) {
      res.render("console/form", {
        title: "Create Console",
        console: console,
        errors: errors.array(),
      });
    } else {
      // Redirect to object page if object exists.
      const consoleExists = await Console.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (consoleExists) {
        res.redirect(consoleExists.url);
      }
      // Save and redirect to new page.
      else {
        await console.save();
        res.redirect(console.url);
      }
    }
  }),
];

// Displays Console delete form on GET.
exports.console_delete_get = asyncHandler(async (req, res, next) => {
  // Get the console and their associated games.
  const [console, gamesForConsole] = await Promise.all([
    Console.findById(req.params.id).exec(),
    Game.find({ consoles_available: req.params.id }).exec(),
  ]);

  // No results.
  // Redirect to consoles list.
  if (console === null) {
    res.redirect("inventory/consoles");
  }

  res.render("console/delete", {
    title: "Delete Console",
    console: console,
    console_games: gamesForConsole,
  });
});

// Handles Console delete on POST.
exports.console_delete_post = asyncHandler(async (req, res, next) => {
  // Only deletes console if it has no games.
  const [console, gamesForConsole] = await Promise.all([
    Console.findById(req.params.id).exec(),
    Game.find({ consoles_available: req.params.id }).exec(),
  ]);

  if (gamesForConsole.length > 0) {
    res.render("console/delete", {
      title: "Delete Console",
      console: console,
      console_games: gamesForConsole,
    });
    return;
  }
  // Console has no games. Safe to delete.
  // Redirect to consoles list.
  else {
    await Console.findByIdAndDelete(req.params.id).exec();

    res.redirect("/inventory/consoles");
  }
});

// Displays Console update on GET.
exports.console_update_get = asyncHandler(async (req, res, next) => {
  const console = await Console.findById(req.params.id).exec();

  if (console === null) {
    const err = "Console not found";
    err.status = 404;
    return next(err);
  }

  res.render("console/form", {
    title: `Update Console: ${console.name}`,
    console: console,
  });
});

// Handles Console update on POSt.
exports.console_update_post = [
  // Validate form fields.
  body("name", "Console must contain at least 1 character.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Async
  asyncHandler(async (req, res, next) => {
    // Extract errors from request.
    const errors = validationResult(req);

    // Create object with original object's id.
    const console = new Console({ name: req.body.name, _id: req.params.id });

    // Return form if errors exist
    if (!errors.isEmpty()) {
      res.render("console/form", {
        title: "Update Console",
        console: console,
        errors: errors.array(),
      });
    }
    // Update and redirect to updated page.
    else {
      const updatedConsole = await Console.findByIdAndUpdate(
        req.params.id,
        console,
        {}
      );

      res.redirect(updatedConsole.url);
    }
  }),
];
