import express from "express";
import { handlerReadiness, middlewareLogResponses } from "./endpoints/health.js";
import { handlerValid, handlerGetChirps, handlerGetChirp, handlerDeleteChirp } from "./endpoints/chirps.js";
import { middlewareMetricsInc, printMiddlewareMetrics, handlerMetrics } from "./middleware/metrics.js";
import { errorHandler } from "./middleware/error.js";
import { handlerCreateUser, handlerLoginUser, handlerUpdateUser } from "./endpoints/users.js"
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerReset } from "./endpoints/users.js";
import { checkPasswordHash, createHashPassword, makeRefreshToken } from "./middleware/auth.js";
import { handlerRefresh, handlerRevokeToken } from "./endpoints/refresh.js";
import { handlerUpgradeUser } from "./webhooks.js";

const migrationClient = postgres(config.db.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);


const PORT = 8080
const app = express();

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(express.json());
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.get("/api/healthz", async (req, res, next) => {
try {
 await handlerReadiness(req, res);
} catch (err) {
 next(err) 
}
});


app.post("/api/chirps", async (req, res, next) => {
try {
 await handlerValid(req, res); 
} catch (err) {
 next(err)
}
});
app.get(`/api/chirps/:chirpId`, handlerGetChirp)

app.get("/api/chirps", handlerGetChirps)
app.post("/api/users", handlerCreateUser)
app.post("/api/login", handlerLoginUser)
app.post("/api/revoke", handlerRevokeToken)
app.post("/api/refresh", handlerRefresh)
app.put("/api/users", handlerUpdateUser)
app.delete("/api/chirps/:chirpId", handlerDeleteChirp)

app.post("/api/polka/webhooks", handlerUpgradeUser)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
