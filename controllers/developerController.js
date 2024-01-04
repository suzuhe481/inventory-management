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
  body("password", "Invalid password")
    .trim()
    .escape()
    .equals(process.env.ADMIN_PASS),
  body("name", "Developer must contain at least 1 character.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year_established", "Year Established must be 4 digits.")
    .trim()
    .isLength({ min: 4, max: 4 })
    .optional({ values: "falsy" })
    .escape(),
  body("founders", "Founders must be under 500 characters.")
    .trim()
    .isLength({ max: 500 })
    .optional({ values: "falsy" })
    .escape(),
  body("description", "Description must be under 500 characters.")
    .trim()
    .isLength({ max: 500 })
    .optional({ values: "falsy" })
    .escape(),
  body("site", "Site must be a valid url.")
    .trim()
    .isURL()
    .optional({ values: "falsy" }),

  // Process request after validation and sanitation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors.
    const errors = validationResult(req);

    // Create developer object with escaped/trimmed data.
    const developer = new Developer({
      name: req.body.name,
      year_established: req.body.year_established,
      founders: req.body.founders,
      description: req.body.founders,
      site: req.body.site,
    });

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
  // Get the developer and their games.
  const [developer, gamesByDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }).exec(),
  ]);

  // No results. Redirect to developer page.
  if (developer === null) {
    res.redirect("/inventory/developers");
  }

  res.render("developer/delete", {
    title: "Delete Developer",
    developer: developer,
    developer_games: gamesByDeveloper,
  });
});

// Handles Developer delete on POST.
exports.developer_delete_post = [
  // Validating password separately first.
  body("password", "Invalid password")
    .trim()
    .escape()
    .equals(process.env.ADMIN_PASS),

  // Process request after validation and sanitation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors.
    const errors = validationResult(req);

    // Only deletes developer if they have no games.
    const [developer, gamesByDeveloper] = await Promise.all([
      Developer.findById(req.params.id).exec(),
      Game.find({ developer: req.params.id }).exec(),
    ]);

    // There are errors.
    // Render form again with sanitized values and error messages.
    if (!errors.isEmpty()) {
      res.render("developer/delete", {
        title: "Delete Developer",
        developer: developer,
        errors: errors.array(),
        developer: developer,
        developer_games: gamesByDeveloper,
      });
      return;
    } else {
      next();
    }
  }),

  asyncHandler(async (req, res, next) => {
    // Only deletes developer if they have no games.
    const [developer, gamesByDeveloper] = await Promise.all([
      Developer.findById(req.params.id).exec(),
      Game.find({ developer: req.params.id }).exec(),
    ]);

    if (gamesByDeveloper.length > 0) {
      res.render("developer/delete", {
        title: "Delete Developer",
        developer: developer,
        developer_games: gamesByDeveloper,
      });
      return;
    }
    // Developer has no games. Safe to delete.
    // Redirect to developers list.
    else {
      await Developer.findByIdAndDelete(req.params.id).exec();

      res.redirect("/inventory/developers");
    }
  }),
];

// Displays Developer update on GET.
exports.developer_update_get = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id).exec();

  if (developer === null) {
    const err = new Error("Developer not found");
    err.status = 404;
    return next(err);
  }

  res.render("developer/form", {
    title: `Update Developer: ${developer.name}`,
    developer: developer,
  });
});

// Handles Developer update on POSt.
exports.developer_update_post = [
  // Validate and sanitize name field.
  body("password", "Invalid password")
    .trim()
    .escape()
    .equals(process.env.ADMIN_PASS),
  body("name", "Developer must contain at least 1 character.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year_established", "Year Established must be 4 digits.")
    .trim()
    .isLength({ min: 4, max: 4 })
    .optional({ values: "falsy" })
    .escape(),
  body("founders", "Founders must be under 500 characters.")
    .trim()
    .isLength({ max: 500 })
    .optional({ values: "falsy" })
    .escape(),
  body("description", "Description must be under 500 characters.")
    .trim()
    .isLength({ max: 500 })
    .optional({ values: "falsy" })
    .escape(),
  body("site", "Site must be a valid url.")
    .trim()
    .isURL()
    .optional({ values: "falsy" }),

  // Process request after validation and sanitation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors.
    const errors = validationResult(req);

    // Create developer object with escaped/trimmed data.
    const developer = new Developer({
      name: req.body.name,
      year_established: req.body.year_established,
      founders: req.body.founders,
      description: req.body.description,
      site: req.body.site,
      _id: req.params.id,
    });

    // There are errors.
    // Render form again with sanitized values and error messages.
    if (!errors.isEmpty()) {
      res.render("developer/form", {
        title: "Update Developer",
        developer: developer,
        errors: errors.array(),
      });
      return;
    }
    // Data is valid.
    // Update developer.
    // Redirect to it's detail page.
    else {
      const updatedDeveloper = await Developer.findByIdAndUpdate(
        req.params.id,
        developer,
        {}
      );
      res.redirect(updatedDeveloper.url);
    }
    // }
  }),
];
