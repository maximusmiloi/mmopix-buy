export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).redirect('/auth/login')
  //res.status(401).json({ message: 'Unauthorized' });
};