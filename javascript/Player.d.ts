import { Card } from './Card.js';
export declare class Player {
    chips: number;
    bet: number;
    handValue: number;
    hand: Card[];
    constructor(chipCount?: number);
    get lastCard(): Card;
    initRound(): void;
    placeBet(bet: number): number;
    addChip(chipCount: number): void;
    addCard(card: Card): void;
    handEvaluator(): number;
}
//# sourceMappingURL=Player.d.ts.map