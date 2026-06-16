import { NextFunction, Request, Response } from "express";
import express from "express";
import { createUser, findUser, login, saveRefreshToken, updateUser, upgradeUser } from "../db/queries/users.js";
import { db } from "../db/index.js";
import { config } from "../config.js";
import {NewUser, users } from "../db/schema.js";
import { checkPasswordHash, createHashPassword, getBearerToken, makeJWT, makeRefreshToken, validateJWT } from "../middleware/auth.js";
import { notFoundError, unauthorizedError } from "../middleware/error.js";
import { not } from "drizzle-orm";
import { hash } from "crypto";


export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
const { email, password } = req.body;
try {
const pass = await createHashPassword(password)
const newUser = await createUser({ email, hashedPassword: pass }); 
const { hashedPassword, ...userResponse } = newUser
res.status(201).json(userResponse)
} catch (err) {
next(err);
}
};

export async function handlerLoginUser(req: Request, res: Response, next: NextFunction) {
try {    
const result = await findUser(req.body.email)
if (!result) {
throw new unauthorizedError("incorrect email or password")
}
const matches = await checkPasswordHash(req.body.password, result.hashedPassword)
if (!matches) {
throw new unauthorizedError("incorrect email or password")
}
const token = makeJWT(result.id, 3600, config.api.jwtSecret)
const resp = await login(req.body.email)
const refreshedToken = makeRefreshToken();
const newToken = await saveRefreshToken(result.id , refreshedToken)
const { hashedPassword, ...userResponse } = resp;
res.status(200).json({...userResponse, token, refreshToken: refreshedToken});
} catch (err) {
next(err)    
}

}

export async function handlerReset(req: Request, res: Response) {
if (config.api.platform !== "dev") {    
res.status(403).send("Forbidden");
return;
}
config.api.fileserverHits = 0;
await db.delete(users);
res.status(200).end()
}


export async function handlerUpdateUser(req: Request, res: Response, next: NextFunction) {
try {
const token = getBearerToken(req);    
const userId = validateJWT(token, config.api.jwtSecret)
const { email, password } = req.body;
if (!email) {
throw new unauthorizedError("invalid email or password")    
}
if (!password) {
throw new unauthorizedError("invalid email or password") 
}
const hashed = await createHashPassword(password);
const user = await updateUser(email, hashed, userId)
const { hashedPassword, ...userResponse } = user;
res.status(200).json({...userResponse});
} catch (err) {
next(err)
}};

