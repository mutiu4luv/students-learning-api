const Cart = require("../models/Cart");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { products, cartTotal, totalAfterDiscount, User } = req.body;
  const productlist = products.map((item) => ({
    count: item.count,
    color: item.color,
    product: item.product,
    price: item.price,
  }));
  try {
    const cartItems = await Cart.create({
      cartTotal: cartTotal,
      totalAfterDiscount: totalAfterDiscount,
      User: User,
      products: productlist,
    });
    cartItems.save();
    res.status(201).json({
      message: "Succesful",
      cartItems,
    });
  } catch (error) {
    res.status(406).json({
      message: "Failed",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Cart.find().sort({ createdAt: -1 });
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
    const products = await Cart.findById(id);
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
