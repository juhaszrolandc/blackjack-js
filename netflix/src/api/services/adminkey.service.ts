import { UUID, randomUUID } from "node:crypto";

type AdminKey = UUID;

class AdminKeyService {
    constructor(private key: AdminKey | null = null){}

    async get(){
        return this.key;
    }

    async generateNew(){
        this.key = randomUUID();
    }

    async delete(userId: number){
        this.key = null;
    }
}