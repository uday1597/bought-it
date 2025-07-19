import express from 'express';
const router = express.Router();
import { createOrder, getOrderById, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/myorders', protect, getMyOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);

export default router;
