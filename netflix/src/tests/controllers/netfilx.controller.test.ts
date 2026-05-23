import { expect } from 'chai';
import axios from 'axios';
import '../../app';
import { UUID } from 'node:crypto';

describe('Netfilx controller', function () {
  const instance = axios.create({
    baseURL: 'http://localhost:3000/v1',
    validateStatus: undefined
  });

  let sessionId: UUID | null = null;

  describe('POST /user', function () {
    it('should be available', async () => {
      const response = await instance.post('/user', {
        "username": "Roland",
        "password": "123"
      });
      expect(response.status).to.equal(201);
      expect(response.data).to.deep.equal({
        "message": "Account has been successfully created"
      });
    });
  });

  describe('POST /user/login', function () {
    it('should be available', async () => {
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
  });
  
  describe('POST /user/logout', function () {
    it('should be available', async () => {
      const config = {
        "headers": {
          "X-Session-ID": sessionId,
        }
      };

      const response = await instance.post('/user/logout', {}, config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        "message": "Logout successfully"
      });
    });
  });

  describe('GET /queue', function () {
    it('should be available', async () => {
      const config = {
        "headers": {
          "X-Session-ID": "123e4567-e89b-12d3-a456-426614174000"
        }
      };
      const response = await instance.get('/queue?order=false', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal([
        {
          "title": "Transformers",
          "description": "Transformers (2007) is a high-octane science fiction action film.",
          "directed-by": "Michael Bay",
          "actors": ["Shia LaBeouf", "Megan Fox"],
          "categories": ["sci-fi", "action"],
          "type": "Movie",
          "id": 3
        }
      ]);
    });
  });

  describe('GET /movies', function () {
    it('should be available', async () => {
      const config = {
        "headers": {
          "X-Session-ID": "123e4567-e89b-12d3-a456-426614174000",
      }};
      const response = await instance.get('/movies?id=3', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie",
        "id": 3
      });
    });
  });

  describe('POST /movies', function () {
    it('should be available', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": "123e4567-e89b-12d3-a456-426614174000",
        }
      };
      const movie = {
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie"
      };
      const response = await instance.post('/movies', movie, config);
      expect(response.status).to.equal(201);
      expect(response.data).to.deep.equal({
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie",
        "id": 3
      });
    });
  });

  describe('DELETE /movies', function () {
    it('should be available', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": "123e4567-e89b-12d3-a456-426614174000",
        }
      };
      const response = await instance.delete('/movies?id=3', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        "message": "You deleted the movie successfully."
      });
    });
  });

  describe('PATCH /movies', function () {
    it('should be available', async () => {
      const config = {
        "headers": {
          "X-Admin-API-key": "123e4567-e89b-12d3-a456-426614174000",
        }
      };
      const movie = {
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie"
      };
      const response = await instance.patch('/movies?id=3', movie, config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie",
        "id": 3
      });
    });
  });

  describe('GET /movies/{movieId}/rent', function () {
    it('should be available', async () => {
      const config = {
        "headers": {
          "X-Session-ID": "123e4567-e89b-12d3-a456-426614174000"
        }
      };
      const response = await instance.get('/movies/3/rent', config);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        "message": "You rented the movie successfully."
      });
    });
  });

});
