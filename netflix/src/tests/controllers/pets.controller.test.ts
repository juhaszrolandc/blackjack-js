import { expect } from 'chai';
import axios from 'axios';
import '../../app';
import { rewritePetData } from '../../api/controllers/pets.controller';

type Pet = {
  id: number;
  name: string;
  type: string;
  tags: string[];
}

describe('Pets Controller', () => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000/v1',
    validateStatus: undefined
  });

  beforeEach(() => {
    rewritePetData([]);
  });

  describe('POST /pets', () => {
    it('should create a new pet and return 200 with the created object', async () => {
      const newAnimal = { name: 'Fluffy', type: 'cat', tags: ['cute'] };

      const response = await instance.post('/pets', newAnimal);

      expect(response.status).to.equal(200);
      expect(response.data.id).to.not.be.undefined;
      expect(response.data.name).to.equal(newAnimal.name);
      expect(response.data.type).to.equal(newAnimal.type);
      expect(response.data.tags).to.deep.equal(newAnimal.tags);
    });
  });

  describe('GET /pets/{id}', () => {
    it('should return status 404 if the pet does not exist', async () => {
      const response = await instance.get('/pets/999');
      
      expect(response.status).to.equal(404);
      expect(response.data.message).to.equal('not found');
    });

    it('should return 200 and the correct pet after creating it', async () => {
      const newAnimal = { name: 'Sparky', type: 'dog', tags: ['sweet'] };
      const postResponse = await instance.post('/pets', newAnimal);
      const createdId = postResponse.data.id;

      const getResponse = await instance.get(`/pets/${createdId}`);

      expect(getResponse.status).to.equal(200);
      expect(getResponse.data).to.deep.equal(postResponse.data);
    });
  });

  describe('DELETE /pets/{id}', () => {
    it('should return status 204 when successfully deleting an existing pet', async () => {
      const postResponse = await instance.post('/pets', { name: 'Buzz', type: 'cat', tags: [] });
      const createdId = postResponse.data.id;

      const deleteResponse = await instance.delete(`/pets/${createdId}`);
      expect(deleteResponse.status).to.equal(204);

      const getResponse = await instance.get(`/pets/${createdId}`);
      expect(getResponse.status).to.equal(404);
    });

    it('should return 204 even if the pet to delete does not exist', async () => {
      const response = await instance.delete('/pets/999');
      expect(response.status).to.equal(204);
    });
  });

  describe('GET /pets', () => {
    it('should return limited number of animals filtered by type', async () => {
      await instance.post('/pets', { name: 'dog1', type: 'dog', tags: [] });
      await instance.post('/pets', { name: 'dog2', type: 'dog', tags: [] });
      await instance.post('/pets', { name: 'cat1', type: 'cat', tags: [] });

      const type = 'dog';
      const limit = 1;
      const response = await instance.get(`/pets?type=${type}&limit=${limit}`);

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.equal(limit);
      
      const allDogs = response.data.every((pet: Pet) => pet.type === 'dog');
      expect(allDogs).to.be.true;
    });

    it('should return animals filtered by tags', async () => {
      await instance.post('/pets', { name: 'dog1', type: 'dog', tags: ['sweet'] });
      await instance.post('/pets', { name: 'dog2', type: 'dog', tags: ['cute', 'sweet'] });
      await instance.post('/pets', { name: 'dog3', type: 'dog', tags: ['cute'] });

      const type = 'dog';
      const limit = 10;
      const tags = ['sweet'];
      const response = await instance.get(`/pets?type=${type}&limit=${limit}&tags=${tags.join(',')}`);

      expect(response.status).to.equal(200);
      
      const allHaveSweetTag = response.data.every((pet: Pet) => pet.tags.includes('sweet'));
      expect(allHaveSweetTag).to.be.true;
    });
  });

});