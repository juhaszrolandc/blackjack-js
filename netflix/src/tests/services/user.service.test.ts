import { expect } from 'chai';
import { UserService, User, UserRegistrationDetalils } from '../../api/services/user.service';

describe('User session service', function () {
    const users: UserService = new UserService();

    beforeEach(async () => {
        await users.clearDatabase();
    });

    it('Insert -> getByUsernameAndPassword', async () => {
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