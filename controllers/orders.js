import { Orders } from '../models/orders.js';
import { Products } from "../models/products.js"
import { Users } from "../models/users.js"


// Create a new order
export const createOrder = async (req, res) => {
  try {
    const order = new Orders(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    !orders ?
      res.status(404).json({ message: "Order not found" }) :
      res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Orders.findByIdAndRemove(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const ordersForSeller = async (req, res) => {
  try {
    const orders = await Orders.find();
    const ordersWithAllDetails = orders.map(async (item) => {
      const product = await Products.findById(item.productId);
      const username = await Users.findById(item.userId)
      item.productId = product
      item.userId = username
      return item
    })
    res.status(200).json(ordersWithAllDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};
