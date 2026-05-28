export type MovieWithoutId = {
    "title": string,
    "description": string,
    "directedBy": string,
    "actors": string[],
    "categories": string[],
    "type": "TV Show" | "Movie",
};

export type Movie = MovieWithoutId & {"id": number};

export class MovieService {
    constructor(public movieDatabase: Movie[] = new Array()){}

    async getMovieById(movieId: number){
        const movie: Movie | undefined = this.movieDatabase.find(movie => movie.id === movieId);
        return movie ? movie : null;
    }

    async getMovieByTitle(movieTitle: string){
        const movie: Movie | undefined = this.movieDatabase.find(
            movie => movie.title.toLowerCase() === movieTitle.toLowerCase()
        );
        return movie ? movie : null;
    }

    async insert(newMovie: MovieWithoutId){
        const movieIndex: number = this.movieDatabase.findIndex(
            movie => movie.title.toLowerCase() === newMovie.title.toLowerCase()
        );

        if( movieIndex !== -1 ){
            throw Error('A movie with this title already exists!');
        }

        const movieId = this.movieDatabase.length;
        const movie: Movie = {
            ...newMovie,
            "id": movieId
        }
        this.movieDatabase.push(movie);
        return movie;
    }

    async update(movieId: number, changedMovie: MovieWithoutId){
        const movieIndex: number = this.movieDatabase.findIndex(movie => movie.id === movieId);

        if(movieIndex === -1){
            throw new Error("The movie with this ID does not exist!");
        }

        this.movieDatabase[movieIndex] = {
            ...changedMovie,
            "id": this.movieDatabase[movieIndex].id
        }

        return this.movieDatabase[movieIndex];
    }

    async delete(movieId: number){
        this.movieDatabase = this.movieDatabase.filter(movie => movie.id !== movieId);
    }

    async numberOfRow(){
        return this.movieDatabase.length;
    }

    async clearDatabase(){
        return this.movieDatabase = new Array();
    }
}