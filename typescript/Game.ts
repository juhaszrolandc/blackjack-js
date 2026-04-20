import { BlackjackPlayer } from './BlackjackPlayer.js';
import { ViewController } from './ViewController.js';
import { Deck } from './Deck.js';

// A chace "no-store" azért kell, mert a böngésző a tesztelésnél nem frissült mindig megfelelően
const gameConfig = await fetch( '../config/gameConfig.json', { cache: "no-store" } ).then( res => res.json() );
const deckConfig = await fetch( '../config/deckConfig.json', { cache: "no-store" } ).then( res => res.json() );
enum Announcement { Bust, Blackjack, Win, Lose, Draw };

export class Game {

    private player: BlackjackPlayer;
    private dealer: BlackjackPlayer;
    private deck: Deck;
    private isRoundInProgress: boolean;
    private view: ViewController;

    constructor( view: ViewController ){
        this.player = new BlackjackPlayer( gameConfig.playerChips );
        this.dealer = new BlackjackPlayer( 0 );
        this.deck = new Deck( deckConfig );
        this.isRoundInProgress = false;
        this.view = view;
    }

    get isPlayerBust(): boolean {
        return this.player.handValue > gameConfig.maxValue;
    }

    private initRound(): void {
        this.deck.create( deckConfig );
        this.player.initRound();
        this.dealer.initRound();
        this.isRoundInProgress = true;
    }

    startRound(): void {
        if( this.isRoundInProgress ){
            this.view.displayMessage( "Már elindítottad a játékot, le kell játszanod egy kört!" , "orange" );
            return;
        }

        if( this.player.chips <= 0 ){
            this.view.displayMessage( "Elfogytak a zsetonok!", "red" );
            return;
        }

        this.initRound();

        // Szabály szerint a player tétet rak, és az osztó húz először lapot.
        this.player.placeBet( gameConfig.fixBet );
        this.dealer.addCard( this.deck.drawCard() );
        this.player.addCard( this.deck.drawCard() );

        // Letakarítsuk az előző round maradványait.
        this.view.messageHidden();
        this.view.removeCards( "player" );
        this.view.removeCards( "dealer" );

        this.view.setButtonStates( true, false, false );
        this.view.displayCard( "player", this.player.lastCard );
        this.view.displayCard( "dealer", this.dealer.lastCard );
        this.view.displayState( this.player.chips, this.player.handValue, this.dealer.handValue );
    }

    takeHit(): void {
        if( !this.isRoundInProgress ){
            this.view.displayMessage( "Új kört kell indítanod, kattints a Start Round gombra!" , "orange" );
            return;
        }

        this.player.addCard( this.deck.drawCard() );

        // Ha korábban kiírtunk valamit, azt letakarítjuk (biztosan nem releváns).
        this.view.messageHidden();
        this.view.displayCard( "player", this.player.lastCard );
        this.view.displayState( this.player.chips, this.player.handValue, this.dealer.handValue );

        // Biztosan veszített a player, a játéknak vége.
        if( this.isPlayerBust ){
            const announcement: Announcement = this.settleRound();
            this.displayAnnouncement( announcement );
            this.view.setButtonStates( false, true, true );
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
            this.view.displayMessage( "Új kört kell indítanod, kattints a Start Round gombra!" , "orange" );
            return;
        }

        // A dealernek eddig egy kártyája volt, itt 17-ig húzza a kártyákat.
        this.playDealerTurn();
        const announcement = this.settleRound();
        
        // A dealer összes kártyáját kirajzoljuk.
        this.view.removeCards( "dealer" );
        this.view.displayCard( "dealer", this.dealer.hand );

        this.view.setButtonStates( false, true, true );
        this.view.displayState( this.player.chips, this.player.handValue, this.dealer.handValue );
        this.displayAnnouncement( announcement );
    }

    private playDealerTurn(): number {
        // Amikor a játékos Stand-ol, a bank addig húz új kártyákat, amíg 17-et vagy magasabbat ér el.
        while( this.deck.length > 0 && this.dealer.handValue < gameConfig.dealerStandValue ){
            this.dealer.addCard( this.deck.drawCard() );
        }

        return this.dealer.handValue;
    }

    private settleRound(): Announcement {
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

    private displayAnnouncement( announcement : Announcement ): void {
        if( announcement === Announcement.Win ){
            this.view.displayMessage( "Gratulálok, nyertél!", "green" );

        } else if( announcement === Announcement.Blackjack ){
            this.view.displayMessage( "BLACKJACK! Nyertlél!", "green" )

        } else if ( announcement === Announcement.Lose ){
            this.view.displayMessage( "Sajnos vesztettél!", "red" );

        } else if ( announcement === Announcement.Bust ){
            this.view.displayMessage( "BUST! Vesztettél!", "red" );

        } else if ( announcement === Announcement.Draw ){
            this.view.displayMessage( "Döntetlen!", "orange" );
        }
    }

    displayInitialState(): void {
        this.view.setButtonStates( false, true, true );
        this.view.displayState( this.player.chips, this.player.handValue, this.dealer.handValue );
    }
}