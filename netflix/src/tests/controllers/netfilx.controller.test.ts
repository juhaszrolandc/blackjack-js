import { expect } from 'chai';
import axios from 'axios';
import '../../app';
import { UUID } from 'node:crypto';
import { Moveable } from 'puppeteer';
import { MovieWithoutId } from '../../api/services/movie.service';


const instance = axios.create({
  baseURL: 'http://localhost:3000/v1',
  validateStatus: undefined
});

let sessionId: UUID | null = null;
const adminKey: UUID = "123e4567-e89b-12d3-a456-426614174000";
const invalidUUID: UUID = "49e3af75-22f0-4015-a96f-35d40b84a51d";

const transformersMovie: MovieWithoutId = {
      "title": "Transformers",
      "description": "Transformers (2007) is a high-octane science fiction action film.",
      "directedBy": "Michael Bay",
      "actors": ["Shia LaBeouf", "Megan Fox"],
      "categories": ["sci-fi", "action"],
      "type": "Movie"
}

const TheFastAndTheFurious: MovieWithoutId = {
      "title": "The Fast and the Furious",
      "description": "It is an action crime film that follows Brian O'Conner, an undercover LAPD officer",
      "directedBy": "Rob Cohen",
      "actors": [],
      "categories": ["crime", "action"],
      "type": "Movie"
}

const Gru: MovieWithoutId = {
      "title": "GRU",
      "description": "The story follows Gru, a longtime supervillain who adopts three orphan girls to use as pawns in a villainous scheme but reluctantly develops an emotional ...",
      "directedBy": "Pierre Coffin",
      "actors": [],
      "categories": ["animation"],
      "type": "Movie"
}

describe('Netfilx controller', function () {
  describe('POST /user', function () {
    it('should create a new user', async () => {
      const response = await instance.post('/user', {
        "username": "Roland",
        "password": "123"
      });
      expect(response.status).to.equal(201);
      expect(response.data).to.deep.equal({
        "message": "Account has been successfully created"
      });
    });

    it('should return status 409: username already exists', async () => {
      const response = await instance.post('/user', {
        "username": "Roland",
        "password": "333"
      });
      expect(response.status).to.equal(409);
      expect(response.data).to.deep.equal({
        "message": "Username already exists! Please choose a different username."
      });
    });
  });

  describe('POST /user/login', function () {
    it('should login successfully', async () => {
      const body = {
        "username": "Roland",
        "password": "123"
      }
      const response = await instance.post('/user/login', body);
      sessionId = response.data.sessionId;

      expect(response.status).to.equal(200);
      expect(response.data.sessionId).is.not.null;
      expect(response.data.sessionId).is.not.undefined;
    });

    it('should return status 400: Invalid username or password, please double-check your login details and try again.', async () => {
      const body = {
        "username": "Roland",
        "password": "wrong pass"
      }

      const response = await instance.post('/user/login', body);
      expect(response.status).to.equal(400);
      expect(response.data).to.be.deep.equal({
          "message": "Invalid username or password, please double-check your login details and try again."
      });
    });
  });

  describe('POST /movies', function () {
    it('should create new movies', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": adminKey,
        }
      };

      const transformersResponse = await instance.post('/movies', transformersMovie, config);
      const gruResponse = await instance.post('/movies', Gru, config);

      expect(transformersResponse.status).to.equal(201);
      expect(gruResponse.status).to.equal(201);

      expect(transformersResponse.data).to.deep.equal({
        ...transformersMovie,
        "id": 0
      });

      expect(gruResponse.data).to.deep.equal({
        ...Gru,
        "id": 1
      });
    });

    it('should return 409 error, a movie with this title already exists!', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": adminKey,
        }
      };
      const response = await instance.post('/movies', transformersMovie, config);
      expect(response.status).to.equal(409);
      expect(response.data).to.deep.equal({
        "message":"A movie with this title already exists!"
      });
    });

    it('should return status 400: Invalid admin key!', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": invalidUUID,
        }
      };
      const response = await instance.post('/movies', transformersMovie, config);
      expect(response.status).to.equal(400);
      expect(response.data).to.deep.equal({
        "message":"Invalid admin key!"
      });
    });
  });

  describe('PATCH /movies', function () {
    it('should update successfully', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": adminKey,
        }
      };
      
      const response = await instance.patch('/movies?id=0', TheFastAndTheFurious, config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({ 
        ...TheFastAndTheFurious, 
        "id": 0 
      });
    });

    it('should return status 404, the movie with this ID does not exist!', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": adminKey,
        }
      };
      
      const response = await instance.patch('/movies?id=999', TheFastAndTheFurious, config);
      expect(response.status).to.equal(404);
      expect(response.data).to.deep.equal({ 
        "message": "The movie with this ID does not exist!"
      });
    });

    it('should return status 400: Invalid admin key!', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": invalidUUID,
        }
      };
      const response = await instance.patch('/movies?id=999', TheFastAndTheFurious, config);
      expect(response.status).to.equal(400);
      expect(response.data).to.deep.equal({
        "message":"Invalid admin key!"
      });
    });
  });

  describe('GET /movies', function () {
    it('should return the movie by id', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId,
      }};
      const response = await instance.get('/movies?id=0', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        ...TheFastAndTheFurious,
        "id": 0
      });
    });

    it('should return the movie by title', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId,
      }};
      const response = await instance.get('/movies?title=Gru', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        ...Gru,
        "id": 1
      });
    });

    it('should return status 400: Invalid session ID, please login!', async () => {
      const config = {
        "headers": {
          "X-Session-ID": invalidUUID,
        }
      };
      const responseByTitle = await instance.get('/movies?title=Gru', config);
      const responseById = await instance.get('/movies?id=1', config);
      expect(responseByTitle.status).to.equal(400);
      expect(responseByTitle.data).to.deep.equal({
        "message":"Invalid session ID, please login!"
      });
      expect(responseById.status).to.equal(400);
      expect(responseById.data).to.deep.equal({
        "message":"Invalid session ID, please login!"
      });
    });
  });

  describe('GET /movies/{movieId}/buy', function () {
    it('should buy the movie successfully', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId
        }
      };
      
      const response1 = await instance.get('/movies/1/buy', config);
      const response0 = await instance.get('/movies/0/buy', config);
      expect(response0.status).to.equal(200);
      expect(response1.status).to.equal(200);
      expect(response0.data).to.deep.equal({
        "message": "You buy the movie successfully."
      });
      expect(response1.data).to.deep.equal({
        "message": "You buy the movie successfully."
      });
    });

    it('should return status 404: No movies found with this id.', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId
        }
      };
      
      const response = await instance.get('/movies/9999/buy', config);
      expect(response.status).to.be.equal(404);
      expect(response.data).to.deep.equal({
        "message": "No movies found with this id."
      });
    });

    it('should return status 400: Invalid session ID, please login!', async () => {
      const config = {
        "headers": {
          "X-Session-ID": invalidUUID,
        }
      };
      const response = await instance.get('/movies/1/buy', config);
      expect(response.status).to.equal(400);
      expect(response.data).to.deep.equal({
        "message":"Invalid session ID, please login!"
      });
    });
  });
 
  describe('GET /queue', function () {
    it('should return the user queue without order', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId
        }
      };
      const response = await instance.get('/queue?order=false', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal([
      { ...Gru, "id": 1 }, 
      { ...TheFastAndTheFurious, "id": 0 }]);
    });

    it('should return the user queue with order', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId
        }
      };
      const response = await instance.get('/queue?order=true', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal([
      { ...TheFastAndTheFurious, "id": 0 },
      { ...Gru, "id": 1 } ]);
    });

    it('should return status 400: Invalid session ID, please login!', async () => {
      const config = {
        "headers": {
          "X-Session-ID": invalidUUID,
        }
      };
      const response = await instance.get('/queue?order=true', config);
      expect(response.status).to.equal(400);
      expect(response.data).to.deep.equal({
        "message":"Invalid session ID, please login!"
      });
    });
  });

  describe('DELETE /movies', function () {
    it('should be delete successfully', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": adminKey,
        }
      };
      
      const response = await instance.delete('/movies?id=0', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        "message": "You deleted the movie successfully."
      });
    });

    it('should return status 400: Invalid admin key!', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": invalidUUID,
        }
      };

      const response = await instance.delete('/movies?id=0', config);
      expect(response.status).to.equal(400);
      expect(response.data).to.deep.equal({
        "message":"Invalid admin key!"
      });
    });
  });

  describe('POST /user/logout', function () {
    it('should be logout successfully', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId,
        }
      };

      const response = await instance.post('/user/logout', {}, config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        "message": "Logout successfully!"
      });
    });
  });

});
