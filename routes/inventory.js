const express = require("express");
const router = express.Router();

// Requiring controllers
const game_controller = require("../controllers/gameController");
const console_controller = require("../controllers/consoleController");
const developer_controller = require("../controllers/developerController");
const genre_controller = require("../controllers/genreController");
const game_instance_controller = require("../controllers/gameinstanceController");
const gameinstance = require("../models/gameinstance");

// GAME ROUTES **********

// GET inventory home page
router.get("/", game_controller.index);

// GET/POST requests for creating a Game.
// NOTE: This must come before the routes that displays Game (uses :id)
router.get("/game/create", game_controller.game_create_get);
router.post("/game/create", game_controller.game_create_post);

// GET/POST requests to delete a Game.
router.get("/game/:id/delete", game_controller.game_delete_get);
router.post("/game/:id/delete", game_controller.game_delete_post);

// GET/POST requests to update a Game.
router.get("/game/:id/update", game_controller.game_update_get);
router.post("/game/:id/update", game_controller.game_update_post);

// GET requests for one/all Games.
router.get("/game/:id", game_controller.game_detail);
router.get("/games", game_controller.game_list);

// CONSOLE ROUTES **********

// GET/POST requests for creating a Console.
// NOTE: Must come before routes that display Console (uses :id)
router.get("/console/create", console_controller.console_create_get);
router.post("/console/create", console_controller.console_create_post);

// GET/POST requests to delete a Console.
router.get("/console/:id/delete", console_controller.console_delete_get);
router.post("/console/:id/delete", console_controller.console_delete_post);

// GET/POST requests to update a Console.
router.get("/console/:id/update", console_controller.console_update_get);
router.post("/console/:id/update", console_controller.console_update_post);

// GET/POST requests for one Console.
router.get("/console/:id", console_controller.console_detail);
router.get("/consoles", console_controller.console_list);

// DEVELOPER ROUTES **********

// GET/POST requests for creating a Developer.
// Note: Must come before routes that display Developer (uses :id)
router.get("/developer/create", developer_controller.developer_create_get);
router.post("/developer/create", developer_controller.developer_create_post);

// GET/POST requests for deleting a Developer.
router.get("/developer/:id/delete", developer_controller.developer_delete_get);
router.post(
  "/developer/:id/delete",
  developer_controller.developer_delete_post
);

// GET/POST requests for updating a Developer.
router.get("/developer/:id/update", developer_controller.developer_update_get);
router.post(
  "/developer/:id/update",
  developer_controller.developer_update_post
);

// GET/POST requests for one/all Developers.
router.get("/developer/:id", developer_controller.developer_detail);
router.get("/developers", developer_controller.developer_list);

// GENRE ROUTES **********

// GET/POST requests for creating a Genre.
// NOTE: Must come before routes that display Genre (uses :id)
router.get("/genre/create", genre_controller.genre_create_get);
router.post("/genre/create", genre_controller.genre_create_post);

// GET/POST requests for deleting a Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET/POST requests for updating a Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET/POST requests for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);
router.get("/genres", genre_controller.genre_list);

// GAMEINSTANCE ROUTES **********

// GET/POST requests for creating a Game Instance.
// NOTE: Must come before routes that display Game Instance (uses :id)
router.get(
  "/gameinstance/create",
  game_instance_controller.gameinstance_create_get
);
router.post(
  "/gameinstance/create",
  game_instance_controller.gameinstance_create_post
);

// GET/POST requests for deleting a Game Instance.
router.get(
  "/gameinstance/:id/delete",
  game_instance_controller.gameinstance_delete_get
);
router.post(
  "/gameinstance/:id/delete",
  game_instance_controller.gameinstance_delete_post
);

// GET/POST requests for updating a Game Instance.
router.get(
  "/gameinstance/:id/update",
  game_instance_controller.gameinstance_update_get
);
router.post(
  "/gameinstance/:id/update",
  game_instance_controller.gameinstance_update_post
);

// GET requests to get one/all Game Instance.
router.get("/gameinstance/:id", game_instance_controller.gameinstance_detail);
router.get("/gameinstances", game_instance_controller.gameinstance_list);

module.exports = router;
