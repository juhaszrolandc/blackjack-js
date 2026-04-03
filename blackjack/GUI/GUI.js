import { Game } from '../game_logic/blackjackGame.js'

function displayState( chipsCount, playerHandValue, dealerHandValue ){
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

function displayMessage( text, color ){
    const message = document.getElementById( "message" );
    message.innerHTML = text;
    message.style.background = color;
    message.style.visibility = "visible";
}

export function htmlMessageHidden(){
    message.style.visibility = "hidden";
}

export function htmlRoundAnnouncement( isPlayerWinTheRound, isDealerWinTheRound ){
    if( isPlayerWinTheRound && !isDealerWinTheRound ){
        displayMessage( "Gratulálok, nyertél!", "Green" );

    } else if ( !isPlayerWinTheRound && isDealerWinTheRound ){
        displayMessage( "Sajnos vesztettél!", "Red" );

    } else {
        displayMessage( "Döntetlen!", "Orange" );
    }
}






document.getElementById( "startBtn" ).addEventListener( "click", startBtn );
document.getElementById( "hitBtn" ).addEventListener( "click", hitBtn );
document.getElementById( "standBtn" ).addEventListener( "click", standBtn );
const game = new Game();
displayState( game.chipsCount, game.playerHandValue, game.dealerHandValue )

export function startBtn(){
    htmlMessageHidden();
    removeCards( "player" );
    removeCards( "dealer" );
    game.startRound();
    
    displayCard( "player", game.lastPlayerCard );
    displayCard( "dealer", game.lastDealerCard );
    displayState( game.chipsCount, game.playerHandValue, game.dealerHandValue );
}

export function hitBtn(){
    game.takeHit();
    displayCard( "player", game.lastPlayerCard );
    displayState( game.chipsCount, game.playerHandValue, game.dealerHandValue );
}

export function standBtn(){
    game.takeStand();
    removeCards( "dealer" );
    
    for( let card of game.dealerCard ){
        displayCard( "dealer", card );
    }

    displayState( game.chipsCount, game.playerHandValue, game.dealerHandValue );
    htmlRoundAnnouncement( game.isPlayerWinTheRound, game.isDealerWinTheRound );
}