import { BlackjackPlayer } from './blackjackPlayer.js';
import { Deck } from '../../base/Deck.js';

const gameConfig = await fetch( '../config/gameConfig.json' ).then( res => res.json() );
const deckConfig = await fetch( '../config/deckConfig.json' ).then( res => res.json() );

export class Game {

    constructor(){
        this.player = new BlackjackPlayer( gameConfig.playerChips );
        this.dealer = new BlackjackPlayer( 0 );
        this.deck = new Deck( deckConfig );
        this.isRoundInProgress = false; // startRound-tól takeStand-ig tart egy kör.
    }

    get lastPlayerCard(){
        return this.player.lastCard;
    }

    get lastDealerCard(){
        return this.dealer.lastCard;
    }

    get playerHand(){
        return this.player.hand;
    }

    get dealerHand(){
        return this.dealer.hand;
    }

    get chipsCount(){
        return this.player.chips;
    }

    get playerHandValue(){
        return this.player.handValue;
    }

    get isPlayerBust(){
        return this.player.handValue > gameConfig.blackjack;
    }

    get dealerHandValue(){
        return this.dealer.handValue;
    }

    startRound(){
        this.deck.create( deckConfig );
        this.player.initRound();
        this.dealer.initRound();
        this.player.takeBet( gameConfig.fixBet );

        //  Mindenki egy kártyával kezd.
        this.player.addCard( this.deck.drawCard() );
        this.dealer.addCard( this.deck.drawCard() );
        this.isRoundInProgress = true;
    }

    takeHit(){
        this.player.addCard( this.deck.drawCard() );
    }

    takeStand(){
        this.playDealerTurn();
        this.isRoundInProgress = false;
    }


    playDealerTurn(){
        // Amikor a játékos Stand-ol, a bank addig húz új kártyákat, amíg 17-et vagy magasabbat ér el.
        while( this.deck.length > 0 && this.dealer.handValue < gameConfig.dealerStandValue ){
            this.dealer.addCard( this.deck.drawCard() );
        }

        return this.dealer.handValue;
    }


    settleRound(){
        // Ha a player 21 fölé megy, bust és veszít
        if( this.player.handValue > gameConfig.blackjack ){
            return "bust";
        
        // Ha a játékos az első két lapjának összértéke pontosan 21 (Blackjack), 
        // és az osztó nem Blackjack-et ért el, akkor a játékos a megtett tétet 3:1 arányban kapja meg.
        } else if( this.player.hasBlackjack() ){
            this.player.addChip( 3*this.player.bet );
            return "blackjack"

        // Ha a játékos lapjainak összértéke közelebb van a 21-hez, mint az osztóé
        // vagy ha az osztó lapjainak összértéke a játék során a 21-et meghaladja (Bust)
        // akkor a játékos a tétet 2:1 arányban kapja meg.
        } else if( this.dealer.handValue > gameConfig.blackjack || this.player.handValue > this.dealer.handValue ){
            this.player.addChip( 2*this.player.bet );
            return "win";
        
        // Ha az osztóé lapjainak összértéke közelebb van a 21-hez, a jétékos veszít
        } else if( this.player.handValue < this.dealer.handValue ){
            return "loose";

        } else {
            this.player.addChip( this.player.bet );
            return "draw";
        }
    }



}