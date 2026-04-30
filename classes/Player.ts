import { Card } from './Card.js';
import gameConfig from '../config/gameConfig.json';

export class Player {
    public chips: number;
    public bet: number;
    public handValue: number;
    public hand: Card[];

    constructor( chipCount: number = 0 ){
        if( !Number.isInteger( chipCount ) || chipCount < 0 ){
            throw new Error( "A zsetonok száma kizárólag nem negatív egész szám lehet!" );
        }

        this.chips = chipCount;
        this.bet = 0;
        this.handValue = 0;
        this.hand = new Array();
    }

    get lastCard(): Card {
        if( this.hand.length === 0 ){
            throw new Error( "Egyetlen lap sincs a játékos kezében!" );
        }

        return this.hand[ this.hand.length -1 ]!;
    }

    initRound(): void {
        this.bet = 0;
        this.handValue = 0;
        this.hand = new Array();
    }

    placeBet( bet: number ): number {
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

    addChip( chipCount: number ): void {
        if( !Number.isInteger( chipCount ) || chipCount < 0 ){
            throw new Error( "A zsetonok száma kizárólag nem negatív egész szám lehet!" );
        }

        this.chips += chipCount;
    }

    addCard( card: Card ): void {
        this.hand.push( card );
        this.handValue = this.handEvaluator();
    }

    handEvaluator(): number {
        let handValue: number = 0;
        let unreducedAceCount: number = 0;

        for( const card of this.hand ) {
            handValue += card.value;
            if( card.rank === "ace" ){
                unreducedAceCount++;
            }
        }

        while( handValue > gameConfig.maxValue && unreducedAceCount > 0 ) {
            handValue -= gameConfig.aceValue;
            handValue += gameConfig.reducedAceValue;
            unreducedAceCount--;
        }

        return handValue;
    }

    hasBlackjack(): boolean {
        return this.handValue === gameConfig.maxValue 
               && this.hand.length === gameConfig.blackjackCardCount;
    }
}