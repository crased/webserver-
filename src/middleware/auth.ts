import * as argon2 from "argon2";

export async function createHashPassword(password: string): Promise<string> {
return argon2.hash(password);
};

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
return argon2.verify(hash, password)    
}