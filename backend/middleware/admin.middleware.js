import Admin from '../prisma/schema.prisma';

export const requireAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ clerkUserId: req.auth.userId });
    
    if (!admin) {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }

    req.admin = admin; // Attach admin profile to request
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Admin verification failed',
      error: error.message 
    });
  }
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin.permissions[permission]) {
      return res.status(403).json({
        success: false,
        message: `Missing permission: ${permission}`
      });
    }
    next();
  };
};