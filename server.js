import express from "express";
import { Game } from './classes_build/Game.js';
const server = express();
const game = new Game();
server.listen(8000);
server.set("view engine", "ejs");
server.use(express.static("public"));
server.get('/', (request, response) => {
    response.render('index');
});
server.get('/new-game', (request, response) => {
    game.newGame();
    response.json(game.state);
});
server.get('/new-round', (request, response) => {
    game.startRound();
    response.json(game.state);
});
server.get('/hit', (request, response) => {
    game.takeHit();
    response.json(game.state);
});
server.get('/stand', (request, response) => {
    game.takeStand();
    response.json(game.state);
});
