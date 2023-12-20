const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConsoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
});

// Virtual for console's url.
ConsoleSchema.virtual("url").get(function () {
  return `/catalog/console/${this._id}`;
});

// Export model
module.exports = mongoose.model("Console", ConsoleSchema);
