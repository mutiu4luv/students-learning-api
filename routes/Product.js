const router = require("express").Router();
const Product = require("../models/Product");

const cloudinary = require("../utils/Cloudinary");

router.post("/create", async (req, res) => {
  const {
    name,
    // slug,
    description,
    price,
    category,
    brand,
    quantity,
    sold,
    images, // Array of images
    color,
    tags,
  } = req.body;

  try {
    // Check if product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
      return res.status(409).json({ error: "Product already exists." });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (image, index) => {
        const result = await cloudinary.uploader.upload(image, {
          folder: "products", // Optional: store images in a specific folder in Cloudinary
          public_id: `${brand}-${brand}-${index}`, // Use slug and brand for a unique identifier
          resource_type: "image",
        });

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      })
    );

    // Create a new product with the uploaded images
    const newPost = new Product({
      name,
      // slug,
      description,
      price,
      category,
      brand,
      quantity,
      sold,
      images: uploadedImages, // Store array of { public_id, url }
      color,
      tags,
    });

    // Save the new product and respond
    const post = await newPost.save();

    res.status(201).json({
      id: post._id,
      name: post.name,
      // slug: post.slug,
      description: post.description,
      price: post.price,
      category: post.category,
      brand: post.brand,
      quantity: post.quantity,
      sold: post.sold,
      images: post.images, // Return images array
      color: post.color,
      tags: post.tags,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to post product",
      error: err.message,
    });
  }
});

router.post("/upload", async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    category,
    brand,
    quantity,
    sold,
    images,
    color,
    tags,
  } = req.body;
  try {
    const productExists = Product.findOne({ name });
    if (productExists) {
      return res.status(409).json({ error: "Product already exists." });
    }
    const result = await cloudinary.uploader.upload({
      file: images,
      fileName: `${req.body.name}-${req.body.brand}.jpg`,
    });
    const newPost = new Product({
      name: name,
      slug: slug,
      description: description,
      price: price,
      category: category,
      brand: brand,
      quantity: quantity,
      sold: sold,
      images: result.url,
      color: color,
      tags: tags,
    });

    //save post and respond
    const post = await newPost.save();

    res.status(200).json({
      id: post.id,
      name: post.name,
      slug: post.slug,
      description: post.description,
      price: post.price,
      category: post.category,
      brand: post.brand,
      quantity: post.quantity,
      sold: post.sold,
      images: post.images,
      color: post.color,
      tags: post.tags,
    });
  } catch (err) {
    res.status(401).json({
      message: "Failed to post data",
      err,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/ss", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Fetch Successful",
      products,
    });
  } catch (err) {
    res.status(401).json({
      message: "Failed to fetch data",
      err,
    });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findById(id);
    res.status(200).json({
      message: "Fetch Successful",
      products,
    });
  } catch (err) {
    res.status(401).json({
      message: "Failed to fetch data",
      err,
    });
  }
});
module.exports = router;
