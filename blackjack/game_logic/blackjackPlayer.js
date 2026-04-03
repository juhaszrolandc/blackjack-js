import { Player } from '../../base/Player.js';
const gameConfig = await fetch( '../config/gameConfig.json' ).then( res => res.json() );


export class BlackjackPlayer extends Player {

    constructor( chipsCount = 0 ){
        super( chipsCount );
    }

    handEvaluator(){
        let newHandValue = this.handValue + this.lastCard.value;
        let acesCount = this.hand.filter( card => card.rank === "ace" ).length;

        while( newHandValue > gameConfig.blackjack && acesCount > 0 ) {
            newHandValue -= gameConfig.aceValue;
            newHandValue += gameConfig.reducedAceValue;
            acesCount--;
        }

        return newHandValue;
    }
}