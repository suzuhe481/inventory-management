const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  developer: {
    type: Schema.Types.ObjectId,
    ref: "Developer",
  },
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  description: {
    type: String,
  },
  released: {
    type: Date,
  },
  consoles_available: [{ type: Schema.Types.ObjectId, ref: "Console" }],
});

// Virtual for game's url.
GameSchema.virtual("url").get(function () {
  return `/catalog/game/${this._id}`;
});

// Export model
module.exports = mongoose.model("Game", GameSchema);
