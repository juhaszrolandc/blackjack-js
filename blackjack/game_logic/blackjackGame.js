import { BlackjackPlayer } from './blackjackPlayer.js';
import { Deck } from '../../base/Deck.js';
import { deckConfig } from '../config/deckConfig.js';
const gameConfig = await fetch( '../config/gameConfig.json' ).then( res => res.json() );

export class Game {

    constructor(){
        this.player = new BlackjackPlayer( gameConfig.playerChips );
        this.dealer = new BlackjackPlayer( 0 );
        this.deck = new Deck( deckConfig );
        this.isPlayerWinTheRound = false;
        this.isDealerWinTheRound = false;
    }

    get lastPlayerCard(){
        return this.player.lastCard;
    }

    get lastDealerCard(){
        return this.dealer.lastCard;
    }

    get playerCard(){
        return this.player.hand;
    }

    get dealerCard(){
        return this.dealer.hand;
    }

    startRound(){
        this.initRound();
        this.player.takeBet( gameConfig.fixBet );
        this.player.addCard( this.deck.drawCard() );
        this.dealer.addCard( this.deck.drawCard() );
    }

    takeHit(){
        this.player.addCard( this.deck.drawCard() );
    }

    takeStand(){
        this.playDealerTurn();
        this.settleRound();
    }

    getState(){
        return { 
            "chipsCount": this.player.chips, 
            "playerHandValue": this.player.handValue, 
            "dealerHandValue": this.dealer.handValue,
            "isPlayerWin": this.isPlayerWinTheRound,
            "isDealerWin": this.isDealerWinTheRound
        };
    }

    /*
     Szabályok:
     - Minden kör friss paklival indul.
     */
    initRound(){
        this.deck.create( deckConfig );
        this.player.initRound();
        this.dealer.initRound();
        this.isPlayerWinTheRound = false;
        this.isDealerWinTheRound = false;
    }


    /*
      Szabályok:
      - Amikor a játékos Stand-ol, a bank addig húz új kártyákat, amíg 17-et vagy magasabbat ér el.
    */
    playDealerTurn(){
        while( this.deck.length > 0 && this.dealer.handValue < gameConfig.dealerStandValue ){
            this.dealer.addCard( this.deck.drawCard() );
        }

        return this.dealer.handValue;
    }

    /*
      Szabályok:
      - A kör végén az nyeri el a másik tétjét, aki közelebb van a 21-hez.
      - Ha a player 21 fölé megy, az osztó nyer, fordított esetben a playerhez.
      - Ha a player és az osztó is átlépi a 21-et, akkor is a ház nyer.
    */
    settleRound(){
        if( this.player.handValue > gameConfig.blackjack ){
            this.isPlayerWinTheRound = false;
            this.isDealerWinTheRound = true;

        } else if( this.dealer.handValue > gameConfig.blackjack || this.player.handValue > this.dealer.handValue ){
            this.isPlayerWinTheRound = true;
            this.isDealerWinTheRound = false;
            this.player.addChip( this.player.bet + 1 );

        } else if( this.player.handValue < this.dealer.handValue ){
            this.isPlayerWinTheRound = false;
            this.isDealerWinTheRound = true;

        } else {
            this.isPlayerWinTheRound = false;
            this.isDealerWinTheRound = false;
            this.player.addChip( this.player.bet );
        }
    }



}