import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products }); // return the products
  } catch (error) {
    console.log("Error getting products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_Products");
    if (featuredProducts) {
      res.json({ products: featuredProducts });
    }
    //  if not inn redis get from db
    // .lean() returns a plain js object instead of mongoose object
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access
    await redis.set("featured_Products", JSON.stringify(featuredProducts));
    res.json({ featuredProducts });
  } catch (error) {
    console.log("Error in getfeaturedProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      await cloudinary.uploader.upload(image, { folder: "products" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error creating product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; //this will get the id from the image
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Error deleting product image:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }

    await product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    res.json({ products }); // return the products
  } catch (error) {
    console.log("Error getting products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const product = await Product.find({ category });
    res.json({ product });
  } catch (error) {
    console.log("Error getting products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await featuredProductproductsCache();
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error getting products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
async function featuredProductproductsCache() {
  try {
    // the Lean() method returns a plain js object instead of mongoose object. this is good for performance

    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_Products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in Update cache function", error.message);
  }
}
