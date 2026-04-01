
export class Player {

    constructor( chipsCount = 0 ){
        this.chips = chipsCount;
        this.initForNewRound();
    }

    // Változók beállítása új körhöz.
    initForNewRound(){
        this.bet = 0;
        this.cards = new Array();
        this.handValue = 0;
        this.hit = false;
        this.stand = false;
    }

    // Lapot kérünk az adott körben.
    takeHit(){

        if( this.stand ){
            throw new Error("A játékos megállt (stand), nem kérhet lapot (hit)!");
        }

        if( this.bet === 0 ){
            throw new Error("Nincs tét rakva! A játékosnak tétet kell tennie, mielőtt lapot kér (hit)!");
        }

        this.hit = true;
    }

    // Megállunk az adott körben.
    takeStand(){

        if( this.hit ){
            throw new Error("A játékos lapot kért korábban (hit). Ki kell osztani neki a lapot, csak utána következhet stand!");
        }

        if( this.bet === 0 ){
            throw new Error("Nincs tét rakva! A játékosnak tétet kell tennie, mielőtt megállást kér (stand)!");
        }

        this.stand = true;
    }

    // Minden kör elején tétet teszünk.
    // Tétrakáskor a zsetonjainkból levonódik az összeg.
    takeBet( bet ){

        if( this.chips >= bet && this.bet === 0 ){
            this.chips -= bet;
            this.bet = bet;

        } else {
            throw new Error("Tétrakás sikertelen! Korábban tettünk tétet, vagy a playernek nincs elég zsetonja!")
        }
    }

    // Tét elvesztésének elkönyvelése.
    // Tétrakáskor a zsetonjainkból már levonódott az összeg.
    loseBet(){

        if( this.bet === 0 ){
            throw new Error("Nem könyvelhetünk el veszteséget anélkül, hogy tétet tettünk volna a játék elején!");
        }

        let amount = this.bet;
        this.bet = 0;

        return amount;
    }

    // Nyeremény elkönyvelése
    // Tétrakáskor a zsetonjainkból levonódott az összeg, azt visszakapjuk
    winChips( amount ){

        if( this.bet === 0 ){
            throw new Error("Nem könyvelhetünk el nyereményt anélkül, hogy tétet tettünk volna a játék elején!");
        }

        this.chips += amount + this.bet;
        this.bet = 0;
    }

    // Kártyát csak akkor kaphatunk az osztótól, ha kérünk (hit)
    addCard( card ){

        if( !this.hit ){
            throw new Error("A játékos nincs hit állapotban. Nem kaphat új lapot!");
        }

        this.handValue += card.value;
        this.cards.push( card );
        this.handValue > 21 ? this.changeAceValue() : "" ;
        this.hit = false;
    }

    /*
      Szabályok:
      - Az ász értéke 1 vagy 11: automatikusan vált értéket, úgy hogy ne menjen túl a játékos a 21-en
    */

    changeAceValue(){

        const aceCard = this.cards.find( card => card.rank === "A" && card.value === 11 );

        if( aceCard ){
            aceCard.value = 1;
            this.handValue -= 10;
        }

        if( this.handValue > 21 && aceCard ){
            this.changeAceValues();
        }
    }


}