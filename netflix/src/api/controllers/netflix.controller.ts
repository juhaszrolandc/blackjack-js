import { Request, Response } from 'express';

function createUser(req: Request, res: Response) {
  res.status(201).json({
    "message": "Account has been successfully created"
  });
}

function login(req: Request, res: Response){
  res.status(200).json({
    "session-id": "123e4567-e89b-12d3-a456-426614174000"
  });
}

function logout(req: Request, res: Response){
  res.status(200).json({
    "message": "Logout successfully"
  });
}

function queue(req: Request, res: Response){
  res.status(200).json([
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
}

function findMovie(req: Request, res: Response){
  res.status(200).json({
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie",
        "id": 3
  });
}

function createMovie(req: Request, res: Response){
  res.status(201).json({
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie",
        "id": 3
  });
}

function deleteMovie(req: Request, res: Response){
  res.status(200).json({
    "message": "You deleted the movie successfully."
  });
}

function updateMovie(req: Request, res: Response){
  res.status(200).json({
        "title": "Transformers",
        "description": "Transformers (2007) is a high-octane science fiction action film.",
        "directed-by": "Michael Bay",
        "actors": ["Shia LaBeouf", "Megan Fox"],
        "categories": ["sci-fi", "action"],
        "type": "Movie",
        "id": 3
  });
}

function rentMovieById(req: Request, res: Response){
  console.log("rentMovieById");
  res.status(200).json({
        "message": "You rented the movie successfully."
  });
}

export {
  createUser,
  login,
  logout,
  queue,
  findMovie,
  createMovie,
  deleteMovie,
  updateMovie,
  rentMovieById
};
