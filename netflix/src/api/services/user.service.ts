import { use } from "chai";

export type UserRegistrationDetalils = {
    "username": string,
    "password": string
}

export type User = {
    "username": string,
    "password": string
    "queue": number[],
    "userId": number,
};

export class UserService {
    constructor(public userDatabase: User[] = new Array()){}

    async insert(registrationDetalils: UserRegistrationDetalils){
        const userIndex = this.userDatabase.findIndex(user => user.username === registrationDetalils.username);

        if(userIndex !== -1){
            throw new Error("Username exists!");
        }

        const userId: number = this.userDatabase.length;
        const user: User = {
            ...registrationDetalils,
            "queue": new Array(),
            "userId": userId
        };

        this.userDatabase.push(user);
    }

    async getByUsernameAndPassword(username: string, password: string){
        const user: User | undefined = this.userDatabase.find(user => { return user.username === username && user.password === password });
        return user ? user : null;
    }

    async getById(userId: number){
        const user: User | undefined = this.userDatabase.find(user => { return user.userId === userId });
        return user ? user : null;
    }

    async getQueue(userId: number){
        const user: User | undefined = this.userDatabase.find(user => user.userId === userId);
        return user ? user.queue : null;
    }

    async insertQueue(userId: number, movieId: number){
        const userIndex = this.userDatabase.findIndex(user => user.userId === userId);
        
        if(userIndex === -1){
            throw new Error("User does'nt exist!");
        }

        const user: User = this.userDatabase.at(userIndex)!;
        user.queue.push(movieId);

        return user;
    }

    async numberOfRow(){
        return this.userDatabase.length;
    }

    async clearDatabase(){
        return this.userDatabase = new Array();
    }
}