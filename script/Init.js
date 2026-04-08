import { Game } from './Game.js'
import { GameController } from './GameController.js';
import { ViewController } from './ViewController.js';

const game = new Game();
const view = new ViewController();
const gameController = new GameController( game, view );

view.init( gameController );
view.displayState( game.chipsCount, game.playerHandValue, game.dealerHandValue );

window.addEventListener("beforeunload", function (e) {
    const message = "Biztosan bezárja a játékot?";
    return message;
});