import { NextFunction, Request, Response } from "express";
import express from "express";
import { getBearerToken, makeJWT } from "../middleware/auth.js";
import { revokeRefreshToken, refreshToken } from "../db/queries/refresh.js";
import { unauthorizedError } from "../middleware/error.js";
import { config } from "../config.js";

export async function handlerRevokeToken(req: Request, res: Response) {
const token = getBearerToken(req);
await revokeRefreshToken(token);
res.status(204).send();
}

export async function handlerRefresh(req: Request, res: Response) {
const token = getBearerToken(req);
const result = await refreshToken(token);
if (!result) {
throw new unauthorizedError("revoked token");    
}
const accessToken = makeJWT(result.user.id, 3600, config.api.jwtSecret);
res.status(200).json({ token: accessToken});
};

