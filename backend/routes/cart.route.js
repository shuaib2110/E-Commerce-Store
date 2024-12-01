import express from "express";
import { addToCart, grtcartproducts, removeFromCart, updateQuantity } from "../controller/cart.controller.js";



const router = express.Router();



router.get("/", grtcartproducts);
router.post("/", addToCart);
router.delete("/", removeFromCart);
router.put("/:id", updateQuantity);

export default router;