const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  console: {
    type: Schema.Types.ObjectId,
    ref: "Console",
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Used"],
  },
});

// Virtual for game instance's url.
GameInstanceSchema.virtual("url").get(function () {
  return `/inventory/gameinstance/${this._id}`;
});

// Export model
module.exports = mongoose.model("GameInstance", GameInstanceSchema);
