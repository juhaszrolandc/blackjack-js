import { Player } from '../../base/Player.js';
const gameConfig = await fetch( '../config/gameConfig.json' ).then( res => res.json() );


export class BlackjackPlayer extends Player {

    constructor( chipsCount = 0 ){
        super( chipsCount );
    }

    handEvaluator() {

        let newHandValue = 0;
        let acesCount = 0;

        for( const card of this.hand ) {
            newHandValue += card.value;
            if (card.rank === "ace") acesCount++;
        }

        while( newHandValue > gameConfig.blackjack && acesCount > 0 ) {
            newHandValue -= gameConfig.aceValue;
            newHandValue += gameConfig.reducedAceValue;
            acesCount--;
        }

        return newHandValue;
    }

    hasBlackjack(){
        return this.handValue === 21 && this.hand.length === 2;
    }
}