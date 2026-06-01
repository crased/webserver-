import { NextFunction, Request, Response } from "express";
import express from "express";
import { createUser, findUser, login } from "../db/queries/users.js";
import { db } from "../db/index.js";
import { config } from "../config.js";
import {NewUser, users } from "../db/schema.js";
import { checkPasswordHash, createHashPassword } from "../middleware/auth.js";
import { notFoundError, unauthorizedError } from "../middleware/error.js";
import { not } from "drizzle-orm";

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
const resp = await login(req.body.email)
const { hashedPassword, ...userResponse } = resp;
res.status(200).json(userResponse);
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
