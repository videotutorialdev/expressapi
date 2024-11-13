import { Router } from "express";
import { categoryRouter } from "./v1/categoryRouter";

const v1Router = Router();

v1Router.use("/category", categoryRouter);

export { v1Router };
