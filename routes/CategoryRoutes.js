const Category = require("../models/Category");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { category } = req.body;

  try {
    // Check if product exists
    const categoryExists = await Category.findOne({ category });
    if (categoryExists) {
      return res.status(409).json({ error: "Category already exists." });
    }

    // Create a new product with the uploaded images
    const newPost = new Category({
      category,
    });

    // Save the new product and respond
    const post = await newPost.save();

    res.status(201).json({
      id: post._id,

      category: post.category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to post category",
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Category.find().sort({ createdAt: -1 });
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
    const products = await Category.findById(id);
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
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  try {
    const categoryProduct = await Category.findById(id);
    if (!categoryProduct) {
      throw new error("category not found");
    }
    categoryProduct.category = category || categoryProduct.category;
    await categoryProduct.save();

    res.status(201).json({
      message: "Update successful",
      categoryProduct,
    });
  } catch (error) {
    res.status(401).json({
      message: "Failed to update",
      error,
    });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const classes = await Category.findByIdAndDelete(req.params.id);
    if (classes) {
      res.status(200).json({ message: "This Category has been deleted" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
