import { Card } from './Card.js';
type deckConfigType = {
    rankValues: {
        [key: string]: number;
    };
    suits: string[];
};
export declare class Deck {
    private cards;
    constructor(deckConfig: deckConfigType);
    get length(): number;
    create(deckConfig: deckConfigType): void;
    private addCard;
    drawCard(): Card;
    private getRandomIndex;
}
export {};
//# sourceMappingURL=Deck.d.ts.map