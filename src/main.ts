import dotenv from "dotenv";
import express from "express";
import { Category } from "./interface";

dotenv.config();

const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

app.use(express.json());

const categories: Category[] = [];

app.get("/", (req, res) => {
  const { id, name } = req.query;
  res.status(200).send({ id, name });
});

app.post("/api/v1/category", (req, res) => {
  const { name, slug, description } = req.body;

  if (!name) {
    res.status(400).send({ message: "Name is required" });
    return;
  }

  if (!slug) {
    res.status(400).send({ message: "Slug is required" });
    return;
  }

  const isNameExists =
    categories.filter(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    ).length > 0;

  if (isNameExists) {
    res.status(400).send({ message: "Name already exists" });
    return;
  }

  const isSlugExists =
    categories.filter(
      (category) => category.slug.toLowerCase() === slug.toLowerCase()
    ).length > 0;

  if (isSlugExists) {
    res.status(400).send({ message: "Slug already exists" });
    return;
  }

  const category: Category = {
    id: categories.length + 1,
    name: name,
    slug: slug,
    description: description,
  };

  categories.push(category);

  res.send(category);
});

app.listen(APP_PORT, () => {
  console.log(`Server is up on port ${APP_PORT}`);
});
