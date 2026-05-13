import { View } from './ViewInterface.js';
type Participant = "player" | "dealer";
type Card = {
    rank: string;
    suit: string;
    value: number;
};
type GameState = {
    "isRoundInProgress": boolean;
    "playerChips": number;
    "playerHandValue": number;
    "dealerHandValue": number;
    "dealerHand": Card[];
    "playerHand": Card[];
    "message": {
        text: string;
        color: 'red' | 'green' | 'orange' | '';
    };
};
export declare class ViewController implements View {
    render(gameState: GameState): void;
    displayState(chipsCount: number | "-", playerHandValue: number | "-", dealerHandValue: number | "-"): void;
    createCardElement(card: Card): HTMLImageElement;
    displayCard(participant: Participant, cards: Card[] | Card): void;
    removeCards(participant: Participant): void;
    displayMessage(text: string, color: string): void;
    messageHidden(): void;
    clear(): void;
    setButtonStates(isRoundInProgress: boolean): void;
}
export {};
//# sourceMappingURL=ViewController.d.ts.map