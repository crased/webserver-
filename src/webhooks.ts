import { Express } from "express";
import { NextFunction, Request, Response } from "express";
import { getAPIKey, getBearerToken, validateJWT } from "./middleware/auth.js";
import { upgradeUser } from "./db/queries/users.js";
import { badRequestError, notFoundError, unauthorizedError } from "./middleware/error.js";
import { config } from "./config.js";

type parameters = {
"event": string;
"data": {
  "userId": string;  
};
};


export async function handlerUpgradeUser(req: Request, res: Response, next: NextFunction) {
try {
const results = await getAPIKey(req)
if (results !== config.api.polkaKey ) {
throw new unauthorizedError("unauthorized access")  
}
const params = req.body as parameters;
const userId = params.data.userId;

if (params.event !== "user.upgraded") {
return res.status(204).send()
}
const user = await upgradeUser(userId);
if (!user) {
throw new notFoundError("users request could not be completed")    
}
return res.status(204).send()
} catch (err) {
 next(err)   
}
}