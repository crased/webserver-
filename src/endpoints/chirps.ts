import { NextFunction, Request, Response } from "express";
import express from "express";
import { notFoundError, badRequestError, forbiddenError } from "../middleware/error.js";
import { saveChirp, getChirps, getChirp, deleteChirp, getChirpsByAuthorId } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../middleware/auth.js";
import { config } from "../config.js";


export async function handlerValid(req: Request, res: Response) {
type parameters = {
 body: string;
};

const params: parameters = req.body;
const token = getBearerToken(req);
if (!params.body || params.body.length > 140) {
throw new badRequestError("Chirp is too long. Max length is 140");
}
const userID = validateJWT(token, config.api.jwtSecret)

const banned = ["kerfuffle", "sharbert", "fornax"]
const regex = new RegExp(`\\b(${banned.join('|')})\\b`, 'gi');
const cleanText = params.body.replace(regex, '****');
const chirped = await saveChirp(cleanText, userID)

return res.status(201).json(chirped)
};
  
export async function handlerGetChirps(req: Request, res: Response) {
let authorId = "";
let authorIdQuery = req.query.authorId;
if (typeof authorIdQuery === "string") {
  authorId = authorIdQuery;
} 
let results;
if ( authorId !== "") {
results = await getChirpsByAuthorId(authorId);
} else {
results = await getChirps();
}
if (!results) {
throw new notFoundError("Table doesn't exist")    
}
let orderBy = "";
let orderQuery = req.query.sort;
if (orderQuery === "desc" ) {
results = results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
return res.status(200).json(results);
};

export async function handlerGetChirp(req: Request, res: Response) {
const { chirpId } = req.params;    
const results = await getChirp(chirpId as string);
if (!results) {
return res.status(404).json({ error: "chirp not found" });    
}
return res.status(200).json(results)
};

export async function handlerDeleteChirp(req: Request, res: Response, next: NextFunction) {
try {
const token = getBearerToken(req); 
const { chirpId } = req.params;   
const userId = validateJWT(token, config.api.jwtSecret);
const acc = await getChirp(chirpId as string);
if (!acc) {
throw new forbiddenError("unknown user")
}
if (acc.userId !== userId) {
throw new forbiddenError("user cannot delete chirp")
}
const deleted = await deleteChirp(chirpId as string);
if (!deleted) {
throw new notFoundError("chirp not found")    
}
res.status(204).send(deleted);
} catch (err) {
next(err);
}
}