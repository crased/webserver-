import { Request, Response } from "express";
import express from "express";
import { notFoundError, badRequestError } from "../middleware/error.js";
import { saveChirp, getChirps, getChirp } from "../db/queries/chirps.js";


export async function handlerValid(req: Request, res: Response) {
type parameters = {
 body: string;
 userId: string
};

const params: parameters = req.body;
if (!params.body || params.body.length > 140) {
throw new badRequestError("Chirp is too long. Max length is 140");
}
if (!params.userId) {
throw new notFoundError("User is not found");
}
const banned = ["kerfuffle", "sharbert", "fornax"]
const regex = new RegExp(`\\b(${banned.join('|')})\\b`, 'gi');
const cleanText = params.body.replace(regex, '****');
const chirped = await saveChirp(cleanText, params.userId)

return res.status(201).json(chirped)
};
  
export async function handlerGetChirps(req: Request, res: Response) {
const results = await getChirps();
if (!results) {
throw new notFoundError("Table doesn't exist")    
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