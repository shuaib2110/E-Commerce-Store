import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";
import { getcoupon } from "../controller/coupon.controller.js";
import { validateCoupon } from "../controller/coupon.controller.js";


const router = express.Router();

router.get("/", protectRoute, getcoupon)
router.get("/validate", protectRoute, validateCoupon)


export default router;