import { expect } from 'chai';
import sinon from "sinon";
import axios from 'axios';
import '../../app';
import { rewritePetData, getPetData } from '../../api/controllers/pets.controller';

type Pet = {
  id: number;
  name: string;
  type: string;
  tags: string[];
}

/* 
   A pets.controller.ts-ben lévő pets tömböt kellene stubbolni ezekhez a tesztekhez.
   De nem tudom hogyan lehet ezt itt "szépen csinálni".
*/
describe('pets controller', () => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000/v1',
    validateStatus: undefined
  });

  describe('GET /pets/{id}', () => {

    const pets: Pet[] = [
         {
            id: 1,
            name: 'buzz1',
            type: 'dog',
            tags: ['purrfect'],
         },
         {
            id: 2,
            name: 'buzz2',
            type: 'dog',
            tags: ['purrfect'],
         },
         {
            id: 3,
            name: 'buzz3',
            type: 'dog',
            tags: ['purrfect'],
         }
    ];

    before(()=>{
      rewritePetData(pets);
    });

    it('should return status 404', async () => {
      const petID: number = 4;
      const response: any = await instance.get(`/pets/${petID}`);

      expect(response.status).to.equal(404);
    });

    it('should return 200', async () => {
      const petID: number = 1;
      const response: any = await instance.get(`/pets/${petID}`);

      expect(response.status).to.equal(200);
    })

    it('should return a pet with ID 1', async () => {
      const petID: number = 1;
      const response: any = await instance.get(`/pets/${petID}`);
      const pet1 = pets.find(pet => pet.id === 1);
      expect(response.data).to.deep.equal(pet1);
    });

  });

  describe('DELETE /pets/{id}', () => {

    const pets: Pet[] = [
      {
        id: 1,
        name: 'buzz1',
        type: 'dog',
        tags: ['purrfect'],
      }
    ];
    
    beforeEach(()=>{
      rewritePetData(pets);
    });

    it('should return status 204', async () => {
      const petID: number = 1;
      const response: any = await instance.delete(`/pets/${petID}`);

      expect(response.status).to.equal(204);
    });

    it('should delete the animal which has id 1', async () => {
      const petID: number = 1;
      const animalsCountBeforeDelete = getPetData().length;
      const response: any = await instance.delete(`/pets/${petID}`);
      const animalsCountAfterDelete = getPetData().length;

      expect(animalsCountAfterDelete).to.equal(animalsCountBeforeDelete-1);
    });

    it('should\'nt delete an animal', async () => {
      const petID: number = 999;
      const animalsCountBeforeDelete = getPetData().length;
      const response: any = await instance.delete(`/pets/${petID}`);
      const animalsCountAfterDelete = getPetData().length;

      expect(animalsCountAfterDelete).to.equal(animalsCountBeforeDelete);
    });

  });

  describe('GET /pets', () => {
    const pets: Pet[] = [
         {
            id: 1,
            name: 'buzz1',
            type: 'dog',
            tags: ['purrfect'],
         },
         {
            id: 2,
            name: 'buzz2',
            type: 'dog',
            tags: ['purrfect'],
         },
         {
            id: 3,
            name: 'buzz3',
            type: 'dog',
            tags: ['purrfect'],
         }
    ];

    before(()=>{
      rewritePetData(pets);
    });

    it('should return 200', async () => {
      const type: string = "dog";
      const limit: number = 2;
      const response: any = await instance.get(`/pets?type=${type}&limit=${limit}`);

      expect(response.status).to.equal(200);
    });

    it('should return limited number of animals', async () => {
      const type: string = "dog";
      const limit: number = 2;
      const response: any = await instance.get(`/pets?type=${type}&limit=${limit}`);
      const countOfAnimals: number = response.data.length;

      expect(countOfAnimals).to.be.lessThanOrEqual(limit);
    });

    it('should return limited number of dogs', async () => {
      const type: string = "dog";
      const limit: number = 1;
      const response: any = await instance.get(`/pets?type=${type}&limit=${limit}`);
      const countOfDogs: number = response.data.filter((pet: Pet) => pet.type === "dog").length;

      expect(countOfDogs).to.be.lessThanOrEqual(limit);
    });

  });
  
  describe('POST /pets', () => {
    const newAnimal = {
        name: 'noname',
        type: 'cat',
        tags: ['cute']
    };

    beforeEach(()=>{
      rewritePetData([]);
    });

    it('shold be return 200', async ()=>{
      const response: any = await instance.post('/pets', newAnimal);

      expect(response.status).to.equal(200);
    });

    it('should put a new animal into the array', async ()=>{
      const response: any = await instance.post('/pets', newAnimal);
      const animal = getPetData().find(pet => pet.name === newAnimal.name);

      expect(animal).does.not.undefined;
    });

  })

});