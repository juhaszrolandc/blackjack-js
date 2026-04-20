import { ViewController } from './ViewController.js';
export declare class Game {
    private player;
    private dealer;
    private deck;
    private isRoundInProgress;
    private view;
    constructor(view: ViewController);
    get isPlayerBust(): boolean;
    private initRound;
    startRound(): void;
    takeHit(): void;
    takeStand(): void;
    private playDealerTurn;
    private settleRound;
    private displayAnnouncement;
    displayInitialState(): void;
}
//# sourceMappingURL=Game.d.ts.map