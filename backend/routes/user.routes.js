import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserAdmin
} from '../controllers/user.controller.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Apply Clerk authentication middleware to all routes
router.use(ClerkExpressRequireAuth());

// User Profile Routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUser);

// Wishlist Routes
router.route('/wishlist')
  .get(getUserWishlist)
  .post(addToWishlist);

router.delete('/wishlist/:itemId', removeFromWishlist);

// Cart Routes
router.route('/cart')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.delete('/cart/:itemId', removeFromCart);

// Admin-only Routes
router.get('/admin/users', authorizeAdmin, getAllUsers);
router.get('/admin/users/:id', authorizeAdmin, getUserById);
router.put('/admin/users/:id', authorizeAdmin, updateUser);
router.delete('/admin/users/:id', authorizeAdmin, deleteUserAdmin);

export default router;