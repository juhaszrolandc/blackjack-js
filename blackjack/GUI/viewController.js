export class ViewController{

    init( gameController ) {
        document.getElementById( "startBtn" ).addEventListener( "click", () => gameController.start() );
        document.getElementById( "hitBtn" ).addEventListener( "click", () => gameController.hit() );
        document.getElementById( "standBtn" ).addEventListener( "click", () => gameController.stand() );
    }

    displayState( chipsCount, playerHandValue, dealerHandValue ){
        document.getElementById( "chipsCount" ).innerHTML = chipsCount;
        document.getElementById( "playerHandValue" ).innerText = playerHandValue;
        document.getElementById( "dealerHandValue" ).innerText = dealerHandValue;
    }
    
    createCardElement( card ){
        const cardImage = document.createElement('img');
        cardImage.src = `../images/deck/${card.rank}_of_${card.suit}.svg`;
        return cardImage;
    }
    
    displayCard( who, cards ){
        const handElement = document.getElementById( `${who}HandContainer` );
        const cardList = Array.isArray(cards) ? cards : [cards];
        for (const card of cardList) {
            handElement.appendChild( this.createCardElement(card) );
        }
    }
    
    removeCards( who ) {
        const handElement = document.getElementById( `${who}HandContainer` );
        handElement.replaceChildren();
    }
    
    displayMessage( text, color ){
        const message = document.getElementById( "message" );
        message.innerHTML = text;
        message.style.background = color;
        message.style.visibility = "visible";
    }
    
    messageHidden(){
        message.style.visibility = "hidden";
    }

}