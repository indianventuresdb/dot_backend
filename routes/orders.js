import express from 'express';
// import { isAuthenticated } from '../middlewares/auth.js';
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/orders.js';

const router = express.Router();

// Create a new order
router.post('/orders',  createOrder);

// Get all orders
router.get('/orders',  getOrders);

// Get a single order by ID
router.get('/orders/:id',  getOrderById);

// Update an order
router.put('/orders/:id',  updateOrder);

// Delete an order
router.delete('/orders/:id',  deleteOrder);

export default router;
