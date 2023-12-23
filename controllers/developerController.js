const Developer = require("../models/developer");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Displays a list of all Developers.
exports.developer_list = asyncHandler(async (req, res, next) => {
  const allDevelopers = await Developer.find({}).sort({ name: 1 }).exec();

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
exports.developer_create_get = (req, res, next) => {
  res.render("developer/form", { title: "Create Developer" });
};

// Handles Developer create on POST.
exports.developer_create_post = [
  // Validate and sanitize name field.
  body("name", "Developer must contain at least 1 character.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors.
    const errors = validationResult(req);

    // Create developer object with escaped/trimmed data.
    const developer = new Developer({ name: req.body.name });

    // There are errors.
    // Render form again with sanitized values and error messages.
    if (!errors.isEmpty()) {
      res.render("developer/form", {
        title: "Create Developer",
        developer: developer,
        errors: errors.array(),
      });
      return;
    }
    // Data is valid.
    else {
      // Check if developer already exists.
      // Case insensitive search and ignores accents.
      const developerExists = await Developer.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      // Redirect to existing developer's detail page.
      if (developerExists) {
        res.redirect(developerExists.url);
      }
      // Save new developer.
      // Redirect to it's detail page.
      else {
        await developer.save();
        res.redirect(developer.url);
      }
    }
  }),
];

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
