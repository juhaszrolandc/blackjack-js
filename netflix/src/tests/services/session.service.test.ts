import { expect } from 'chai';
import { SessionService, Session } from '../../api/services/session.service';
import { UUID } from 'node:crypto';
import { findSourceMap } from 'node:module';
import { expectFailure } from 'node:test';

describe('User session service', function () {
    const sessions = new SessionService();

    it('New twice -> Get -> Delete -> Get', async () => {
        const userId: number = 777;
        const currentDate: Date = new Date();

        const firstSession: Session = await sessions.new(userId);
        const firstNumberOfRow: number = await sessions.numberOfRow();
        const secondSession: Session = await sessions.new(userId);
        const secondNumberOfRow: number = await sessions.numberOfRow();
        const retrievedSession: Session | null = await sessions.get(userId);
        await sessions.delete(userId);
        const sessionAfterDelete: Session | null = await sessions.get(userId);
        

        expect(firstSession).is.not.null;
        expect(secondSession).is.not.null;
        expect(sessionAfterDelete).is.null;

        expect(firstSession.expiryDate).is.greaterThan(currentDate);
        expect(secondSession.expiryDate).is.greaterThan(currentDate);

        expect(firstNumberOfRow).is.equal(1);
        expect(secondNumberOfRow).is.equal(1);

        expect(firstSession.sessinoId).is.not.equal(secondSession.sessinoId);
        expect(retrievedSession).is.deep.equal(secondSession);
    });

});