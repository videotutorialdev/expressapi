import dotenv from "dotenv";
import express from "express";
import { Category } from "./interface";
import { dataCategories } from "./data/category";

dotenv.config();

const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

app.use(express.json());

const categories: Category[] = dataCategories;

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

  res.status(201).send(category);
});

app.get("/api/v1/category", (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 5);
  const keywords = req.query.q as string;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  let filters = categories;

  if (keywords) {
    filters = categories.filter((cat) => {
      return cat.name.includes(keywords) || cat.description.includes(keywords);
    });
  }

  const result = filters.slice(startIndex, endIndex);

  res.send(result);
});

app.get("/api/v1/category/:categoryId", (req, res) => {
  const categoryId = +req.params.categoryId;
  const indexOfCategory = categories.findIndex((cat) => cat.id === categoryId);

  if (indexOfCategory === -1) {
    res.status(404).send({ message: "Category not found!" });
    return;
  }
  res.send(categories[indexOfCategory]);
});

app.put("/api/v1/category/:categoryId", (req, res) => {
  const categoryId = +req.params.categoryId;
  const indexOfCategory = categories.findIndex((cat) => cat.id === categoryId);

  if (indexOfCategory === -1) {
    res.status(404).send({ message: "Category not found!" });
    return;
  }

  const { name, slug, description } = req.body;

  if (!name) {
    res.status(400).send({ message: "Name is required" });
    return;
  }

  if (!slug) {
    res.status(400).send({ message: "Slug is required" });
    return;
  }

  const categorySource = categories[indexOfCategory];

  const isNameExists =
    categories.filter(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== categorySource.id
    ).length > 0;

  if (isNameExists) {
    res.status(400).send({ message: "Name already exists" });
    return;
  }

  const isSlugExists =
    categories.filter(
      (category) =>
        category.slug.toLowerCase() === slug.toLowerCase() &&
        category.id !== categorySource.id
    ).length > 0;

  if (isSlugExists) {
    res.status(400).send({ message: "Slug already exists" });
    return;
  }

  categorySource.name = name;
  categorySource.slug = slug;
  categorySource.description = description;

  categories[indexOfCategory] = categorySource;

  res.send(categorySource);
});

app.listen(APP_PORT, () => {
  console.log(`Server is up on port ${APP_PORT}`);
});
