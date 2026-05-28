import { Request, Response, NextFunction } from 'express';
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

/*
  Ez a függvény nem API végponthoz tartozik!
  Csak az újra felhasználás miatt került kiszervezésre
*/
async function isAdminKeyValid(req: Request, res: Response) {
    const requestAdminKey: UUID = req.headers["x-admin-api-key"] as UUID;
    const adminKey: UUID | null = await adminKeys.get();
    const isValid: boolean = requestAdminKey !== adminKey;

    if(isValid){
      res.status(400).json({
        "message": "Invalid admin key!"
      });
    }

    return isValid;
}

/*
  Ez a függvény nem API végponthoz tartozik!
  Csak az újra felhasználás miatt került kiszervezésre
*/
async function getUserSession(req: Request, res: Response) {
    const sessionId: UUID = req.headers["x-session-id"] as UUID;
    const session: Session | null = await sessions.getBySessionId(sessionId);

    if(!session){
      res.status(400).json({
        "message": "Invalid session ID, please login!"
      });
    }

    return session;
}

async function createUser(req: Request, res: Response, next: NextFunction) {
    const user: UserRegistrationDetalils = {
      "username": String(req.body.username),
      "password": String(req.body.password)
    }

    try {
      await users.insert(user);
      res.status(201).json({
        "message": "Account has been successfully created"
      });

    } catch (error: any){
      if(error.message === "Username exists!"){
          res.status(409).json({
            "message": "Username already exists! Please choose a different username."
          });
      } else {
        next(error);
      }
    }
}

async function login(req: Request, res: Response){
    const username: string = String(req.body.username);
    const password: string = String(req.body.password);
    const user: User | null = await users.getByUsernameAndPassword(username, password);
    let session: Session | null = null;

    if(user){
      session = await sessions.new(user.userId);
      res.status(200).json({
        "sessionId": session.sessionId
      });

    } else {
      res.status(400).json({
        "message": "Invalid username or password, please double-check your login details and try again."
      });
    }
}

async function logout(req: Request, res: Response){
    const sessionId: UUID = req.headers["x-session-id"] as UUID;
    await sessions.delete(sessionId);
    res.status(200).json({
      "message": "Logout successfully!"
    });
}

async function queue(req: Request, res: Response){
    const session: Session | null = await getUserSession(req, res);

    if(!session){
      return;
    }

    const userQueue: number[] = await users.getQueue(session!.userId) as number[];
    const isOrdered: boolean = Boolean(req.query.order);  

    if(isOrdered){
      userQueue!.sort();
    }

    const userMovies: Movie[] = Array();

    for(let movieId of userQueue!){
      let movie: Movie | null = await movies.getMovieById(movieId);
      if(movie){
        userMovies.push(movie);
      }
    }

    res.status(200).json(userMovies);
}

async function findMovie(req: Request, res: Response){
    const session: Session | null = await getUserSession(req, res);
    
    if(!session){
      return;
    }

    if(req.query.id){
      const movieId: number = Number(req.query.id);
      const movie: Movie | null = await movies.getMovieById(movieId);
      res.status(200).json(movie);

    } else if(req.query.title){
      const movieTitle: string | undefined = String(req.query.title);
      const movie: Movie | null = await movies.getMovieByTitle(movieTitle);
      res.status(200).json(movie);
    }
}

async function createMovie(req: Request, res: Response, next: NextFunction){
    if(await isAdminKeyValid(req, res)){
      return;
    }

    let movie: Movie | null = null;
    
    try{
      movie = await movies.insert(req.body as Movie);

    } catch(error: any) {
      if(error.message === "A movie with this title already exists!"){
        res.status(409).json({
          "message": "A movie with this title already exists!"
        });
      } else {
        next(error);
      }
    }
    
    res.status(201).json(movie);
}

async function deleteMovie(req: Request, res: Response){
    if(await isAdminKeyValid(req, res)){
      return;
    }

    const movieId: number = Number(req.query.id);
    await movies.delete(movieId);

    res.status(200).json({
      "message": "You deleted the movie successfully."
    });
}

async function updateMovie(req: Request, res: Response, next: NextFunction){
    if(await isAdminKeyValid(req, res)){
      return;
    }

    const movieId: number = Number(req.query.id);
    const movie: MovieWithoutId = {
        "title": String(req.body.title),
        "description": String(req.body.description),
        "directedBy": String(req.body.directedBy),
        "actors": req.body.actors,
        "categories": req.body.categories,
        "type": String(req.body.type) as 'Movie' | 'TV Show'
    };

    let retrievedMovie: Movie | null = null; 
    
    try{
      retrievedMovie = await movies.update(movieId, movie);

    } catch(error: any){
      if(error.message === "The movie with this ID does not exist!"){
        res.status(404).json({
          "message": error.message
        });
      } else {
        next(error);
      }
    }
    
    res.status(200).json(retrievedMovie);
}

async function buyMovieById(req: Request, res: Response){
    const session: Session | null = await getUserSession(req, res);

    if(!session){
      return;
    }

    const movieId = Number(req.params.movieId);
    const movie = await movies.getMovieById(movieId);

    if(!movie){
      res.status(404).json({
        "message": "No movies found with this id."
      });
    }

    await users.insertQueue(session.userId, movieId);

    res.status(200).json({
        "message": "You buy the movie successfully."
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
  buyMovieById
};
