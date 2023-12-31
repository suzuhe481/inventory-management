const mongoose = require("mongoose");
const { DateTime } = require("luxon");

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
  rating: {
    type: String,
    enum: [
      "E (Everyone)",
      "E10+ (Everyone 10+)",
      "T (Teen)",
      "M (Mature)",
      "RP (Rating Pending)",
    ],
  },
  cover_art: {
    type: String,
  },
});

// Virtual for game's url.
GameSchema.virtual("url").get(function () {
  return `/inventory/game/${this._id}`;
});

// Virtual for list of game's consoles.
// Returns consoles as a comma separated string.
GameSchema.virtual("consoles_list").get(function () {
  var consoleList = "";
  for (var i = 0; i < this.consoles_available.length; i++) {
    consoleList += this.consoles_available[i].name;

    if (i < this.consoles_available.length - 1) {
      consoleList += ", ";
    }
  }
  return consoleList;
});

// Virtual for list of game's genres.
// Returns genres as a comma separated string.
GameSchema.virtual("genres_list").get(function () {
  var genreList = "";
  for (var i = 0; i < this.genres.length; i++) {
    genreList += this.genres[i].name;

    if (i < this.genres.length - 1) {
      genreList += ", ";
    }
  }
  return genreList;
});

// Virtual for formatted game's released day.
GameSchema.virtual("released_formatted").get(function () {
  return DateTime.fromJSDate(this.released).toLocaleString(DateTime.DATE_MED);
});

// Virtual for ISO formatted game's release date.
GameSchema.virtual("released_ISO").get(function () {
  return DateTime.fromJSDate(this.released).toISODate(); // format 'YYYY-MM-DD'
});

// Export model
module.exports = mongoose.model("Game", GameSchema);
