import { Player } from './Player.js';


export class Game {

    constructor(){
        this.player = new Player( 10 );
        this.dealer = new Player( 100000 ); // A bank játékosa
        this.deck = new Array();
        this.isPlayerWinTheRound = false;
        this.isDealerWinTheRound = false;
        this.generateDeck();
    }

    createCard( suit, rank, value ){
        const card = new Object();
        card.value = value;
        card.suit = suit;
        card.rank = rank;
        return card;
    }

    addCardToDeck( suit, rank, value ){
        const card = this.createCard( suit, rank, value );
        this.deck.push( card );
    }

    generateDeck(){

        // A biztonság kedvéért takarítjuk a tömböt, amit feltöltünk.
        this.deck = new Array();

        const suits = [ "Spades", "Hearts", "Diamonds", "Clubs" ];
        const ranksValues = {   "2" : 2,
                                "3" : 3,
                                "4" : 4,
                                "5" : 5,
                                "6" : 6,
                                "7" : 7,
                                "8" : 8,
                                "9" : 9,
                                "10" : 10,
                                "A" : 11,
                                "K" : 10,
                                "Q" : 10,
                                "J" : 10 };
        
        for( let suit of suits ){
            for( let rank in ranksValues ){
                this.addCardToDeck( suit, rank, ranksValues[rank] );
            }
        }
    }

    drawCard(){
        const randomIndex = this.getRandomIndex( this.deck.length );
        const card = this.deck[ randomIndex ];
        this.deck.splice(randomIndex, 1);
        return card;
    }

    getRandomIndex( arrayLength ){
        const randomNum = Math.random()
        const randomIndex = Math.floor(randomNum*arrayLength)
        return randomIndex
    }

    /*
      Szabályok:
      - Amikor a játékos Stand-ol, a bank addig húz új kártyákat, amíg 17-et vagy magasabbat ér el.
    */
    dealerDrawToSeventeen(){

        while( this.deck.length > 0 && this.dealer.handValue < 17 ){
            this.dealerDrawCard();
        }

        return this.dealer.handValue;
    }

    dealerDrawCard(){
        const card = this.drawCard();
        this.dealer.takeHit();
        this.dealer.addCard( card );
    }

    playerDrawCard(){
        const card = this.drawCard();
        this.player.takeHit();
        this.player.addCard( card );
    }

    /*
      Szabályok:
      - A kör végén az nyeri el a másik tétjét, aki közelebb van a 21-hez.
      - Ha a player 21 fölé megy, az osztó nyer, fordított esetben a playerhez.
      - Ha a player és az osztó is átlépi a 21-et, akkor is a ház nyer.
    */
    settleRound(){

        if( this.player.handValue > 21 ){
            this.isPlayerWinTheRound = false;
            this.isDealerWinTheRound = true;
            this.dealer.winChips( this.player.loseBet() );

        } else if( this.dealer.handValue > 21 || this.player.handValue > this.dealer.handValue ){
            this.isPlayerWinTheRound = true;
            this.isDealerWinTheRound = false;
            this.player.winChips( this.dealer.loseBet() );

        } else if( this.player.handValue < this.dealer.handValue ){
            this.isPlayerWinTheRound = false;
            this.isDealerWinTheRound = true;
            this.dealer.winChips( this.player.loseBet() );

        } else {
            this.isPlayerWinTheRound = false;
            this.isDealerWinTheRound = false;
            this.dealer.winChips( 0 );
            this.player.winChips( 0 );
        }
    }

    /*
     Szabályok:
     - Minden kör friss paklival indul.
     */
    initRound(){
        this.generateDeck();
        this.player.initForNewRound();
        this.dealer.initForNewRound();
        this.isPlayerWinTheRound = false;
        this.isDealerWinTheRound = false;
    }

    /*
      Szabályok:
      - Minden kör úgy kezdődik, hogy a játékosok tétet tesznek.
      - Minden játékos 1 zseton tétet tesz minden körben (fix bet).
    */
    everyoneTakesBet(){
        this.player.takeBet(1);
        this.dealer.takeBet(1);
    }

}