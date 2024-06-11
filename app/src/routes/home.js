import express from 'express';
const router = express.Router();
import { isAuthenticated } from './middleware/auth.js';

router.get(`/`, /* isAuthenticated, */ (req,res) => {
  try {
    console.log(req.user)
    res.render('index'/* , {bots, orders} */);
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