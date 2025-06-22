
import User from '../prisma/schema.prisma';
import Product from '../prisma/schema.prisma';
import Order from '../prisma/schema.prisma';
import Seller from '../prisma/schema.prisma';
import Admin from '../prisma/schema.prisma';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      orders: await Order.countDocuments(),
      revenue: await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      pendingSellers: await Seller.countDocuments({ isApproved: false })
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message 
    });
  }
};

// @desc    Manage users
// @route   GET/PUT/DELETE /api/admin/users/:userId
// @access  Private/Admin
export const manageUser = async (req, res) => {
  try {
    const { userId } = req.params;

    switch (req.method) {
      case 'GET':
        const user = await User.findById(userId)
          .select('-password')
          .populate('orders');
        return res.json({ success: true, user });

      case 'PUT':
        const updatedUser = await User.findByIdAndUpdate(
          userId, 
          req.body, 
          { new: true }
        ).select('-password');
        return res.json({ success: true, user: updatedUser });

      case 'DELETE':
        await User.findByIdAndDelete(userId);
        // Add Clerk API call to delete user from auth system
        return res.json({ success: true, message: 'User deleted' });

      default:
        return res.status(400).json({ success: false, message: 'Invalid method' });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'User management error',
      error: error.message 
    });
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await User.find()
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments();

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users',
      error: error.message 
    });
  }
};

// @desc    Manage products
// @route   GET/PUT/DELETE /api/admin/products/:productId
// @access  Private/Admin
export const manageProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    switch (req.method) {
      case 'GET':
        const products = await Product.find()
          .populate('seller', 'storeName')
          .sort({ createdAt: -1 });
        return res.json({ success: true, products });

      case 'PUT':
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          { $set: req.body },
          { new: true }
        );
        return res.json({ success: true, product: updatedProduct });

      case 'DELETE':
        await Product.findByIdAndDelete(productId);
        return res.json({ success: true, message: 'Product deleted' });

      default:
        return res.status(400).json({ success: false, message: 'Invalid method' });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Product management error',
      error: error.message 
    });
  }
};

// Other controller methods follow similar patterns...