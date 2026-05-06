import { View } from './ViewInterface.js';

type Participant = "player" | "dealer";
type Card = { rank:string, suit:string, value:number };
type GameState = { "isRoundInProgress": boolean,
                   "playerChips": number, 
                   "playerHandValue": number, 
                   "dealerHandValue": number, 
                   "dealerHand": Card[], 
                   "playerHand": Card[], 
                   "message": { text: string, color: 'red' | 'green' | 'orange' | '' } }

export class ViewController implements View {
    render( gameState: GameState ){
        const playerCards: HTMLElement = document.getElementById("tableContainer") as HTMLElement;
        playerCards.style.visibility = "hidden";

        this.displayState( gameState.playerChips, gameState.playerHandValue, gameState.dealerHandValue );
        this.setButtonStates( gameState.isRoundInProgress );

        this.removeCards( "player" );
        this.displayCard( "player", gameState.playerHand );

        this.removeCards( "dealer" );
        this.displayCard( "dealer", gameState.dealerHand );

        if( gameState.message.text === "" ){
            this.messageHidden();
        } else {
            this.displayMessage( gameState.message.text, gameState.message.color );
        }
        
        playerCards.style.visibility = "visible";
    }

    displayState( chipsCount: number | "-", playerHandValue: number | "-", dealerHandValue: number | "-" ): void {
        const chipsCountText: HTMLElement = document.getElementById( "chipsCount" )!;
        const playerHandValueText: HTMLElement = document.getElementById( "playerHandValue" )!;
        const dealerHandValueText: HTMLElement = document.getElementById( "dealerHandValue" )!;

        chipsCountText.innerHTML = chipsCount as string;
        playerHandValueText.innerText = playerHandValue as string;
        dealerHandValueText.innerText = dealerHandValue as string;
    }
    
    createCardElement( card : Card ): HTMLImageElement {
        const cardImage: HTMLImageElement = document.createElement( 'img' ) as HTMLImageElement;
        cardImage.src = `./images/deck/${card.rank}_of_${card.suit}.svg`;
        return cardImage;
    }
    
    displayCard( participant: Participant, cards: Card[] | Card ): void {
        const handElement: HTMLElement = document.getElementById( `${participant}HandContainer` )!;
        const cardList: Card[] = Array.isArray( cards ) ? cards : [ cards ];

        for( const card of cardList ) {
            handElement.appendChild( this.createCardElement( card ) );
        }
    }
    
    removeCards( participant: Participant ): void {
        const handElement: HTMLElement = document.getElementById( `${participant}HandContainer` )!;
        handElement?.replaceChildren();
    }
    
    displayMessage( text: string, color: string ): void {
        const message: HTMLParagraphElement = document.getElementById( "message" ) as HTMLParagraphElement;
        message.innerHTML = text;
        message.style.background = color;
        message.style.visibility = "visible";
    }
    
    messageHidden(): void {
        const message: HTMLParagraphElement = document.getElementById( "message" ) as HTMLParagraphElement;
        message.style.visibility = "hidden";
    }

    clear(): void {
        this.messageHidden();
        this.removeCards( "player" );
        this.removeCards( "dealer" );
        this.displayState( "-", "-", "-" );
    }

    setButtonStates( isRoundInProgress: boolean ): void {
        const startBtn: HTMLButtonElement = document.getElementById( "startBtn" ) as HTMLButtonElement;
        const hitBtn: HTMLButtonElement = document.getElementById( "hitBtn" ) as HTMLButtonElement;
        const standBtn: HTMLButtonElement = document.getElementById( "standBtn" ) as HTMLButtonElement;

        startBtn.disabled = isRoundInProgress;
        hitBtn.disabled = !isRoundInProgress;
        standBtn.disabled = !isRoundInProgress;
    }
}