import { expect } from 'chai';
import sinon from 'sinon';
import { SessionService, Session } from '../../api/services/session.service';
import crypto from 'crypto';
import { findSourceMap } from 'node:module';
import { expectFailure } from 'node:test';

const sessions = new SessionService();

describe('Session Service', () => {
    describe('getByUserId', () => {
        it('should return null, if the user session is expired', async () => {
            const sessionDatabaseMock = sinon.mock(sessions.sessionDatabase);
            const twelveHour: number = 12 * 60 * 60 * 1000;
            const currentTime: number = new Date().getTime();
            const expiryDate = new Date(currentTime - twelveHour);
            const session: Session = {
                "userId": 3,
                "sessionId": "123e4567-e89b-12d3-a456-426614174000",
                "expiryDate": expiryDate
            }

            sessionDatabaseMock.expects('find').returns(session);

            const retrievedSession: Session | null = await sessions.getByUserId(3);
            expect(retrievedSession).is.null;

            sessionDatabaseMock.verify();
            sessionDatabaseMock.restore();
        });

        it('should return null, if the user session doesn\'t exsist', async () => {
            const sessionDatabaseMock = sinon.mock(sessions.sessionDatabase);
            sessionDatabaseMock.expects('find').returns(undefined);

            const retrievedSession: Session | null = await sessions.getByUserId(3);
            expect(retrievedSession).is.null;

            sessionDatabaseMock.verify();
            sessionDatabaseMock.restore();
        });

        it('should return the user session', async () => {
            const sessionDatabaseMock = sinon.mock(sessions.sessionDatabase);
            const twelveHour: number = 12 * 60 * 60 * 1000;
            const currentTime: number = new Date().getTime();
            const expiryDate = new Date(currentTime + twelveHour);
            const session: Session = {
                "userId": 3,
                "sessionId": "123e4567-e89b-12d3-a456-426614174000",
                "expiryDate": expiryDate
            }

            sessionDatabaseMock.expects('find').returns(session);

            const retrievedSession = await sessions.getByUserId(3);
            expect(retrievedSession).to.be.deep.equal(session);

            sessionDatabaseMock.verify();
            sessionDatabaseMock.restore();
        });
    });

    describe('getBySessionId', () => {
        it('should return null, if the user session is expired', async () => {
            const sessionDatabaseMock = sinon.mock(sessions.sessionDatabase);
            const twelveHour: number = 12 * 60 * 60 * 1000;
            const currentTime: number = new Date().getTime();
            const expiryDate = new Date(currentTime - twelveHour);
            const session: Session = {
                "userId": 3,
                "sessionId": "123e4567-e89b-12d3-a456-426614174000",
                "expiryDate": expiryDate
            }

            sessionDatabaseMock.expects('find').returns(session);

            const retrievedSession: Session | null = await sessions.getBySessionId("123e4567-e89b-12d3-a456-426614174000");
            expect(retrievedSession).is.null;

            sessionDatabaseMock.verify();
            sessionDatabaseMock.restore();
        });

        it('should return null, if the user session doesn\'t exsist', async () => {
            const sessionDatabaseMock = sinon.mock(sessions.sessionDatabase);
            sessionDatabaseMock.expects('find').returns(undefined);

            const retrievedSession: Session | null = await sessions.getBySessionId("123e4567-e89b-12d3-a456-426614174000");
            expect(retrievedSession).is.null;

            sessionDatabaseMock.verify();
            sessionDatabaseMock.restore();
        });

        it('should return the user session', async () => {
            const sessionDatabaseMock = sinon.mock(sessions.sessionDatabase);
            const twelveHour: number = 12 * 60 * 60 * 1000;
            const currentTime: number = new Date().getTime();
            const expiryDate = new Date(currentTime + twelveHour);
            const session: Session = {
                "userId": 3,
                "sessionId": "123e4567-e89b-12d3-a456-426614174000",
                "expiryDate": expiryDate
            }

            sessionDatabaseMock.expects('find').returns(session);

            const retrievedSession = await sessions.getBySessionId("123e4567-e89b-12d3-a456-426614174000");
            expect(retrievedSession).to.be.deep.equal(session);

            sessionDatabaseMock.verify();
            sessionDatabaseMock.restore();
        });
    });

    describe('new', () => {
        it('should create new row', async () => {
            const sessionId: crypto.UUID = "123e4567-e89b-12d3-a456-426614174000";
            const userId: number = 56;
            const expiryDate: Date = new Date(3000);

            const generateExpiryDateStub = sinon.stub(sessions, 'generateExpiryDate').returns(expiryDate);
            const randomUUIDStub = sinon.stub(crypto, 'randomUUID').returns(sessionId);

            const retrievedSession = await sessions.new(userId);

            expect(retrievedSession).to.be.deep.equal({
                "sessionId": sessionId,
                "userId": userId,
                "expiryDate": expiryDate
            });

            randomUUIDStub.restore();
            generateExpiryDateStub.restore();
        });
    });

    describe('Integration tests', function () {
        beforeEach(() => {
            sessions.clearDatabase();
        });
        
        it('New -> New -> Get -> Delete -> Get', async () => {
            const userId: number = 777;
            const currentDate: Date = new Date();

            const firstSession: Session = await sessions.new(userId);
            const firstNumberOfRow: number = await sessions.numberOfRow();
            const secondSession: Session = await sessions.new(userId);
            const secondNumberOfRow: number = await sessions.numberOfRow();
            const retrievedSession: Session | null = await sessions.getByUserId(userId);
            await sessions.delete(secondSession.sessionId);
            const sessionAfterDelete: Session | null = await sessions.getByUserId(userId);
            

            expect(firstSession).is.not.null;
            expect(secondSession).is.not.null;
            expect(sessionAfterDelete).is.null;

            expect(firstSession.expiryDate).is.greaterThan(currentDate);
            expect(secondSession.expiryDate).is.greaterThan(currentDate);

            expect(firstNumberOfRow).is.equal(1);
            expect(secondNumberOfRow).is.equal(1);

            expect(firstSession.sessionId).is.not.equal(secondSession.sessionId);
            expect(retrievedSession).is.deep.equal(secondSession);
        });
    });
});

