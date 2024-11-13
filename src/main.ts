import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { v1Router } from "./router/v1";

const hashPassword = (pass: string) =>
  crypto.createHash("sha256").update(pass).digest("hex");

const passA = hashPassword("testing");
const passB = hashPassword("testing");

console.log(passA);
console.log(passA === passB);

dotenv.config();

const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const { id, name } = req.query;
  res.status(200).send({ id, name });
});

app.use("/api/v1", v1Router);

app.listen(APP_PORT, () => {
  console.log(`Server is up on port ${APP_PORT}`);
});
