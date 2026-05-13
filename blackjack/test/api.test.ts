import { expect } from 'chai';
import sinon from "sinon";
import mocha from "mocha";
import axios from 'axios';
import { game } from "../server.js";

describe('GET /new-game', async () => {

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        validateStatus: undefined
    });

    it('should call the player init method', async () => {
        const playerMock = sinon.mock(game.player);
        playerMock.expects('initRound').once();

        await instance.get('/new-game');

        playerMock.verify();
        playerMock.restore();
    });

    it('should call the dealer init method', async () => {
        const dealerMock = sinon.mock(game.dealer);
        dealerMock.expects('initRound').once();

        await instance.get('/new-game');

        dealerMock.verify();
        dealerMock.restore();
    });

    it('should have 52 cards in the deck', async () => {
        await instance.get('/new-game');

        expect(game.deck.length).to.equal(52); 
    });

    it('should have the default state', async () => {
        await instance.get('/new-game');
        const newGameState = {
            "isRoundInProgress": false,
            "playerChips": 10, 
            "playerHandValue": 0, 
            "dealerHandValue": 0,
            "dealerHand": [],
            "playerHand": [],
            "message": {text: "", color: ""}
        }

        expect(game.state).to.deep.equal(newGameState); 
    });

})