import express from "express";

const APP_PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  const { id, name } = req.query;
  res.status(200).send({ id, name });
});

app.listen(APP_PORT, () => {
  console.log(`Server is up on port ${APP_PORT}`);
});
