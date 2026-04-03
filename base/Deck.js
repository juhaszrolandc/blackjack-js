import { Card } from './Card.js';

export class Deck {

    constructor( deckConfig ){
        this.cards = new Array();
        this.create( deckConfig );
    }

    get length() {
        return this.cards.length;
    }

    create( deckConfig ){
        this.cards = new Array();
        const { ranksValues, suits } = deckConfig;

        for( let suit of suits ){
            for( let rank in ranksValues ){
                this.addCard( suit, rank, ranksValues[rank] );
            }
        }
    }

    addCard( suit, rank, value ){
        this.cards.push( new Card( suit, rank, value ) );
    }

    drawCard(){

        if( this.cards.length === 0 ){
            throw new Error("Üres pakli: Nincs egyetlen darab kártya sem a pakliban.");
        }

        const randomIndex = this.getRandomIndex( this.cards.length );
        const card = this.cards[ randomIndex ];
        this.cards.splice( randomIndex, 1 );
        return card;
    }

    getRandomIndex( arrayLength ){
        const randomNum = Math.random()
        const randomIndex = Math.floor( randomNum*arrayLength )
        return randomIndex
    }
    
}