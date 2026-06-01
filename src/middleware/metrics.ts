import { config } from "../config.js";
import { NextFunction, Request, Response } from "express";


export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
if (config) {
config.api.fileserverHits++;    
}
next()
}

export function printMiddlewareMetrics(req: Request, res: Response) {
res.set("Content-Type", "text/plain; charset=utf-8");
res.send(`Hits: ${config.api.fileserverHits}`)    
}

export function resetMiddlewareMetrics(req: Request, res: Response) {
if (config.api.platform !== "dev") {    
res.status(403).send("Forbidden");
return;
}
config.api.fileserverHits = 0;
res.status(200).end()
}

export function handlerMetrics(req: Request, res: Response) {
res.set("Content-Type", "text/html; charset=utf-8");
res.send(
`<html>
<body>
<h1>Welcome, Chirpy Admin</h1>
<p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
</body>
</html>
`
);
}