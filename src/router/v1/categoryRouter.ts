import { Router } from "express";
import { dataCategories } from "../../data/category";
import { Category } from "../../interface";

const categories: Category[] = dataCategories;

const categoryRouter = Router();

categoryRouter.post("/", (req, res) => {
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

categoryRouter.get("/", (req, res) => {
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

  res.send({ data: result, totalData: filters.length });
});

categoryRouter.get("/:categoryId", (req, res) => {
  const categoryId = +req.params.categoryId;
  const indexOfCategory = categories.findIndex((cat) => cat.id === categoryId);

  if (indexOfCategory === -1) {
    res.status(404).send({ message: "Category not found!" });
    return;
  }
  res.send(categories[indexOfCategory]);
});

categoryRouter.put("/:categoryId", (req, res) => {
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

categoryRouter.delete("/:categoryId", (req, res) => {
  const categoryId = +req.params.categoryId;
  const indexOfCategory = categories.findIndex((cat) => cat.id === categoryId);

  if (indexOfCategory === -1) {
    res.status(404).send({ message: "Category not found!" });
    return;
  }

  categories.splice(indexOfCategory, 1);

  res.status(200).send({ message: "Ok" });
});

export { categoryRouter };
