import { UUID, randomUUID } from "node:crypto";

export type AdminKey = UUID;

export class AdminKeyService {
    constructor(private key: AdminKey | null = "123e4567-e89b-12d3-a456-426614174000"){}

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