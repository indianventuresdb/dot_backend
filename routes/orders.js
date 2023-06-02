import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/orders.js';

const router = express.Router();

// Create a new order
router.post('/orders', isAuthenticated, createOrder);

// Get all orders
router.get('/orders', isAuthenticated, getOrders);

// Get a single order by ID
router.get('/orders/:id', isAuthenticated, getOrderById);

// Update an order
router.put('/orders/:id', isAuthenticated, updateOrder);

// Delete an order
router.delete('/orders/:id', isAuthenticated, deleteOrder);

export default router;
