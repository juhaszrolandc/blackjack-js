import { Request, Response } from 'express';

interface Pet {
  id: number;
  name: string;
  type: string;
  tags: string[];
}

let pets: Pet[] = [];
let creationId: number = 1;

function getPets(req: Request, res: Response) {
  const type = String(req.query.type);
  const limit = Number(req.query.limit);
  const tags = req.query.tags as string[];

  let filteredPets = pets.filter(pet => pet.type === type).slice(0, limit);

  if(tags){
    filteredPets = filteredPets.filter(pet => tags.some(tag => pet.tags.includes(tag)));
  }
  
  res.json(filteredPets);
}

function createPet(req: Request, res: Response) {
  const newPet = { ...req.body, id: creationId++ };
  pets.push(newPet);
  res.json(newPet);
}

function findPetById(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const pet = pets.find(pet => pet.id === id);
  pet ? res.json(pet) : res.status(404).json({ message: 'not found' });
}

function deletePet(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  pets = pets.filter(pet => pet.id !== id);
  res.status(204).end();
}

export {
  getPets,
  createPet,
  findPetById,
  deletePet
};
