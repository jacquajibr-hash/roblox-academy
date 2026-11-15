
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Tu dois être connecté."
    });
  }

  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Connexion nécessaire."
      });
    }

    if (!allowedRoles.includes(req.session.role)) {
      return res.status(403).json({
        success: false,
        message: "Tu n'as pas la permission."
      });
    }

    next();
  };
}
