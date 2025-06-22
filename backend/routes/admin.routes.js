import express from 'express';
import {
  getDashboardStats,
  manageUser,
  getAllUsers,
  manageProduct,
  getAllOrders,
  updateOrder,
  manageSeller,
  getAdminLogs,
  updateSiteSettings
} from '../controllers/admin.controller.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { requireAdmin, checkPermission } from '../middleware/admin.middleware.js';
// import { prisma } from '../lib/prisma.js';
const router = express.Router();

router.use(ClerkExpressRequireAuth());
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', checkPermission('manageUsers'), getAllUsers);
router.route('/users/:userId')
  .get(checkPermission('manageUsers'), manageUser)
  .put(checkPermission('manageUsers'), manageUser)
  .delete(checkPermission('manageUsers'), manageUser);

// Product Management
router.get('/products', checkPermission('manageProducts'), manageProduct);
router.route('/products/:productId')
  .put(checkPermission('manageProducts'), manageProduct)
  .delete(checkPermission('manageProducts'), manageProduct);

// Order Management
router.get('/orders', checkPermission('manageOrders'), getAllOrders);
router.put('/orders/:orderId', checkPermission('manageOrders'), updateOrder);

// Seller Approvals
router.get('/sellers', checkPermission('manageUsers'), manageSeller);
router.put('/sellers/:sellerId/approve', checkPermission('manageUsers'), manageSeller);

// Site Management
router.get('/logs', checkPermission('manageContent'), getAdminLogs);
router.put('/settings', checkPermission('manageContent'), updateSiteSettings);

export default router;