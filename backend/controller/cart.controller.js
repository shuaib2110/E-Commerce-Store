import Product from "../models/product.model.js";

export const grtcartproducts = async (req, res) => {
  try {
    const Product = await Product.find({
      _id: { $in: req.user.cartItem },
    });

    // add quantity for each product
    const cartItem = Product.map((product) => {
      const item = req.user.cartItem.find(
        (cartItem) => cartItem.id === product._id
      );
      return {
        ...product.toJson(),
        quantity: item.quantity,
      };
    });

    res.json({ cartItem });
  } catch (error) {
    console.log("Error getting cart products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingitem = user.cartItem.find((item) => item.id === productId);

    if (existingitem) {
      existingitem.quantity += 1;
    } else {
      user.cartItem.push({ id: productId, quantity: 1 });
    }

    await user.save();

    res.json(user.cartItem);
  } catch (error) {
    console.log("Error adding to cart:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItem = [];
    } else {
      user.cartItem = user.cartItem.filter((item) => item.id !== productId);
    }
    await user.save();

    res.json(user.cartItem);
  } catch (error) {
    console.log("Error removing from cart:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingitem = user.cartItem.find((item) => item.id === productId);

    if (existingitem) {
      if (quantity === 0) {
        user.cartItem = user.cartItem.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItem);
      }

      existingitem.quantity = quantity;
      await user.save();
      return res.json(user.cartItem);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error updating quantity:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
