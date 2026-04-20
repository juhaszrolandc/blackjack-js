import { Card } from './Card.js';
export class Deck {
    constructor(deckConfig) {
        this.cards = new Array();
        if (deckConfig) {
            this.create(deckConfig);
        }
    }
    get length() {
        return this.cards.length;
    }
    create(deckConfig) {
        this.cards = new Array();
        for (let suit of deckConfig.suits) {
            for (let rank in deckConfig.rankValues) {
                this.addCard(suit, rank, deckConfig.rankValues[rank]);
            }
        }
    }
    addCard(suit, rank, value) {
        this.cards.push(new Card(suit, rank, value));
    }
    drawCard() {
        if (this.cards.length === 0) {
            throw new Error("Üres pakli! Nincs egyetlen darab kártya sem a pakliban.");
        }
        const randomIndex = this.getRandomIndex(this.cards.length);
        const card = this.cards[randomIndex];
        this.cards.splice(randomIndex, 1);
        return card;
    }
    getRandomIndex(arrayLength) {
        const randomNum = Math.random();
        const randomIndex = Math.floor(randomNum * arrayLength);
        return randomIndex;
    }
}
//# sourceMappingURL=Deck.js.map