import express from 'express';
const router = express.Router();
import { isAuthenticated } from './middleware/auth.js';

router.get(`/`, /* isAuthenticated, */ (req,res) => {
  try {
    const user = req.user;
    console.log(req.user);
    //res.status(200).json({user});
    res.render('index', {user});
  } catch ( error ) {
    console.log(error.message);
  }
})
router.get(`/contact`, /* isAuthenticated, */ (req,res) => {
  try {
    const user = req.user;
    console.log(req.user);
    //res.status(200).json({user});
    res.render('contact', {user});
  } catch ( error ) {
    console.log(error.message);
  }
})
router.get(`/info`, /* isAuthenticated, */ (req,res) => {
  try {
    const user = req.user;
    console.log(req.user);
    res.status(200).json({user});
    /* res.render('index', {user}); */
  } catch ( error ) {
    console.log(error.message);
  }
})
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    let response = 'out';
    res.json({response});
  });
});
export default router;