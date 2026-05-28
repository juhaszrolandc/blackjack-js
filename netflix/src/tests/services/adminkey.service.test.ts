import { expect } from 'chai';
import { AdminKeyService } from '../../api/services/adminKey.service';
import { UUID } from 'node:crypto';

describe('Adminkey service', function () {
    const adminKey = new AdminKeyService();

    describe('Integration tests', () => {
        it('Generate -> Get -> Delete -> Get', async () => {
            const newKey: UUID = await adminKey.generateNew();
            const retrievedKey: UUID | null = await adminKey.get();
            await adminKey.delete();
            const keyAfterDelete: UUID | null = await adminKey.get();

            expect(newKey).is.not.null;
            expect(newKey).to.equal(retrievedKey);
            expect(keyAfterDelete).is.null;
        });

        it('Generate -> Generate -> Get', async () => {
            const generatedKeyFirst: UUID = await adminKey.generateNew();
            const generatedKeySecond: UUID = await adminKey.generateNew();
            const gettedKey: UUID | null = await adminKey.get();

            expect(generatedKeySecond).to.equal(gettedKey);
            expect(generatedKeyFirst).not.to.equal(generatedKeySecond);
        });

        it('Deleted -> Get', async () => {
            await adminKey.delete();
            const gettedKey: UUID | null = await adminKey.get();

            expect(gettedKey).to.be.null;
        });
    });
    
});