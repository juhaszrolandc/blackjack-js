import { use } from "chai";
import crypto from 'crypto';

export type Session = {
    "userId": number,
    "sessionId": crypto.UUID,
    "expiryDate": Date
};

export class SessionService {
    constructor(public sessionDatabase: Session[] = new Array()){}

    async getByUserId(userId: number){
        const userSession: Session | undefined = this.sessionDatabase.find(session => session.userId === userId);
        const currentDate = new Date();

        if(!userSession || userSession.expiryDate < currentDate){
            return null;
        }

        return userSession;
    }

    async getBySessionId(sessionId: crypto.UUID){
        const userSession: Session | undefined = this.sessionDatabase.find(session => session.sessionId === sessionId);
        const currentDate = new Date();

        if(!userSession || userSession.expiryDate < currentDate){
            return null;
        }

        return userSession;
    }

    async new(userId: number){
        this.sessionDatabase = this.sessionDatabase.filter(session => session.userId !== userId);

        const userSession: Session = {
            "sessionId": crypto.randomUUID(),
            "userId": userId,
            "expiryDate": this.generateExpiryDate(12)
        }
        
        this.sessionDatabase.push(userSession);

        return userSession;
    }

    async delete(sessinoId: crypto.UUID){
        this.sessionDatabase = this.sessionDatabase.filter(session => session.sessionId !== sessinoId);
    }

    generateExpiryDate(hours: number){
        const hoursInMilisec: number = hours * 60 * 60 * 1000;
        const currentTimeInMilisec: number = new Date().getTime();
        const expiryDate = new Date(currentTimeInMilisec + hoursInMilisec);
        return expiryDate;
    }

    async numberOfRow(){
        return this.sessionDatabase.length;
    }

    async clearDatabase(){
        return this.sessionDatabase = new Array();
    }
}