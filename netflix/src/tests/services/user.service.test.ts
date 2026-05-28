import { expect, use } from 'chai';
import sinon from 'sinon';
import { UserService, User, UserRegistrationDetalils } from '../../api/services/user.service';
import { mock } from 'node:test';

describe('User Service', function () {
    const users: UserService = new UserService();

    describe('getByUsernameAndPassword', () => {
        it('should return user object', async () => {
            const user: User = {
                "username": "Roland",
                "password": "passwd",
                "queue": [1,2],
                "userId": 1
            }

            const databaseFindStub = sinon.stub(users.userDatabase, "find").returns(user);
            const retrievedUser = await users.getByUsernameAndPassword("Roland","passwd");

            expect(retrievedUser).to.be.deep.equal(user);

            databaseFindStub.restore();
        });

        it('should return null (user does not exist)', async () => {
            const databaseFindStub = sinon.stub(users.userDatabase, "find").returns(undefined);
            const retrievedUser = await users.getByUsernameAndPassword("Roland","passwd");

            expect(retrievedUser).to.be.deep.equal(null);

            databaseFindStub.restore();
        });
    });

    describe('getById', () => {
        it('should return user object', async () => {
            const user: User = {
                "username": "Roland",
                "password": "passwd",
                "queue": [1,2],
                "userId": 1
            }

            const databaseFindStub = sinon.stub(users.userDatabase, "find").returns(user);
            const retrievedUser = await users.getById(1);

            expect(retrievedUser).to.be.deep.equal(user);

            databaseFindStub.restore();
        });

        it('should return null (user does not exist)', async () => {
            const databaseFindStub = sinon.stub(users.userDatabase, "find").returns(undefined);
            const retrievedUser = await users.getById(1);

            expect(retrievedUser).to.be.deep.equal(null);

            databaseFindStub.restore();
        });
    });

    describe('insert', () => {
        it('should throw: Username exists!', async () => {
            const databaseFindIndexStub = sinon.stub(users.userDatabase, "findIndex").returns(0);
            let hasThrown = false;

            try {
                await users.insert({
                    "username": "roland",
                    "password": "123"
                });

            } catch (error: any) {
                hasThrown = true;
                expect(error.message).to.equal("Username exists!");

            } finally {
                databaseFindIndexStub.restore();
            }

            expect(hasThrown, "The code should have thrown an error but it did not!").to.be.true;
        });

        it('should creat a new record (username does not exist)', async () => {
            const databaseFindIndexStub = sinon.stub(users.userDatabase, "findIndex").returns(-1);
            const databaseMock = sinon.mock(users.userDatabase);

            databaseMock.expects("push").withArgs({
                "username": "roland",
                "password": "123",
                "queue": [],
                "userId": users.userDatabase.length
            });

            await users.insert({
                "username": "roland",
                "password": "123"
            });

            databaseFindIndexStub.restore();
            databaseMock.verify();
            databaseMock.restore();
        });
    });

    describe('getQueue', () => {
        it('should return queue array', async () => {
            const user: User = {
                "username": "Roland",
                "password": "passwd",
                "queue": [1,2],
                "userId": 1
            }
            const databaseFindStub = sinon.stub(users.userDatabase, "find").returns(user);
            const queue = await users.getQueue(1);

            expect(queue).to.be.deep.equal([1,2]);

            databaseFindStub.restore();
        });

        it('should return null (user does not exist)', async () => {
            const databaseFindStub = sinon.stub(users.userDatabase, "find").returns(undefined);
            const queue = await users.getQueue(1);

            expect(queue).to.be.deep.equal(null);

            databaseFindStub.restore();
        });
    });

    describe('insertQueue', () => {
        it('should throw: User does\'nt exist!', async () => {
            const databaseFindIndexStub = sinon.stub(users.userDatabase, "findIndex").returns(-1);

            try {
                await users.insertQueue(1,3);

            } catch (error: any) {
                expect(error.message).to.equal("User does'nt exist!");

            } finally {
                databaseFindIndexStub.restore();
            }
        });

        it('should add movie id to queue (username exists)', async () => {
            const databaseFindIndexStub = sinon.stub(users.userDatabase, "findIndex").returns(0);
            const databaseMock = sinon.mock(users.userDatabase);

            databaseMock.expects("at").withArgs(0).returns({
                "username": "roland",
                "password": "123",
                "queue": [],
                "userId": users.userDatabase.length
            });

            const user: User = await users.insertQueue(1,3) as User;

            expect(user).to.be.deep.equal({
                "username": "roland",
                "password": "123",
                "queue": [3],
                "userId": users.userDatabase.length
            });

            databaseFindIndexStub.restore();
            databaseMock.verify();
            databaseMock.restore();
        });
    });

    describe('Integration tests', () => {
        beforeEach(async () => {
            await users.clearDatabase();
        });
        
        it('New -> New -> Get -> Delete -> Get', async () => {
            const rolandRegistrationDetails: UserRegistrationDetalils = {
                "username": "Roland",
                "password": "123"
            }

            const sandorRegistrationDetails: UserRegistrationDetalils = {
                "username": "Sandor",
                "password": "555kacsa"
            }

            await users.insert(rolandRegistrationDetails);
            await users.insert(sandorRegistrationDetails);
            const numberOfRow = await users.numberOfRow();
            const rolandUser: User | null = await users.getByUsernameAndPassword("Roland","123");
            const sandorUser: User | null = await users.getByUsernameAndPassword("Sandor","555kacsa");
            const wrongPasswordUser: User | null = await users.getByUsernameAndPassword("Sandor","Wrong");
            const wrongUsernameUser: User | null = await users.getByUsernameAndPassword("Wrong","123");
            
            expect(numberOfRow).to.be.equal(2);
            expect(rolandUser).is.not.null;
            expect(rolandUser?.userId).is.equal(0);
            expect(rolandUser?.username).to.be.equal("Roland");
            expect(rolandUser?.queue.length).to.be.equal(0);
            expect(sandorUser).is.not.null;
            expect(sandorUser?.userId).is.equal(1);
            expect(sandorUser?.username).to.be.equal("Sandor");
            expect(sandorUser?.queue.length).to.be.equal(0);
            expect(wrongPasswordUser).is.null;
            expect(wrongUsernameUser).is.null;
        });
    });
    
});