import { Game } from './Game.js'
import { ViewController } from './ViewController.js';

const view: ViewController = new ViewController();
const game: Game = new Game( view );
view.init( () => game.startRound(), () => game.takeHit(), () => game.takeStand() );
game.displayInitialState();

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
});