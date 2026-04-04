## base/...
A Card, Deck, Player osztályok nem tartalmaznak blackjack specifikus részeket.
A blackjack játék logikájától teljesen leválasztott.

## blackjack/GUI/ViewController.js
A DOM-al kommunikáló metódusok: displayCard, displayMessage, ...

## blackjack/game_logic/Game.js
Csak a játék logikáját tartalmazza, a megjelenítéssel egyáltalán nem foglalkozik.
Még ViewController metódusokat sem hív.

## blackjack/GUI/GameController.js
A Game objectet és a ViewControllert kapcsolja össze.

## blackjack/game_logic/BlackjackPlayer.js
A Player osztály gyermeke, ami már blackjack specifikus részeket is tartalmaz.

