#! /usr/bin/env node

console.log(
  'This script populates some test games, genres, developers, consoles, and gameinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_management?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// Using models.
const Genre = require("./models/genre");
const Developer = require("./models/developer");
const Console = require("./models/console");
const Game = require("./models/game");
const GameInstance = require("./models/gameinstance");

// Storing created objects to be used as reference in later functions.
const genres = [];
const consoles = [];
const developers = [];
const games = [];
const gameinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected.");

  // Creating and saving objects to MongoDB
  await createGenres();
  await createDevelopers();
  await createConsoles();
  await createGames();
  await createGameInstances();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the *...Create functions so that, for example,
// genre[0] will always be the Action genre, regardless of the order
// in which the elements of promise.all's argument complete.
// They can also be reference in the create...* functions.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;

  console.log(`Added genre: ${genre}`);
}

async function developerCreate(index, name) {
  const developer = new Developer({ name: name });
  await developer.save();
  developers[index] = developer;

  console.log(`Added developer ${developer}`);
}

// Console is named newConsole to avoid conflicting with the global console object.
async function consoleCreate(index, name) {
  const newConsole = new Console({ name: name });
  await newConsole.save();
  consoles[index] = newConsole;

  console.log(`Added console: ${newConsole}`);
}

async function gameCreate(
  index,
  title,
  developer,
  genres,
  description,
  released,
  consoles_available
) {
  // Details initially get pulled only on required fields.
  const gamedetails = { title: title };

  // If following fields are not false, get the corresponding field from parameter.
  if (developer != false) gamedetails.developer = developer;
  if (genres != false) gamedetails.genres = genres;
  if (description != false) gamedetails.description = description;
  if (released != false) gamedetails.released = released;
  if (consoles_available != false)
    gamedetails.consoles_available = consoles_available;

  // Saving to MongoDB.
  const game = new Game(gamedetails);
  await game.save();
  games[index] = game;

  console.log(`Added game: ${game}`);
}

// Parameter is consoleName to avoid conflicting with the global console object.
async function gameInstanceCreate(index, game, consoleName, price, condition) {
  const newGameinstance = new GameInstance({
    game: game,
    console: consoleName,
    price: price,
    condition: condition,
  });
  await newGameinstance.save();
  gameinstances[index] = newGameinstance;

  console.log(`Added game instance ${newGameinstance}`);
}

async function createGenres() {
  console.log("Adding genres");

  await Promise.all([
    genreCreate(0, "Action"),
    genreCreate(1, "RPG"),
    genreCreate(2, "Shooter"),
    genreCreate(3, "Adventure"),
    genreCreate(4, "Platform"),
    genreCreate(5, "Open World"),
    genreCreate(6, "Rougelike"),
  ]);
}

async function createDevelopers() {
  console.log("Adding developers");

  await Promise.all([
    developerCreate(0, "Drinkbox Studios"),
    developerCreate(1, "Insomniac Games"),
    developerCreate(2, "Nintendo"),
    developerCreate(3, "Bethesda Game Studios"),
    developerCreate(4, "Supergiant Games"),
  ]);
}

async function createConsoles() {
  console.log("Adding consoles");

  await Promise.all([
    consoleCreate(0, "Playstation 4"),
    consoleCreate(1, "Playstation 5"),
    consoleCreate(2, "Xbox One"),
    consoleCreate(3, "Xbox Series S"),
    consoleCreate(4, "Xbox Series X"),
    consoleCreate(5, "Nintendo Switch"),
    consoleCreate(6, "Microsoft Windows"),
    consoleCreate(7, "macOS"),
    consoleCreate(8, "iOS"),
  ]);
}

async function createGames() {
  console.log("Adding games");

  await Promise.all([
    gameCreate(
      0,
      "Nobody Saves the World",
      developers[0],
      [genres[0], genres[1], genres[2]],
      "Transform from a featureless nobody into a SLUG, a GHOST and a DRAGON in this new take on Action RPGs from the creators of Guacamelee! Discover 15+ distinct Forms, mix-and-match their abilities, clear evolving dungeons and... SAVE THE WORLD!?",
      "2022-01-18",
      [
        consoles[0],
        consoles[1],
        consoles[2],
        consoles[3],
        consoles[4],
        consoles[5],
        consoles[6],
      ]
    ),
    gameCreate(
      1,
      "Marvel's Spider-Man 2",
      developers[1],
      [genres[0], genres[3]],
      "Swing, jump and utilize the new Web Wings to travel across Marvel's New York, quickly switching between Peter Parker and Miles Morales to experience different stories and epic new powers, as the iconic villain Venom threatens to destroy their lives, their city and the ones they love.",
      "2023-10-20",
      consoles[1]
    ),
    gameCreate(
      2,
      "Super Mario Bros. Wonder",
      developers[2],
      [genres[4]],
      false,
      "2023-10-20",
      consoles[5]
    ),
    gameCreate(
      3,
      "Starfield",
      developers[3],
      [genres[5], genres[0], genres[2], genres[1]],
      "Starfield is the first new universe in over 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4. In this next generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom as you embark on an epic journey to answer humanity’s greatest mystery.",
      "2023-09-06",
      [consoles[3], consoles[4], consoles[6]]
    ),
    gameCreate(
      4,
      "Hades",
      developers[4],
      [genres[6], genres[0], genres[1]],
      false,
      "2018-12-06",
      [
        consoles[0],
        consoles[1],
        consoles[2],
        consoles[3],
        consoles[4],
        consoles[5],
        consoles[6],
        consoles[7],
        consoles[8],
      ]
    ),
  ]);
}

async function createGameInstances() {
  console.log("Adding game instances");

  await Promise.all([
    gameInstanceCreate(0, games[0], consoles[1], 19.99, "New"),
    gameInstanceCreate(1, games[0], consoles[4], 19.99, "New"),
    gameInstanceCreate(2, games[1], consoles[1], 69.99, "New"),
    gameInstanceCreate(3, games[1], consoles[1], 49.99, "Used"),
    gameInstanceCreate(4, games[2], consoles[5], 59.99, "New"),
    gameInstanceCreate(5, games[3], consoles[3], 69.99, "New"),
    gameInstanceCreate(6, games[3], consoles[4], 49.99, "Used"),
    gameInstanceCreate(7, games[4], consoles[6], 19.99, "New"),
    gameInstanceCreate(8, games[4], consoles[7], 19.99, "New"),
  ]);
}
