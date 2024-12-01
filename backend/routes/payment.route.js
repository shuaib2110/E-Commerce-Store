import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { createCheckoutSession } from "../controller/payment.controller";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    let totalAmount = 0;

    const lineitems = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe wants u to format of cents, convert to cents => $10.00 => $1000
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
      };
    });

    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await createCheckoutSession({
      payment_method_types: ["card"],
      line_items: lineitems,
      mode: "payment",
      success_url:
        `${process.env.CLINET_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLINET_URL}/purchase-cance`,
    });
  } catch (error) {}
});

export default router;
