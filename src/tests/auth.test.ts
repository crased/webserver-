import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, checkPasswordHash, createHashPassword, getAPIKey } from "../middleware/auth.js";   
import { config } from "../config.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await createHashPassword(password1);
    hash2 = await createHashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

});



