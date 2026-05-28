import { expect } from 'chai';
import { MovieService, Movie, MovieWithoutId } from '../../api/services/movie.service';
import sinon from 'sinon';

const movies = new MovieService();

describe('Movie Service', () => {

    describe('getMovieById', async () => {
        it('should return the movie object', async () => {
            const movieId: number = 3;
            const movie: Movie = {
                "title": "Transformers",
                "description": "Transformers (2007) is a high-octane science fiction action film.",
                "directedBy": "Michael Bay",
                "actors": ["Shia LaBeouf", "Megan Fox"],
                "categories": ["sci-fi", "action"],
                "type": "Movie",
                "id": 3
            };
            const movieDatabaseFindStub = sinon.stub(movies.movieDatabase, 'find').returns(movie);
            const retrievedMovie: Movie | null = await movies.getMovieById(movieId);

            expect(retrievedMovie).to.be.deep.equal(movie);

            movieDatabaseFindStub.restore();
        });

        it('should return null', async () => {
            const movieId: number = 3;
            const movieDatabaseFindStub = sinon.stub(movies.movieDatabase, 'find').returns(undefined);
            const retrievedMovie: Movie | null = await movies.getMovieById(movieId);

            expect(retrievedMovie).is.null;

            movieDatabaseFindStub.restore();
        });
    });

    describe('getMovieByTitle', async () => {
        it('should return the movie object', async () => {
            const movieTitle: string = "Transformers";
            const movie: Movie = {
                "title": movieTitle,
                "description": "Transformers (2007) is a high-octane science fiction action film.",
                "directedBy": "Michael Bay",
                "actors": ["Shia LaBeouf", "Megan Fox"],
                "categories": ["sci-fi", "action"],
                "type": "Movie",
                "id": 3
            };
            const movieDatabaseFindStub = sinon.stub(movies.movieDatabase, 'find').returns(movie);
            const retrievedMovie: Movie | null = await movies.getMovieByTitle(movieTitle);

            expect(retrievedMovie).to.be.deep.equal(movie);

            movieDatabaseFindStub.restore();
        });

        it('should return null', async () => {
            const movieTitle: string = "Transformers";
            const movieDatabaseFindStub = sinon.stub(movies.movieDatabase, 'find').returns(undefined);
            const retrievedMovie: Movie | null = await movies.getMovieByTitle(movieTitle);

            expect(retrievedMovie).is.null;

            movieDatabaseFindStub.restore();
        });
    });

    describe('insert', () => {
        it('should create a new row', async () => {
            const movie: MovieWithoutId = {
                "title": "Transformers",
                "description": "Transformers (2007) is a high-octane science fiction action film.",
                "directedBy": "Michael Bay",
                "actors": ["Shia LaBeouf", "Megan Fox"],
                "categories": ["sci-fi", "action"],
                "type": "Movie"
            };

            const numberOfFilmsBeforeInsert = movies.movieDatabase.length;
            const retrievedMovie = await movies.insert(movie);
            const numberOfFilmsAfterInsert = movies.movieDatabase.length;

            expect({"id":0, ...movie}).to.be.deep.equal(retrievedMovie);
            expect(numberOfFilmsBeforeInsert+1).to.be.equal(numberOfFilmsAfterInsert);
        });

        it('should throws: A movie with this title already exists!', async () => {
            const movie: MovieWithoutId = {
                "title": "Transformers",
                "description": "Transformers (2007) is a high-octane science fiction action film.",
                "directedBy": "Michael Bay",
                "actors": ["Shia LaBeouf", "Megan Fox"],
                "categories": ["sci-fi", "action"],
                "type": "Movie"
            };

            const databaseFindIndexStub = sinon.stub(movies.movieDatabase, "findIndex").returns(0);
            let hasThrown = false;

            try {
                await movies.insert(movie);

            } catch (error: any) {
                hasThrown = true;
                expect(error.message).to.be.equal("A movie with this title already exists!");

            } finally {
                databaseFindIndexStub.restore();
            }

            expect(hasThrown, "The code should have thrown an error but it did not!").to.be.true;
        });
    });

    describe('update', () => {
        it('should throws: Movie does\'nt exist!', async () => {
            const databaseFindIndexStub = sinon.stub(movies.movieDatabase, "findIndex").returns(-1);
            let hasThrown = false;

            try {
                await movies.update(3, {
                    "title": "The Title",
                    "description": "This is a description about the show.",
                    "directedBy": "string",
                    "actors": ["Juhász Roland", "Magyar Péter"],
                    "categories": ["reality"],
                    "type": "TV Show",
                });

            } catch (error: any) {
                hasThrown = true;
                expect(error.message).to.be.equal("The movie with this ID does not exist!");

            } finally {
                databaseFindIndexStub.restore();
            }

            expect(hasThrown, "The code should have thrown an error but it did not!").to.be.true;
        });
    });

    describe('Integration tests', () => {
        beforeEach(async ()=>{
            await movies.clearDatabase();
        });

        it('New -> Get by title -> Get by id', async () => {
            const movie = await movies.insert({
                "title": "The Title",
                "description": "This is a description about the show.",
                "directedBy": "string",
                "actors": ["Juhász Roland", "Magyar Péter"],
                "categories": ["reality"],
                "type": "TV Show",
            });

            const numberOfRowAfterInsert: number = await movies.numberOfRow();
            const retrivedMovieById: Movie | null = await movies.getMovieById(movie.id);
            const retrivedMovieByTitle: Movie | null = await movies.getMovieByTitle(movie.title);

            expect(numberOfRowAfterInsert).to.be.equal(1);
            expect(retrivedMovieById).is.not.null;
            expect(retrivedMovieById).is.not.undefined;
            expect(retrivedMovieByTitle).is.not.null;
            expect(retrivedMovieByTitle).is.not.undefined;
            expect(retrivedMovieById).to.be.deep.equal(retrivedMovieByTitle);
            expect(retrivedMovieById?.id).to.be.equal(0);
        });

        it('Delete', async () => {
            const movie = await movies.insert({
                "title": "The Title",
                "description": "This is a description about the show.",
                "directedBy": "string",
                "actors": ["Juhász Roland", "Magyar Péter"],
                "categories": ["reality"],
                "type": "TV Show",
            });

            const numberOfRowAfterInsert: number = await movies.numberOfRow();
            const retrivedMovieById: Movie | null = await movies.getMovieById(movie.id);
            await movies.delete(movie.id);
            const retrivedMovieAfterDelete: Movie | null = await movies.getMovieById(movie.id);
            const numberOfRowAfterDelete: number = await movies.numberOfRow();

            expect(numberOfRowAfterInsert).to.be.equal(1);
            expect(retrivedMovieById).is.not.null;
            expect(retrivedMovieById).is.not.undefined;
            expect(retrivedMovieAfterDelete).is.null;
            expect(numberOfRowAfterDelete).to.be.equal(0);
        });
    });
});