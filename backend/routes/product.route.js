import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  deleteProduct,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controller/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// only admin can get all products
router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category", getProductsByCategory);
router.get("/recommended", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/", protectRoute, adminRoute, deleteProduct);

// 2:01:54

export default router;

