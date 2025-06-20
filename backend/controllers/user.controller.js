import User from '../models/user.model.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // Get user ID from Clerk auth
    const userId = req.auth.userId;
    
    const user = await User.findOne({ clerkUserId: userId })
      .select('-password')
      .populate('wishlist')
      .populate('cart.items.product');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { name, phone, address } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { productId } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other controller methods follow similar pattern...