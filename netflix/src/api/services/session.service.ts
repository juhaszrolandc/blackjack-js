import { UUID, randomUUID } from "node:crypto";

type Session = {
    "userId": number,
    "sessinoId": UUID,
    "expiryDate": Date
};

class SessionService {
    constructor(public sessionDatabase: Session[]){}

    async get(userId: number){
        const userSession: Session | undefined = this.sessionDatabase.find(session => session.userId === userId);
        const currentDate = new Date();

        if(!userSession || userSession.expiryDate < currentDate){
            return null;
        }

        return userSession;
    }

    async new(userId: number){
        const userSessionIndex: number = this.sessionDatabase.findIndex(session => session.userId === userId);

        if(userSessionIndex !== -1){
            delete this.sessionDatabase[userSessionIndex];
        }

        const twelveHour: number = 12 * 60 * 60 * 1000;
        const currentTime: number = new Date().getTime();
        const expiryDate = new Date(currentTime + twelveHour);
        const userSession: Session = {
            "sessinoId": randomUUID(),
            "userId": userId,
            "expiryDate": expiryDate
        }

        this.sessionDatabase.push(userSession);
    }

    async delete(userId: number){
        const sessionIndex: number = this.sessionDatabase.findIndex(session => session.userId === userId);

        if(sessionIndex === -1){
            throw new Error("Session does'nt exist!");
        }

        delete this.sessionDatabase[sessionIndex];
    }
}