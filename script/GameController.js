export class GameController {

    constructor(game, view) {
        this.game = game;
        this.view = view;
    }

    start(){
        if( this.game.isRoundInProgress ){
            this.view.displayMessage( "Már elindítottad a játékot, le kell játszanod egy kört!" , "orange" );
            return;
        }

        // Letakarítsuk az előző round maradványait.
        this.view.messageHidden();
        this.view.removeCards( "player" );
        this.view.removeCards( "dealer" );
        
       try {
            this.game.startRound();
       } catch {
           this.view.displayMessage( "Játék indítása sikertelen! Elfogytak a zsetonok?", "red" );
       }

        // A round elején a dealer és a player is kap egy-egy kártyát.
        this.view.displayCard( "player", this.game.lastPlayerCard );
        this.view.displayCard( "dealer", this.game.lastDealerCard );
        this.view.displayState( this.game.chipsCount, this.game.playerHandValue, this.game.dealerHandValue );
    }

    hit(){
        if( !this.game.isRoundInProgress ){
            this.view.displayMessage( "Új kört kell indítanod, kattints a Start Round gombra!" , "orange" );
            return;
        }

        // Ha korábban kiírtunk valamit, azt letakarítjuk (biztosan nem releváns).
        this.view.messageHidden();

        // A player kap egy új kártyát, ha még nem lépte át a 21-et.
        this.game.takeHit();
        this.view.displayCard( "player", this.game.lastPlayerCard );
        this.view.displayState( this.game.chipsCount, this.game.playerHandValue, this.game.dealerHandValue );

        if( this.game.isPlayerBust ){
            this.stand();
        }
    }

    stand(){
        if( !this.game.isRoundInProgress ){
            this.view.displayMessage( "Új kört kell indítanod, kattints a Start Round gombra!" , "orange" );
            return;
        }

        // A dealernek eddig egy kártyája volt, itt 17-ig húzza a kártyákat.
        this.game.takeStand();

        // Itt a játékosnak kiosztásra kerül a nyeresék / levonásra a veszteség.
        const announcement = this.game.settleRound();

        // A dealer összes kártyáját kirajzoljuk.
        this.view.removeCards( "dealer" );
        this.view.displayCard( "dealer", this.game.dealerHand );
        
        this.view.displayState( this.game.chipsCount, this.game.playerHandValue, this.game.dealerHandValue );
        this.displayAnnouncement( announcement );
    }

    displayAnnouncement( announcement ){
        if( announcement === "win" ){
            this.view.displayMessage( "Gratulálok, nyertél!", "green" );

        } else if( announcement === "blackjack" ){
            this.view.displayMessage( "BLACKJACK! Nyertlél!", "green" )

        } else if ( announcement === "lose" ){
            this.view.displayMessage( "Sajnos vesztettél!", "red" );

        } else if ( announcement === "bust" ){
            this.view.displayMessage( "BUST! Vesztettél!", "red" );

        } else {
            this.view.displayMessage( "Döntetlen!", "orange" );
        }
    }
}

