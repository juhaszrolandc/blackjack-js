import gameConfig from '../config/gameConfig.json';
function throwErrorIfNotNatural(number) {
    if (!Number.isInteger(number) || number < 0) {
        throw new Error("Csak nem negatív egész szám használható!");
    }
}
export class Player {
    chips;
    bet;
    handValue;
    hand;
    constructor(chipCount = 0) {
        throwErrorIfNotNatural(chipCount);
        this.chips = chipCount;
        this.bet = 0;
        this.handValue = 0;
        this.hand = new Array();
    }
    get lastCard() {
        if (this.hand.length === 0) {
            throw new Error("Egyetlen lap sincs a játékos kezében!");
        }
        return this.hand[this.hand.length - 1];
    }
    initRound() {
        this.bet = 0;
        this.handValue = 0;
        this.hand = new Array();
    }
    placeBet(bet) {
        throwErrorIfNotNatural(bet);
        if (this.chips < bet) {
            throw new Error(`A playernek ${this.chips} zsetonja van, nem lehet ${bet} tétet rakni.`);
        }
        this.chips -= bet;
        this.bet += bet;
        return this.bet;
    }
    addChip(chipCount) {
        throwErrorIfNotNatural(chipCount);
        this.chips += chipCount;
    }
    setChip(chipCount) {
        throwErrorIfNotNatural(chipCount);
        this.chips = chipCount;
    }
    addCard(card) {
        this.hand.push(card);
        this.handValue = this.handEvaluator();
    }
    handEvaluator() {
        let handValue = 0;
        let unreducedAceCount = 0;
        for (const card of this.hand) {
            handValue += card.value;
            if (card.rank === "ace") {
                unreducedAceCount++;
            }
        }
        while (handValue > gameConfig.maxValue && unreducedAceCount > 0) {
            handValue -= gameConfig.aceValue;
            handValue += gameConfig.reducedAceValue;
            unreducedAceCount--;
        }
        return handValue;
    }
    hasBlackjack() {
        return this.handValue === gameConfig.maxValue
            && this.hand.length === gameConfig.blackjackCardCount;
    }
}
