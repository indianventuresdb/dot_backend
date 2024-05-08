const { default: mongoose } = require("mongoose");
const { CartProducts } = require("../models/cart");
const { Products } = require("../models/products");
const { Users } = require("../models/users");

const add_To_Cart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Retrieve the product from the database
    const product = await Products.findById(productId);

    // Check if the product exists
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found." });
    }

    // Check if the available quantity is sufficient
    if (product.quantity <= 0) {
      return res
        .status(400)
        .json({ status: false, message: "Product out of stock." });
    }

    // Check if the product is already in the cart
    let existing = await CartProducts.findOne({ userId, productId });

    if (!existing) {
      // If the product is not in the cart, add it with quantity 1
      const add = await CartProducts.create({ userId, productId, quantity: 1 });
      if (!add) {
        return res
          .status(301)
          .json({ status: false, message: "Product not Updated in your Cart" });
      }

      return res
        .status(201)
        .json({ status: true, message: "Product Added to your cart." });
    }

    // Check if increasing the quantity will exceed the available quantity
    if (existing.quantity >= product.quantity) {
      return res.status(400).json({
        status: false,
        message: "Maximum available quantity already in cart.",
      });
    }

    // Increment the quantity in the cart
    existing.quantity += 1;
    await existing.save();

    return res.status(200).json({
      status: true,
      message: "Product Quantity Updated in your cart.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const getAllItems = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Check if the userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid userId provided." });
    }

    // Check if the user exists in the database
    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    // Fetch cart items for the user and populate product details
    const cartItems = await CartProducts.find({ userId }).populate("productId");
    if (!cartItems || cartItems.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No Cart Items Found" });
    }

    // If everything is successful, return the cart items
    res.status(200).json({ status: true, cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;

    // Check if cartItemId is provided
    if (!cartItemId) {
      return res
        .status(400)
        .json({ status: false, message: "Cart item ID is required." });
    }

    // Find the cart item by ID and delete it
    const deletedCartItem = await CartProducts.findByIdAndDelete(cartItemId);

    // Check if the cart item exists
    if (!deletedCartItem) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found." });
    }

    // If deletion is successful, return a success message
    res
      .status(200)
      .json({ status: true, message: "Cart item deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const decreseItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if userId and productId are provided
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ status: false, message: "userId and productId are required." });
    }

    // Find the cart item and decrease its quantity by 1
    const updatedCartItem = await CartProducts.findOneAndUpdate(
      { userId, productId },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    // Check if the cart item exists
    if (!updatedCartItem) {
      return res
        .status(404)
        .json({
          status: false,
          message: "Cart item not found.",
          updatedCartItem,
        });
    }

    // If quantity becomes 0 after decrement, delete the cart item
    if (updatedCartItem.quantity === 0) {
      await CartProducts.findByIdAndDelete(updatedCartItem._id);
      return res.status(200).json({ status: true, message: "Cart item deleted successfully." });
    }

    // If everything is successful, return the updated cart item
    res.status(200).json({ status: true, updatedCartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { decreseItem };


module.exports = { add_To_Cart, deleteFromCart, getAllItems, decreseItem };
