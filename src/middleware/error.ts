import { NextFunction, Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
console.log(err);
if (err instanceof badRequestError) {
return res.status(400).json({"error": err.message})    
}
else if (err instanceof unauthorizedError) {
return res.status(401).json({"error": err.message})    
}
else if (err instanceof forbiddenError) {
return res.status(403).json({"error": err.message})    
}
else if (err instanceof notFoundError) {
return res.status(404).json({"error": err.message})    
}
else {
return res.status(500).json({"error": "Internal Server Error"}) 
}
}

export class badRequestError extends Error {
    constructor(message: string) {
       super(message)    
     }
}

export class unauthorizedError extends Error {
    constructor(message: string) {
      super(message)    
     }
}

export class forbiddenError extends Error {   
    constructor(message: string) {
      super(message)    
    }
}

export class notFoundError extends Error {
    constructor(message: string) {
      super(message)
    }
}

