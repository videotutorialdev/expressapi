import dotenv from "dotenv";
import express from "express";

dotenv.config();

const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  const { id, name } = req.query;
  res.status(200).send({ id, name });
});

app.listen(APP_PORT, () => {
  console.log(`Server is up on port ${APP_PORT}`);
});
