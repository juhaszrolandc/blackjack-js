import { Game } from '../game_logic/blackjackGame.js'

export function refreshHtmlTexts( chipsCount, playerHandValue, dealerHandValue ){
    document.getElementById( "chipsCount" ).innerHTML = chipsCount;
    document.getElementById( "playerHandValue" ).innerText = playerHandValue;
    document.getElementById( "dealerHandValue" ).innerText = dealerHandValue;

}

function createCardElement( card ){
    const cardImage = document.createElement('img');
    cardImage.src = `../images/deck/${card.rank}_of_${card.suit}.svg`;
    return cardImage;
}

function displayCard( who, card ){
    const handElement = document.getElementById( `${who}HandContainer` );
    handElement.appendChild( createCardElement(card) );
}

function removeCards( who ) {
    const handElement = document.getElementById( `${who}HandContainer` );
    handElement.replaceChildren();
}

export function htmlMessage( text, color = "Red" ){
    const message = document.getElementById( "message" );
    message.innerHTML = text;
    message.style.visibility = "visible";
    message.style.color = color;
}

export function htmlMessageHidden(){
    message.style.visibility = "hidden";
}

export function htmlRoundAnnouncement( isPlayerWinTheRound, isDealerWinTheRound ){
    if( isPlayerWinTheRound && !isDealerWinTheRound ){
        htmlMessage( "Gratulálok, nyertél!", "Green" );

    } else if ( !isPlayerWinTheRound && isDealerWinTheRound ){
        htmlMessage( "Sajnos vesztettél!", "Red" );

    } else {
        htmlMessage( "Döntetlen!", "Orange" );
    }
}


document.getElementById( "startBtn" ).addEventListener( "click", startBtn );
document.getElementById( "hitBtn" ).addEventListener( "click", hitBtn );
document.getElementById( "standBtn" ).addEventListener( "click", standBtn );
const game = new Game();




export function startBtn(){
    htmlMessageHidden();
    removeCards( "player" );
    removeCards( "dealer" );
    game.startRound();
    const gameState = game.getState();
    displayCard( "player", game.lastPlayerCard );
    displayCard( "dealer", game.lastDealerCard );

    refreshHtmlTexts( gameState.chipsCount, gameState.playerHandValue, gameState.dealerHandValue, gameState.playerCards, gameState.dealerCards );
}

export function hitBtn(){
    game.takeHit();
    const gameState = game.getState();
    displayCard( "player", game.lastPlayerCard );

    refreshHtmlTexts( gameState.chipsCount, gameState.playerHandValue, gameState.dealerHandValue, gameState.playerCards, gameState.dealerCards );
}

export function standBtn(){
    game.takeStand();
    const gameState = game.getState();

    removeCards( "dealer" );
    
    for( let card of game.dealerCard ){
        displayCard( "dealer", card );
    }

    refreshHtmlTexts( gameState.chipsCount, gameState.playerHandValue, gameState.dealerHandValue, gameState.playerCards, gameState.dealerCards );
    htmlRoundAnnouncement( gameState.isPlayerWin, gameState.isDealerWin );
}