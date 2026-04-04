export class GameController {

    constructor(game, view) {
        this.game = game;
        this.view = view;
    }

    start(){
        this.view.messageHidden();

        if( this.game.isRoundInProgress ){
            this.view.displayMessage( "Már elindítottad a játékot, le kell játszanod egy kört!" , "orange" );
            return;
        }

        this.view.removeCards( "player" );
        this.view.removeCards( "dealer" );

        try {
            this.game.startRound();
        } catch {
            this.view.displayMessage( "Játék indítása sikertelen! Elfogytak a zsetonok?", "red" );
        }

        this.view.displayCard( "player", this.game.lastPlayerCard );
        this.view.displayCard( "dealer", this.game.lastDealerCard );
        this.view.displayState( this.game.chipsCount, this.game.playerHandValue, this.game.dealerHandValue );
    }

    hit(){
        this.view.messageHidden();

        if( !this.game.isRoundInProgress ){
            this.view.displayMessage( "Új kört kell indítanod, kattints a Start Round gombra!" , "orange" );
            return;
        }

        this.game.takeHit();
        this.view.displayCard( "player", this.game.lastPlayerCard );
        this.view.displayState( this.game.chipsCount, this.game.playerHandValue, this.game.dealerHandValue );
    }

    stand(){
        this.view.messageHidden();

        if( !this.game.isRoundInProgress ){
            this.view.displayMessage( "Új kört kell indítanod, kattints a Start Round gombra!" , "orange" );
            return;
        }

        this.game.takeStand();
        this.view.removeCards( "dealer" );
        this.view.displayCard( "dealer", this.game.dealerHand );
        this.view.displayState( this.game.chipsCount, this.game.playerHandValue, this.game.dealerHandValue );
        this.roundAnnouncement( this.game.isPlayerWinTheRound, this.game.isDealerWinTheRound );
    }

    roundAnnouncement( isPlayerWinTheRound, isDealerWinTheRound ){
        if( isPlayerWinTheRound && !isDealerWinTheRound ){
            this.view.displayMessage( "Gratulálok, nyertél!", "Green" );

        } else if ( !isPlayerWinTheRound && isDealerWinTheRound ){
            this.view.displayMessage( "Sajnos vesztettél!", "Red" );

        } else {
            this.view.displayMessage( "Döntetlen!", "Orange" );
        }
    }
}

