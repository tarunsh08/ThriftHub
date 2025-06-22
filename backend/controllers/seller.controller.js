import SellerProfile from '../prisma/schema.prisma';
import Product from '../prisma/schema.prisma';

// @desc    Register as a seller
// @route   POST /api/sellers/register
// @access  Private
export const registerSeller = async (req, res) => {
  try {
    const { storeName, bio, shippingPolicies, returnPolicies } = req.body;
    const clerkUserId = req.auth.userId;

    // Check if already registered
    const existingSeller = await SellerProfile.findOne({ clerkUserId });
    if (existingSeller) {
      return res.status(400).json({ message: 'You are already registered as a seller' });
    }

    const seller = await SellerProfile.create({
      clerkUserId,
      storeName,
      bio,
      shippingPolicies,
      returnPolicies,
      isApproved: false // Admin needs to approve
    });

    res.status(201).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller profile
// @route   GET /api/sellers/profile
// @access  Private
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await SellerProfile.findOne({ clerkUserId: req.auth.userId })
      .populate('products', 'title price images')
      .populate('orders', 'status totalAmount');

    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new product
// @route   POST /api/sellers/products
// @access  Private (Seller)
export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, size, images } = req.body;
    const seller = await SellerProfile.findOne({ clerkUserId: req.auth.userId });

    if (!seller) {
      return res.status(403).json({ message: 'Seller profile not found' });
    }

    const product = await Product.create({
      seller: seller._id,
      title,
      description,
      price,
      category,
      condition,
      size,
      images
    });

    // Add product to seller's collection
    seller.products.push(product._id);
    await seller.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/sellers/products/:productId
// @access  Private (Seller)
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    // Verify seller owns this product
    const product = await Product.findOne({ 
      _id: productId,
      seller: req.auth.sellerId // Set by authorizeSeller middleware
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }

    Object.assign(product, updates);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other controller methods follow similar patterns...