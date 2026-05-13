import { expect } from 'chai';
import sinon from "sinon";
import mocha from "mocha";
import axios from 'axios';
import { game } from "../server";

describe('GET /new-game', async () => {

  const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    validateStatus: undefined
  });

  it('should restore the player', async () => {
    const response = await instance.get('/new-game');
    const playerMock = sinon.mock(game.player);

    playerMock.expects('initRound').calledOnce;
  });

})