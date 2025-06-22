import express from 'express';
import {
  registerSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerOrders,
  updateOrderStatus,
  getSellerStats
} from '../controllers/seller.controller.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { authorizeSeller } from '../middleware/authorizeSeller.js';

const router = express.Router();

// Apply Clerk authentication to all seller routes
router.use(ClerkExpressRequireAuth());

// Seller Registration (First-time setup)
router.post('/register-seller', registerSeller);

// Seller Profile Management
router.route('/profile')
  .get(getSellerProfile)
  .put(updateSellerProfile);

// Product Management
router.route('/products')
  .get(getSellerProducts)
  .post(authorizeSeller, addProduct);

router.route('/products/:productId')
  .put(authorizeSeller, updateProduct)
  .delete(authorizeSeller, deleteProduct)

// Order Management
router.get('/orders', authorizeSeller, getSellerOrders);
router.put('/orders/:orderId/status', authorizeSeller, updateOrderStatus);

// Analytics
router.get('/stats', authorizeSeller, getSellerStats);

export default router;