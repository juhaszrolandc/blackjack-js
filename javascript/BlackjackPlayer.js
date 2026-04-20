import { Player } from './Player.js';
// A chace "no-store" azért kell, mert a böngésző a tesztelésnél nem frissült mindig megfelelően
const gameConfig = await fetch('../config/gameConfig.json', { cache: "no-store" }).then(res => res.json());
export class BlackjackPlayer extends Player {
    constructor(chipsCount = 0) {
        super(chipsCount);
    }
    handEvaluator() {
        let handValue = 0;
        let aceCount = 0;
        for (const card of this.hand) {
            handValue += card.value;
            if (card.rank === "ace") {
                aceCount++;
            }
        }
        while (handValue > gameConfig.maxValue && aceCount > 0) {
            handValue -= gameConfig.aceValue;
            handValue += gameConfig.reducedAceValue;
            aceCount--;
        }
        return handValue;
    }
    hasBlackjack() {
        return this.handValue === gameConfig.maxValue
            && this.hand.length === gameConfig.blackjackCardCount;
    }
}
//# sourceMappingURL=BlackjackPlayer.js.map