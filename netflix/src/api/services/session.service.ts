import { use } from "chai";
import { UUID, randomUUID } from "node:crypto";

export type Session = {
    "userId": number,
    "sessinoId": UUID,
    "expiryDate": Date
};

export class SessionService {
    constructor(private sessionDatabase: Session[] = new Array()){}

    async get(userId: number){
        const userSession: Session | undefined = this.sessionDatabase.find(session => session.userId === userId);
        const currentDate = new Date();

        if(!userSession || userSession.expiryDate < currentDate){
            return null;
        }

        return userSession;
    }

    async new(userId: number){
        this.sessionDatabase = this.sessionDatabase.filter(session => session.userId !== userId);

        const twelveHour: number = 12 * 60 * 60 * 1000;
        const currentTime: number = new Date().getTime();
        const expiryDate = new Date(currentTime + twelveHour);
        const userSession: Session = {
            "sessinoId": randomUUID(),
            "userId": userId,
            "expiryDate": expiryDate
        }

        this.sessionDatabase.push(userSession);

        return userSession;
    }

    async delete(userId: number){
        const sessionIndex: number = this.sessionDatabase.findIndex(session => session.userId === userId);

        if(sessionIndex === -1){
            throw new Error("Session does'nt exist!");
        }

        this.sessionDatabase = this.sessionDatabase.filter(session => session.userId !== userId);
    }

    async numberOfRow(){
        return this.sessionDatabase.length;
    }

    async clearDatabase(){
        return this.sessionDatabase = new Array();
    }
}