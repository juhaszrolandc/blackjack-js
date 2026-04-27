import { Card } from './Card.js';

type Participant = "player" | "dealer";

export interface View {
    init( startRound: () => void, takeHit: () => void, takeStand: () => void ): void;
    
    displayState( chipsCount: number | "-", playerHandValue: number | "-", dealerHandValue: number | "-" ): void;
        
    createCardElement( card : Card ): HTMLImageElement;
        
    displayCard( participant: Participant, cards: Card[] | Card ): void;
        
    removeCards( participant: Participant ): void;
        
    displayMessage( text: string, color: string ): void;
        
    messageHidden(): void;

    setButtonStates( startButtonDisable: boolean, hitButtonDisable: boolean, standButtonDisable: boolean ): void;
} 