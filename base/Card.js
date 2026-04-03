export class Card {

  constructor(suit, rank, value) {
    if ( !suit || !rank || typeof value !== "number" ) {
      throw new Error( "Nem megfelelő kártya paraméter" );
    }

    this.suit = suit;
    this.rank = rank;
    this.value = value;
  }
  
}