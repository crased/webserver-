import { NextFunction, Request, Response } from "express";
import express from "express";



export async function handlerReadiness(req: Request, res: Response): Promise<void> {
  res.set({'Content-Type': 'text/plain; charset=utf-8'}).status(200).send('OK');  
};

export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction): Promise<void> {
res.on("finish", () => {
if (res.statusCode > 299) {
console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`) 
}
})
next() 
}