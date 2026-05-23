import { expect } from 'chai';
import { MovieService, Movie, MovieWithoutId } from '../../api/services/movie.service';

describe('Movie session service', async function () {
    const movies = new MovieService();

    afterEach(async ()=>{
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