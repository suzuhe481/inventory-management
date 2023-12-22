const Console = require("../models/console");
const asyncHandler = require("express-async-handler");

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
exports.console_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Console create GET");
});

// Handles Console create on POST.
exports.console_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Console create POST");
});

// Displays Console delete form on GET.
exports.console_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Console delete GET");
});

// Handles Console delete on POST.
exports.console_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Console delete POST");
});

// Displays Console update on GET.
exports.console_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Console update GET");
});

// Handles Console update on POSt.
exports.console_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Console update POST");
});
