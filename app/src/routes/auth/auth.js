import express from 'express';
import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import passport from '../../config/passport.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();

router.get('/registration', async(req, res) => {
  try {
    return res.status(200).render('auth/reg');
  } catch(error) {
    res.status(400).json({message: 'pageNotFound'});
  }
})
router.post('/register', async(req, res) => {
  try {
    console.log(req.body)
    const { login, password, email } = req.body;
    const users = await User.find();
    const existingUser = await User.findOne({ $or: [{ login }, { email }] });
    if (existingUser) {
      return res.status(200).json({ message: 'userHaveAlready' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      id: users.length + 1,
      login,
      email,
      password: hashedPassword,
      role: 'seller',
      data_register: Date.now(),
      telegram: '',
      discord: '',
      balance: 0,
    });
    await newUser.save();
    return res.status(201).json({ message: 'userRegistered' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get(`/`, async(req,res) => {
  try {
    return res.status(200).redirect('auth/login');
  } catch(error) {
    res.status(400).json({message: 'pageNotFound'});
  }
})
router.get(`/login`, async(req,res) => {
  try {
    return res.status(200).render('auth/login');
  } catch(error) {
    res.status(400).json({message: 'pageNotFound'});
  }
})
/* router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      console.log('Authentication failed');
      return res.redirect('/auth/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      let response = 'success';
      console.log('Authentication successful, redirecting...');
      return res.json({response});
    });
  })(req, res, next);
}); */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      let message = 'incorrectPassword';
      console.log('Authentication failed: incorrectPassword');
      return res.json({message});
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      let message = 'success';
      
      console.log('Authentication successful, redirecting...');
      return res.json({message});
    });
  })(req, res, next);
});
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;