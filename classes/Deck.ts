import { Card } from './Card.js';

type deckConfigType = {
  rankValues: { [key: string]: number; };
  suits: string[];
};

export class Deck {
    private cards: Array<Card>;

    constructor( deckConfig: deckConfigType ){
        this.cards = new Array();

        if( deckConfig ){
            this.create( deckConfig );
        }
    }

    get length(): number {
        return this.cards.length;
    }

    create( deckConfig: deckConfigType ){
        this.cards = new Array();

        for( let suit of deckConfig.suits ){
            for( let rank in deckConfig.rankValues ){
                this.addCard( suit, rank, deckConfig.rankValues[ rank ]! );
            }
        }
    }

    private addCard( suit: string, rank: string, value: number ){
        this.cards.push( new Card( suit, rank, value ) );
    }

    drawCard(): Card {
        if( this.cards.length === 0 ){
            throw new Error( "Üres pakli! Nincs egyetlen darab kártya sem a pakliban." );
        }

        const randomIndex: number = this.getRandomIndex( this.cards.length );
        const card: Card = this.cards[ randomIndex ]!;
        this.cards.splice( randomIndex, 1 );
        return card;
    }

    private getRandomIndex( arrayLength: number ): number {
        const randomNum: number = Math.random();
        const randomIndex: number = Math.floor( randomNum*arrayLength );
        return randomIndex;
    }
}