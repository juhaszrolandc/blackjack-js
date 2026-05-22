type UserRegistrationDetalils = {
    "username": string,
    "password": string
}

type User = {
    "username": string,
    "password": string
    "queue": number[],
    "userId": number,
};

class UserService {
    constructor(private userDatabase: User[]){}

    async get(userId: number){
        const user: User | undefined = this.userDatabase.find(user => user.userId === userId);
        return user ? user : null;
    }

    async insert(registrationDetalils: UserRegistrationDetalils){
        const userId: number = this.userDatabase.length;
        const user: User = {
            ...registrationDetalils,
            "queue": new Array(),
            "userId": userId
        };

        this.userDatabase.push(user);
    }

    async getQueue(userId: number){
        const user: User | undefined = this.userDatabase.find(user => user.userId === userId);
        return user ? user.queue : null;
    }

    async insertQueue(userId: number, movieId: number){
        const userIndex = this.userDatabase.findIndex(user => user.userId === userId);
        if(userIndex != -1){
            const user = this.userDatabase[userIndex];
            user.queue.push(movieId);
        } else {
            throw new Error("User session does'nt exist!");
        }
    }
}