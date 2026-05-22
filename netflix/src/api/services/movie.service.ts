type MovieWithoutId = {
    "title": string,
    "description": string,
    "directedBy": string,
    "actors": string[],
    "categories": string[],
    "type": "TV Show" | "Movie",
};

type Movie = MovieWithoutId & {"id": number};

class MovieService {
    constructor(private movieDatabase: Movie[]){}

    async getMovieById(movieId: number){
        const movie: Movie | undefined = this.movieDatabase.find(movie => movie.id === movieId);
        return movie ? movie : null;
    }

    async getMovieByTitle(movieTitle: string){
        const movie: Movie | undefined = this.movieDatabase.find(movie => movie.title === movieTitle);
        return movie ? movie : null;
    }

    async insert(newMovie: MovieWithoutId){
        const movieId = this.movieDatabase.length;
        const movie: Movie = {
            ...newMovie,
            "id": movieId
        }
        this.movieDatabase.push(movie);
    }

    async update(movieId: number, changedMovie: MovieWithoutId){
        const movieIndex: number = this.movieDatabase.findIndex(movie => movie.id === movieId);

        if(movieIndex === -1){
            throw new Error("Movie does'nt exist!");
        }

        this.movieDatabase[movieIndex] = {
            ...changedMovie,
            "id": this.movieDatabase[movieIndex].id
        }
    }

    async delete(movieId: number){
        this.movieDatabase.filter(movie => movie.id !== movieId);
    }

    async numberOfRow(){
        return this.movieDatabase.length;
    }

    async clearDatabase(){
        return this.movieDatabase = new Array();
    }
}