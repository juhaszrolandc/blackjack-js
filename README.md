## script/Card.js, script/Deck.js, script/Player.js
A Card, Deck, Player osztályok nem tartalmaznak blackjack specifikus részeket.
A blackjack játék logikájától teljesen leválasztott.

## script/ViewController.js
A DOM-al kommunikáló metódusok: displayCard, displayMessage, ...

## script/Game.js
Csak a játék logikáját tartalmazza, a megjelenítéssel egyáltalán nem foglalkozik.
Még ViewController metódusokat sem hív.

## script/GameController.js
A Game objectet és a ViewControllert kapcsolja össze.

## script/BlackjackPlayer.js
A Player osztály gyermeke, ami már blackjack specifikus részeket is tartalmaz.

