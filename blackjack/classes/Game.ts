import { Player } from './Player.js';
import { Card } from './Card.js';
import { Deck } from './Deck.js';
import gameConfig from '../config/gameConfig.json';
import deckConfig from '../config/deckConfig.json';

enum Announcement { Bust, Blackjack, Win, Lose, Draw };

type GameState = { "isRoundInProgress":boolean,
                   "playerChips":number, 
                   "playerHandValue":number, 
                   "dealerHandValue":number, 
                   "dealerHand":Card[], 
                   "playerHand":Card[], 
                   "message":{ text: string, color: 'red' | 'green' | 'orange' | '' } }

export class Game {
    public player: Player;
    public dealer: Player;
    public deck: Deck;
    public isRoundInProgress: boolean;
    public message: { text: string, color: 'red' | 'green' | 'orange' | '' };

    constructor(){
        this.player = new Player( gameConfig.playerChips );
        this.dealer = new Player( 0 );
        this.deck = new Deck( deckConfig );
        this.isRoundInProgress = false;
        this.message = {text: "", color: ''};
    }

    get isPlayerBust(): boolean {
        return this.player.handValue > gameConfig.maxValue;
    }

    get state(): GameState {
        return {
            "isRoundInProgress": this.isRoundInProgress,
            "playerChips": this.player.chips, 
            "playerHandValue": this.player.handValue, 
            "dealerHandValue": this.dealer.handValue,
            "dealerHand": this.dealer.hand,
            "playerHand": this.player.hand,
            "message": this.message
        }
    }

    public initRound(): void {
        this.deck.create( deckConfig );
        this.player.initRound();
        this.dealer.initRound();
        this.isRoundInProgress = true;
        this.message = {text: "", color: ''};
    }

    newGame(): void {
        this.player.initRound();
        this.dealer.initRound();
        this.player.setChip( gameConfig.playerChips );
        this.isRoundInProgress = false;
        this.message = {text: "", color: ''};
    }

    startRound(): void {
        if( this.isRoundInProgress ){
            this.message = { text: "Már elindítottad a játékot, le kell játszanod a kört!", color: "orange" };
            return;
        }

        if( this.player.chips <= 0 ){
            this.message = { text: "Elfogytak a zsetonok!", color: "red" };
            return;
        }

        this.initRound();
        this.message = { text: "", color: '' };

        // Szabály szerint a player tétet rak, és az osztó húz először lapot.
        this.player.placeBet( gameConfig.fixBet );
        this.dealer.addCard( this.deck.drawCard() );
        this.player.addCard( this.deck.drawCard() );
    }

    takeHit(): void {
        if( !this.isRoundInProgress ){
            this.message = { text: "Új kört kell indítanod, kattints a Start Round gombra!", color: "orange" };
            return;
        }


        this.message = { text: "", color: '' };
        this.player.addCard( this.deck.drawCard() );

        // Biztosan veszített a player, a játéknak vége.
        if( this.isPlayerBust ){
            const announcement: Announcement = this.settleRound();
            this.setAnnouncementMessage( announcement );
            return;
        }

        // Ha a player elérhe a 21-et, felesleges tovább folytatni a kört.
        if( this.player.handValue === gameConfig.maxValue ){
            this.takeStand();
            return;
        }
    }

    takeStand(): void {
        if( !this.isRoundInProgress ){
            this.message = { text: "Új kört kell indítanod, kattints a Start Round gombra!", color: "orange" };
            return;
        }

        // A dealernek eddig egy kártyája volt, itt 17-ig húzza a kártyákat.
        this.playDealerTurn();
        const announcement = this.settleRound();
        this.setAnnouncementMessage( announcement );
    }

    public playDealerTurn(): number {
        // Amikor a játékos Stand-ol, a bank addig húz új kártyákat, amíg 17-et vagy magasabbat ér el.
        while( this.deck.length > 0 && this.dealer.handValue < gameConfig.dealerStandValue ){
            this.dealer.addCard( this.deck.drawCard() );
        }

        return this.dealer.handValue;
    }

    public settleRound(): Announcement {
        this.isRoundInProgress = false;

        // Ha a player 21 fölé megy, bust és veszít
        if( this.isPlayerBust ){
            return Announcement.Bust;
        
        /* Ha a játékos az első két lapjának összértéke pontosan 21 (Blackjack), 
           és az osztó nem Blackjack-et ért el, akkor a játékos a megtett tétet 3:1 arányban kapja meg.*/
        } else if( this.player.hasBlackjack() && !this.dealer.hasBlackjack() ){
            this.player.addChip( 3*this.player.bet );
            return Announcement.Blackjack;

        /* Ha a játékos lapjainak összértéke közelebb van a 21-hez, mint az osztóé
           vagy ha az osztó lapjainak összértéke a játék során a 21-et meghaladja (Bust)
           akkor a játékos a tétet 2:1 arányban kapja meg. */
        } else if( this.dealer.handValue > gameConfig.maxValue || this.player.handValue > this.dealer.handValue ){
            this.player.addChip( 2*this.player.bet );
            return Announcement.Win;
        
        // Ha az osztó lapjainak összértéke közelebb van a 21-hez, a játékos veszít
        } else if( this.player.handValue < this.dealer.handValue ){
            return Announcement.Lose;

        } else {
            this.player.addChip( this.player.bet );
            return Announcement.Draw;
        }
    }

    public setAnnouncementMessage( announcement : Announcement ): void {
        if( announcement === Announcement.Win ){
            this.message = { text: "Gratulálok, nyertél!", color: "green" };

        } else if( announcement === Announcement.Blackjack ){
            this.message = { text: "BLACKJACK! Nyertlél!", color: "green" };

        } else if ( announcement === Announcement.Lose ){
            this.message = { text: "Sajnos vesztettél!", color: "red" };

        } else if ( announcement === Announcement.Bust ){
            this.message = { text: "BUST! Vesztettél!", color: "red" };

        } else if ( announcement === Announcement.Draw ){
            this.message = { text: "Döntetlen!", color: "orange" };
        }
    }
}