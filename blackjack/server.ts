import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Game } from './classes_build/Game.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server: express.Application = express();
export const game: Game = new Game();

server.listen(8000);
server.set("view engine", "ejs");
server.use(express.static(__dirname +'\\public'));
server.set('views', __dirname + '\\views');

server.get('/', (request, response) => {
    response.render('index');
});

server.get('/new-game', (request, response) => {
    game.newGame();
    response.json( game.state );
});

server.get('/new-round', (request, response) => {
    game.startRound();
    response.json( game.state );
});

server.get('/hit', (request, response) => {
    game.takeHit();
    response.json( game.state );
});

server.get('/stand', (request, response) => {
    game.takeStand();
    response.json( game.state );
});