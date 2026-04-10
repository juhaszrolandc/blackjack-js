import { Game } from './Game.js'
import { ViewController } from './ViewController.js';

const view = new ViewController();
const game = new Game( view );
view.init( game );
game.displayState();

window.addEventListener("beforeunload", function (e) {
    const message = "Biztosan bezárja a játékot?";
    return message;
});