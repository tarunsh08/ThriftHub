import SellerProfile from '../prisma/prismaClient.js';

export const authorizeSeller = async (req, res, next) => {
  try {
    const seller = await SellerProfile.findOne({ clerkUserId: req.auth.userId });
    
    if (!seller) {
      return res.status(403).json({ message: 'Seller profile not found' });
    }

    if (!seller.isApproved) {
      return res.status(403).json({ message: 'Seller account not approved yet' });
    }

    // Attach seller ID to request for controllers
    req.auth.sellerId = seller._id;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};