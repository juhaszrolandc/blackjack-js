import { expect } from 'chai';
import sinon from "sinon";
import mocha from "mocha";
import axios from 'axios';
import { game } from "../server.js";
import { response } from 'express';
import { Card } from '../classes_build/Card.js';

describe('Blackjack API', async () => {

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        validateStatus: undefined
    });

    describe('GET /new-game', () => {
        it('should restore the game state', async () => {
            const newGameState = {
                "isRoundInProgress": false,
                "playerChips": 10, 
                "playerHandValue": 0, 
                "dealerHandValue": 0,
                "dealerHand": [],
                "playerHand": [],
                "message": {text: "", color: ""}
            }

            const response = await instance.get('/new-game');
            const gameState = response.data;

            expect(response.status).to.equal(200);
            expect(gameState).to.deep.equal(newGameState); 
        });
    });
    
    describe('GET /new-round', () => {
        it('should start a new round', async () => {
            await instance.get('/new-game');
            const response = await instance.get('/new-round');
            const gameState = response.data;

            expect(response.status).to.equal(200);
            expect(gameState.isRoundInProgress).to.be.true;
            expect(gameState.dealerHand.length).to.equal(1);
            expect(gameState.playerHand.length).to.equal(1);
            expect(gameState.dealerHandValue).to.greaterThan(0);
            expect(gameState.playerHandValue).to.greaterThan(0);
            expect(gameState.playerChips).to.equal(9);
        });
    });

    describe('GET /hit', () => {
        it('should be Blackjack', async () => {
            const deckMock = sinon.mock(game.deck);
            deckMock.expects('drawCard')
            .atLeast(4)
            .onFirstCall().returns(new Card('hearts', 'ace', 11))
            .onSecondCall().returns(new Card('spades', 'ace', 11))
            .onThirdCall().returns(new Card('diamonds', 'ten', 10)) // player hit
            .returns(new Card('clubs', 'two', 2)); // dealer draw cards
            
            await instance.get('/new-game');
            await instance.get('/new-round');
            const response = await instance.get('/hit');
            const gameState = response.data;

            deckMock.verify();
            deckMock.restore();
            expect(response.status).to.equal(200);
            expect(gameState.playerHandValue).to.equal(21);
            expect(gameState.isRoundInProgress).to.be.false;
            expect(gameState.dealerHand.length).to.equal(4); // 11+2+2+2
            expect(gameState.playerHand.length).to.equal(2);
            expect(gameState.message.text).to.match(/blackjack/i);
        });

        it('should be Bust', async () => {
            const deckMock = sinon.mock(game.deck);
            deckMock.expects('drawCard')
            .atLeast(4)
            .returns(new Card('diamonds', 'ten', 10)) // player hit
            
            await instance.get('/new-game');
            await instance.get('/new-round');
            await instance.get('/hit');
            const response = await instance.get('/hit');
            const gameState = response.data;

            deckMock.verify();
            deckMock.restore();
            expect(response.status).to.equal(200);
            expect(gameState.playerHandValue).to.equal(30);
            expect(gameState.isRoundInProgress).to.be.false;
            expect(gameState.dealerHand.length).to.equal(1);
            expect(gameState.playerHand.length).to.equal(3);
            expect(gameState.message.text).to.match(/bust/i);
        });
    });

    describe('GET /stand', () => {
        it('should be settle the round', async () => {
            await instance.get('/new-game');
            await instance.get('/new-round');
            await instance.get('/hit');
            const response = await instance.get('/stand');
            const gameState = response.data;

            expect(response.status).to.be.equal(200);
            expect(gameState.message.text).not.to.be.equal("");
            expect(gameState.isRoundInProgress).to.be.false;
            expect(gameState.dealerHandValue).to.be.greaterThanOrEqual(17);
            expect(gameState.playerHand.length).to.equal(2);
        });
    });
});