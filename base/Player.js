import { Card } from './Card.js';

export class Player {

    constructor( chipsCount = 0 ){
        if( !Number.isInteger( chipsCount ) || chipsCount < 0 ){
            throw new Error( "A zsetonok száma kizárólag nem negatív egész szám lehet!" );
        }

        this.chips = chipsCount;
        this.initRound();
    }

    get lastCard(){
        if( this.hand.length === 0 ){
            throw new Error("Egyetlen lap sincs a játékos kezében!");
        }

        return this.hand[ this.hand.length -1 ];
    }

    initRound(){
        this.bet = 0;
        this.handValue = 0;
        this.hand = new Array();
    }

    takeBet( bet ){
        if( !Number.isInteger( bet ) || bet < 0 ){
            throw new Error( "A tétnek nem negatív egész számnak kell lennie!" );
        }

        if( this.chips < bet ){
            throw new Error( `A playernek ${ this.chips } zsetonja van, nem lehet ${ bet } tétet rakni.` );
        }

        this.chips -= bet;
        this.bet += bet;
        return this.bet;
    }

    addChip( chipCount ){
        if( !Number.isInteger( chipCount ) || chipCount < 0 ){
            throw new Error( "A zsetonok száma kizárólag nem negatív egész szám lehet!" );
        }

        this.chips += chipCount;
    }

    addCard( card ){
        if( !(card instanceof Card) ){
            throw new Error( `Nem megfelelő típusú objektum: ${card.constructor.name}` );
        }
    
        this.hand.push( card );
        this.handValue = this.handEvaluator();
    }

    handEvaluator(){
        return this.handValue + this.lastCard.value;
    }

}