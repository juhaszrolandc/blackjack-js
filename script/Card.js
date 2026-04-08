export class Card {

  constructor( suit, rank, value ) {
    if( typeof suit !== "string" || typeof rank !== "string" || typeof value !== "number" ) {
      throw new Error( "Nem megfelelő kártya paraméter! A suit és rank értékeknek stringnek, a value-nak pedig számnak kell lennie" );
    }

    this.suit = suit;
    this.rank = rank;
    this.value = value;
  }
  
}