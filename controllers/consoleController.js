const Console = require("../models/console");
const asyncHandler = require("express-async-handler");

// Displays a list of all Consoles.
exports.console_list = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Console list");
});

// Displays the detail page for a specific Console.
exports.console_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not implemented: Console detail: ${req.params.id} `);
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
