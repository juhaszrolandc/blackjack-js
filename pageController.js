import { Game } from './Game.js';
const game = new Game();


document.getElementById("startBtn").addEventListener("click", startRound);
document.getElementById("hitBtn").addEventListener("click", takeHit);
document.getElementById("standBtn").addEventListener("click", takeStand);

function refreshHtmlTexts(){
    document.getElementById("chipsCount").innerHTML = game.player.chips;
    document.getElementById("playerHandValue").innerText = game.player.handValue;
    document.getElementById("dealerHandValue").innerText = game.dealer.handValue;
    document.getElementById("playerCards").innerText = JSON.stringify(game.player.cards);
    document.getElementById("dealerCards").innerText = JSON.stringify(game.dealer.cards);
}

function htmlMessage( text, color = "Red" ){
    const message = document.getElementById("message");
    message.innerHTML = text;
    message.style.visibility = "visible";
    message.style.color = color;
}

function htmlMessageHidden(){
    message.style.visibility = "hidden";
}

function htmlRoundAnnouncement(){
    if( game.isPlayerWinTheRound && !game.isDealerWinTheRound ){
        htmlMessage( "Gratulálok, nyerét!", "Green" );

    } else if ( !game.isPlayerWinTheRound && game.isDealerWinTheRound ){
        htmlMessage( "Sajnos vesztettél!", "Red" );

    } else {
        htmlMessage( "Döntetlen!", "Orange" );
    }
}

export function takeHit(){
    game.playerDrawCard();
    refreshHtmlTexts();
}

export function takeStand(){
    game.player.takeStand();
    game.dealerDrawToSeventeen();
    game.settleRound();
    refreshHtmlTexts();
    htmlRoundAnnouncement();
}

export function startRound(){

    game.initRound();
    htmlMessageHidden();

    try {
        game.everyoneTakesBet();
    } catch {
        htmlMessage( "HIBA: Elfogytak a zsetonjaid?", "Red" );
    }
    
    game.dealerDrawCard();
    refreshHtmlTexts();
}