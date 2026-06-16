import * as argon2 from "argon2";
import jwt from "jsonwebtoken"
import { notFoundError } from "./error.js"; 
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import crypto from 'crypto';
import { unauthorizedError } from "./error.js";

export async function createHashPassword(password: string): Promise<string> {
return argon2.hash(password);
};

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
return argon2.verify(hash, password)    
}


export function makeJWT(userID: string, expiresIn: number, secret: string): string {
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
const iat = Math.floor(Date.now() / 1000)
const obj: payload = {
"iss": "chirpy",
"sub": userID,
"iat": iat,
"exp": iat + expiresIn,
};
const token = jwt.sign(obj, secret);
return token
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded;
  try {
    decoded = jwt.verify(tokenString, secret);
  } catch (err) {
    throw new unauthorizedError("invalid token");
  }
  return decoded.sub as string;
}


export function getBearerToken(req: Request): string {
const head = req.get('Authorization')
if (!head) {
throw new unauthorizedError("bearer token not found")
}
const auth = head.split(" ");
return auth[1];
};

export function makeRefreshToken() {
const byte = crypto.randomBytes(32);
return byte.toString('hex');
}

export async function getAPIKey(req: Request) {
const head = req.get('Authorization')
if (!head) {
throw new unauthorizedError("key not found")
}
const key = head.split(" ");
if (key[0] !== "ApiKey") {
throw new  unauthorizedError("user does not have permisson access keys")
}
return key[1];
};


