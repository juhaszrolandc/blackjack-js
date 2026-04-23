import { Card } from './Card.js';
import { Game } from './Game.js';

type Participant = "player" | "dealer";

export class ViewController {
    init( startRound: () => void, takeHit: () => void, takeStand: () => void ): void {
        const startBtn: HTMLButtonElement = document.getElementById( "startBtn" ) as HTMLButtonElement;
        const hitBtn: HTMLButtonElement = document.getElementById( "hitBtn" ) as HTMLButtonElement;
        const standBtn: HTMLButtonElement = document.getElementById( "standBtn" ) as HTMLButtonElement;

        startBtn.addEventListener( "click", () => startRound() );
        hitBtn.addEventListener( "click", () => takeHit() );
        standBtn.addEventListener( "click", () => takeStand() );
    }

    displayState( chipsCount: number | "-", playerHandValue: number | "-", dealerHandValue: number | "-" ): void {
        const chipsCountText: HTMLElement = document.getElementById( "chipsCount" )!;
        const playerHandValueText: HTMLElement = document.getElementById( "playerHandValue" )!;
        const dealerHandValueText: HTMLElement = document.getElementById( "dealerHandValue" )!;

        chipsCountText.innerHTML = chipsCount as string;
        playerHandValueText.innerText = playerHandValue as string;
        dealerHandValueText.innerText = dealerHandValue as string;
    }
    
    createCardElement( card : Card ): HTMLImageElement{
        const cardImage: HTMLImageElement = document.createElement( 'img' ) as HTMLImageElement;

        cardImage.src = `../assets/images/deck/${card.rank}_of_${card.suit}.svg`;
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

    setButtonStates( startButtonDisable: boolean = true, hitButtonDisable: boolean = false, standButtonDisable: boolean = false ): void{
        const startBtn: HTMLButtonElement = document.getElementById( "startBtn" ) as HTMLButtonElement;
        const hitBtn: HTMLButtonElement = document.getElementById( "hitBtn" ) as HTMLButtonElement;
        const standBtn: HTMLButtonElement = document.getElementById( "standBtn" ) as HTMLButtonElement;

        startBtn.disabled = startButtonDisable;
        hitBtn.disabled = hitButtonDisable;
        standBtn.disabled = standButtonDisable;
    }
}