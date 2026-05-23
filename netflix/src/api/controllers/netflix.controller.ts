import { Request, Response } from 'express';
import { SessionService, Session } from '../services/session.service';
import { UserService, User, UserRegistrationDetalils } from '../services/user.service';
import { MovieService, Movie, MovieWithoutId } from '../services/movie.service';
import { AdminKeyService, AdminKey } from '../services/adminKey.service';
import { use } from 'chai';
import { UUID } from 'node:crypto';

const sessions = new SessionService();
const users = new UserService();
const movies = new MovieService();
const adminKeys = new AdminKeyService();

async function createUser(req: Request, res: Response) {
      await users.insert({
        "username": String(req.body.username),
        "password": String(req.body.password)
      });
      res.status(201).json({
        "message": "Account has been successfully created"
      });
}

async function login(req: Request, res: Response){
      const username: string = String(req.body.username);
      const password: string = String(req.body.password);
      const user: User | null = await users.getByUsernameAndPassword(username, password);
      let session: Session | null = null;

      if(user){
        session = await sessions.new(user.userId);
        res.status(200).json({
          "sessionId": session.sessinoId
        });

      } else {
        res.status(400).json({
          "message": "Invalid username or password, please double-check your login details and try again."
        });
      }
}

async function logout(req: Request, res: Response){
  await sessions.delete(req.headers["x-session-id"] as UUID);
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
