import { UUID, randomUUID } from "node:crypto";

type AdminKey = UUID;

export class AdminKeyService {
    constructor(private key: AdminKey | null = null){}

    async get(){
        return this.key;
    }

    async generateNew(){
        this.key = randomUUID();
        return this.key;
    }

    async delete(){
        this.key = null;
    }
}