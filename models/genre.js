const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
});

// Virtual for genre's url.
GenreSchema.virtual("url").get(function () {
  return `/inventory/genre/${this._id}`;
});

// Export model
module.exports = mongoose.model("Genre", GenreSchema);
