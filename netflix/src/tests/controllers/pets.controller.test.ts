import { expect } from 'chai';
import axios from 'axios';
import '../../app';

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

  describe('POST /pets', () => {
    it('should create a new pet and return 200 with the created object', async () => {
      const newPet = { name: 'Fluffy', type: 'cat', tags: ['cute'] };

      const response = await instance.post('/pets', newPet);

      expect(response.status).to.equal(200);
      expect(response.data.id).to.not.be.undefined;
      expect(response.data.name).to.deep.equal(newPet.name);
      expect(response.data.type).to.equal(newPet.type);
      expect(response.data.tags).to.deep.equal(newPet.tags);
    });
  });

  describe('GET /pets/{id}', () => {
    it('should return status 404 if the pet does not exist', async () => {
      const response = await instance.get('/pets/999');
      
      expect(response.status).to.equal(404);
      expect(response.data.message).to.equal('not found');
    });

    it('should return 200 and the correct pet', async () => {
      const newPet = { name: 'Sparky', type: 'dog', tags: ['sweet'] };
      const postResponse = await instance.post('/pets', newPet);
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

    it('should return 404 even if the pet to delete does not exist', async () => {
      const response = await instance.delete('/pets/999');
      expect(response.status).to.equal(404);
    });
  });

  describe('GET /pets', () => {
    it('should return limited number of animals filtered by type', async () => {

      for(let i = 1; i<4; i++){
        await instance.post('/pets', { name: `dog${i}`, type: 'dog', tags: [] });
      }

      const type = 'dog';
      const limit = 2;
      const response = await instance.get(`/pets?type=${type}&limit=${limit}`);

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.equal(limit);
      
      const isEveryAnimalDog = response.data.every((pet: Pet) => pet.type === 'dog');
      expect(isEveryAnimalDog).to.be.true;
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