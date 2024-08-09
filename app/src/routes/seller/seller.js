import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { isAuthenticated } from '../middleware/auth.js';
import Game from '../../models/game.js';
import Payment from '../../models/payment.js';
import Chaptersgold from '../../models/chaptergold.js';
import Product from '../../models/product.js';
import User from '../../models/user.js';
import Order from '../../models/order.js';


router.get(`/`, isAuthenticated, (req,res) => {
  try {
    const user = req.user;
    /* console.log(req.user); */
    //res.status(200).json({user});
    if(req.user.role === 'seller') {
      return res.render('seller/seller', {user});
    } else {
      return res.redirect('auth/noauth');
    }
  } catch ( error ) {
    console.log(error.message);
  }
})
router.get('/getchapters', isAuthenticated, async(req, res) => {
  try {
    const user = req.user;
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const chapters = await Chaptersgold.find();
    const orders = await Order.findOne();
    if(!orders) {
      const order = new Order({
        id: 0,
        data: [],
      })
      order.save()
      const ordersUser = order.data.filter(order => {
        if(order.seller[0] === user.login){
          return order;
        }
      })
      const chaptersTrue = chapters.filter(chapter => {
        if(chapter.state == true) {
          return chapter;
        }
      })
      return res.status(200).json({chapters: chaptersTrue, ordersUser})
    }
    const ordersUser = orders.data.filter(order => {
      if(order.seller[0] === user.login){
        return order;
      }
    })
    const chaptersTrue = chapters.filter(chapter => {
      if(chapter.state == true) {
        return chapter;
      }
    })
    return res.status(200).json({chapters: chaptersTrue, ordersUser})
  } catch ( error ) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.post('/saveproduct', isAuthenticated,  async(req,res) => {
  const userData = req.user;
  try{
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    let message;
    console.log(req.body)
    const orderData = req.body.values;
    const gameName = orderData[0];
    const gameRegion = orderData[1];
    const gameServer = orderData[2];
    const avaible = req.body.available;
    const methods = req.body.methodsArray;

    if(!userData.telegram && userData.telegram.length < 1 && !userData.telegram.startsWith('@') && !userData.discord && userData.discord.length < 1 && !userData.discord.startsWith('@')) {
      message = 'notContant';
      console.log(message)
      return res.status(200).json({message});
    }
    if(avaible.length < 1) {
      message = 'emptyInput';
      return res.status(200).json({message});
    }
    if(`${+avaible}` == 'NaN') {
      message = 'notNumber';
      return res.status(200).json({message});
    }

    const products = await Product.findOne();
    const user = await User.findOne({login: req.user.login});

    if(!products || products.length < 1) {
      const product = new Product({
        id: 0,
        data: [],
      })
      await product.save(); 
    } else {
      const hasOrder = products.data.filter(product => {
        if(
          product.login === req.user.login &&
          product.name[0] === gameName[0] &&
          product.region[0] === gameRegion[0] &&
          product.server[0] === gameServer[0]
        ) {
          return product;
        }
      })
      if(hasOrder.length > 0) {
        message = 'hasOrder';
        return res.status(200).json({message})
      }
      user.products.push(products.id + 1);
      await User.updateOne({ login: req.user.login }, { $set: { products: user.products} })
      const data = {
        id: products.id + 1,
        login: req.user.login,
        name: gameName,
        region: gameRegion,
        server: gameServer,
        methods: methods,
        type: 'gold',
        available: avaible,
        status: 'sale',
        state: true,
      }
      products.id = products.id + 1;
      products.data.push(data);
      const admin = await User.findOne({role: 'admin'});
      if(admin.telegramId && admin.telegramId > 0 && admin.token) {
        const requestTelegramBot = await fetch(`https://api.telegram.org/bot7392220371:AAFFVCrssnxR_-_LhrAbSlv4CiQNF_fbJGE/sendMessage?chat_id=${admin.telegramId}&text=Пользователь ${req.user.login} ВЫСТАВИЛ новый товар Сервер ${gameServer}. Количество - ${avaible}`);
        const resTelegramBot = await requestTelegramBot.json();
        console.log(resTelegramBot);
      }
      await products.save();
    }
/*     const gameCheck = await Game.findOne({name: { $in: name }});
    const game = new Game({
      name: name,
      region: region,
      type: type,
      state: true
    }) */

    return res.status(200).json({message: 'success'});
/*       console.log(req.body);
      if(req.body.input){} */
  } catch ( error ) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.get('/getorders', isAuthenticated, async(req, res) => {
  const user = req.user;
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const userNumberproducts = req.user.products;
    const products = await Product.findOne();
    if(!products) {
      const product = new Product({
        id: 0,
        data: []
      })
      product.save();
      const productsUser = product.data.filter(product => {
        for(let number of userNumberproducts) {
          if(number === product.id && product.login === req.user.login) {
            return product;
          }
        }
      })
      return res.status(200).json(productsUser);
    }
    const productsUser = products.data.filter(product => {
      for(let number of userNumberproducts) {
        if(number === product.id && product.login === req.user.login) {
          return product;
        }
      }
    })
    return res.status(200).json(productsUser);
  } catch ( error ) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
  
})
router.get('/getorderone', isAuthenticated,  async(req, res) => {
  let message;
  const user = req.user;
  try{
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const idProduct = req.query.id;
    const products = await Product.findOne();
    const product = products.data.find(el => el.id == +idProduct)
    return res.status(200).json(product);
  } catch ( error ) {
    console.log(error);
    return res.status(400).json({message: error.message})
  }
})
router.get('/deleteuserproduct', isAuthenticated,  async(req, res) => {
    try {
      if(!req.user || req.user.role !== 'seller') {
        return res.redirect('auth/noauth');
      }
      
      let message;
      console.log(req.query.id);
      const user = await User.findOne({login: req.user.login});
      user.products = user.products.filter(product => product !== +req.query.id);
      user.markModified('products');
      user.save();

      const products = await Product.findOne();
      console.log(products)
      console.log(products.data)
      products.data = products.data.filter(product => product.id !== +req.query.id );
      products.markModified('data');
      console.log(products.data)
      products.save();
      return res.status(200).json({message: 'success'});
    } catch ( error ) {
      console.log(error)
      return res.status(400).json({message: error.message})
    }
})
router.post('/edituserproduct', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    let message;
    const productData = req.body;
/*     const user = await User.findOne({login: req.user.login});
    console.log(user.orders);
    user.orders = user.orders.filter(order => order !== +req.query.id);
    console.log(user.orders);
    user.save(); */
  
    const products = await Product.findOne();
    for(let product of products.data) {
      if(product.id === productData.dataEdit.id && product.login === productData.dataEdit.login) {
        product.available = productData.available;
        
      }
    }
    products.markModified('data');
    products.save();
    const admin = await User.findOne({role: 'admin'});
    if(admin.telegramId && admin.telegramId > 0 && admin.token) {
      const requestTelegramBot = await fetch(`https://api.telegram.org/bot7392220371:AAFFVCrssnxR_-_LhrAbSlv4CiQNF_fbJGE/sendMessage?chat_id=${admin.telegramId}&text=Пользователь ${productData.dataEdit.login} ИЗМЕНИЛ КОЛИЧЕСТВО в товаре Сервер - ${productData.dataEdit.id}. Количество - ${productData.available}`);
      const resTelegramBot = await requestTelegramBot.json();
      console.log(resTelegramBot);
    }
    /* const order = orders.data.find(el => el.id == orderId); */
    return res.status(200).json({message: 'success'});
  } catch ( error ) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.get('/stateproduct', isAuthenticated,  async (req, res) => {
  try{
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const id = req.query.id;
    const state = req.query.state;
    const products = await Product.findOne();
    for(let product of products.data) {
      if(product.id === +id && product.login === req.user.login) {
        product.state = state === 'false' ? false : true;
      }
    }
    products.markModified('data');
    products.save();
    return res.status(200).json({message: 'success'});
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.get('/userinfo', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const user = req.user;
    const paymentInfo = await Payment.findOne();
    const courseRUB = paymentInfo.courseRUB;
    if(paymentInfo && paymentInfo.orders) {
      const paymentMethods = paymentInfo.methods;
      const paymentOrdersUser = paymentInfo.orders.filter(order => order.user === req.user.login );
      return res.status(200).json({user, paymentMethods, paymentOrdersUser, courseRUB});
    } else {
      return res.status(200).json({user});
    }
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
});
router.post('/paymentsave', isAuthenticated, async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const user = req.user;
    const value = req.body.arrayPayments;
    await User.updateOne({ login: user.login }, { $set: { payments: value} })
    return res.status(200).json({message: 'success'});
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.post('/orderpayment', isAuthenticated, async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const user = req.user;
    const value = req.body.value;
    const method = req.body.methodValue;
    let requisites = user.payments.find(pay => pay[0] === method);
    console.log(requisites)
    if(requisites) {
      
      if(requisites[1].length < 3) {
        return res.status(200).json({message: 'requisitesEmpty'});
      }
      requisites = requisites[1];
    }
    if(!requisites) {
      return res.status(200).json({message: 'notFoundMethod'});
    }
    if(+value > user.balance) {
      return res.status(200).json({message: 'limitBalance'});
    }
    const payment = await Payment.findOne();
    const admin = await User.findOne({role: 'admin'});
    const date = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formattedDate = date.toLocaleString('ru-RU', options).replace(',', '');
    if(!payment.orders || payment.orders.length < 1) {
      payment.idOrder = 0;
      payment.orders = [{
        user: user.login,
        status: 'inwork',
        dateOrder: formattedDate,
        method: method,
        value: value,
        requisites: requisites,
        id: 0,
      }]
      payment.save();
      await User.updateOne({ login: user.login }, { $set: { balance: user.balance - value} });
      if(admin.telegramId && admin.telegramId > 0 && admin.token) {
        const requestTelegramBot = await fetch(`https://api.telegram.org/bot7392220371:AAFFVCrssnxR_-_LhrAbSlv4CiQNF_fbJGE/sendMessage?chat_id=${admin.telegramId}&text=ВЫПЛАТА: Пользователь ${user.login} заказал выплату на сумму ${value} $`);
        const resTelegramBot = await requestTelegramBot.json();
        console.log(resTelegramBot);
      }
      return res.status(200).json({message: 'success'});
    } else {
      payment.idOrder = payment.idOrder + 1;
      payment.orders.push({
        user: user.login,
        status: 'inwork',
        dateOrder: formattedDate,
        method: method,
        value: value,
        requisites: requisites,
        id: payment.idOrder + 1,
      })
      payment.save();
      await User.updateOne({ login: user.login }, { $set: { balance: user.balance - value} });
      if(admin.telegramId && admin.telegramId > 0 && admin.token) {
        const requestTelegramBot = await fetch(`https://api.telegram.org/bot7392220371:AAFFVCrssnxR_-_LhrAbSlv4CiQNF_fbJGE/sendMessage?chat_id=${admin.telegramId}&text=ВЫПЛАТА: Пользователь ${user.login} заказал выплату на сумму ${value} $`);
        const resTelegramBot = await requestTelegramBot.json();
        console.log(resTelegramBot);
      }
      return res.status(200).json({message: 'success'});
    }
/*     await User.updateOne({ login: user.login }, { $set: { payments: value} }) */
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.post('/profilessave', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const user = req.user;
    const userData = await User.findOne({login: req.user.login});
    const telegram = req.body.telegram;
    const discord = req.body.discord;
    const password = req.body.password;
    const twopassword = req.body.twopassword;


    if(telegram.length > 1 && telegram.startsWith('@')) {
      await User.updateOne({ login: user.login }, { $set: { telegram: telegram} });
    } else {
      userData.telegram;
    }
    if(discord.length > 1 && discord.startsWith('@')) {
      await User.updateOne({ login: user.login }, { $set: { discord: discord} });
    } else {
      console.log(`НЕТУ: ${userData.discord}`);
      console.log(discord)
      userData.discord;
    }

    if(password.length > 5 && twopassword.length > 5 && password === twopassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      userData.password = hashedPassword;
    }
    userData.save();
    if(telegram.length > 0 && !telegram.startsWith('@')) {
      return res.status(200).json({message: 'wrongText'});
    }
    if(discord.length > 0 && !discord.startsWith('@')) {
      return res.status(200).json({message: 'wrongText'});
    }
    return res.status(200).json({message: 'success'});
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.post('/acceptorder', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const id = req.body.id;
    const seller = req.body.seller;
    const server = req.body.server;
    const order = await Order.findOne();
    const admin = await User.findOne({role: 'admin'});
    order.data.forEach(async order => {
      if(+order.id === +id && order.seller[0] === seller && order.server[0] === server) {
        if(order.status !== 'canceled' && order.status !== 'done') {
          order.status = 'inwork';
          if(admin.telegramId && admin.telegramId > 0 && admin.token) {
            const requestTelegramBot = await fetch(`https://api.telegram.org/bot7392220371:AAFFVCrssnxR_-_LhrAbSlv4CiQNF_fbJGE/sendMessage?chat_id=${admin.telegramId}&text=Пользователь ${seller} принял заказ с номером - ${id}. Сервер ${server}.`);
            const resTelegramBot = await requestTelegramBot.json();
            console.log(resTelegramBot);
          }
        }
      }
    })
    order.markModified('data');
    order.save();
    return res.status(200).json({message: 'success'});
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.post('/doneorder', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const id = req.body.id;
    const seller = req.body.seller;
    const server = req.body.server;
    const proof = req.body.proof;
    const order = await Order.findOne();
    order.data.forEach(order => {
      if(+order.id === +id && order.seller[0] === seller && order.server[0] === server) {
        if(order.status !== 'canceled' && order.status !== 'done') {
          order.status = 'check';
          order.proof = proof;
        }
      }
    })
    order.markModified('data');
    order.save();
    return res.status(200).json({message: 'success'});
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.post('/deniedorder', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const id = req.body.id;
    const seller = req.body.seller;
    const server = req.body.server;
    /* const proof = req.body.proof; */
    const order = await Order.findOne();
    
    order.data.forEach(order => {
      if(+order.id === +id && order.seller[0] === seller && order.server[0] === server) {
        order.status = 'canceled';
      }
    })
    order.markModified('data');
    order.save();
    const admin = await User.findOne({role: 'admin'});
    if(admin.telegramId && admin.telegramId > 0 && admin.token) {
      const requestTelegramBot = await fetch(`https://api.telegram.org/bot7392220371:AAFFVCrssnxR_-_LhrAbSlv4CiQNF_fbJGE/sendMessage?chat_id=${admin.telegramId}&text=Пользователь ${seller} ОТКЛОНИЛ заказ с номером - ${id}. Сервер ${server}.`);
      const resTelegramBot = await requestTelegramBot.json();
      console.log(resTelegramBot);
    }
    return res.status(200).json({message: 'success'});
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
router.get('/checktoken', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'seller') {
      return res.redirect('auth/noauth');
    }
    const login = req.user.login;
    const userInfo = await User.findOne({login: login})
    if(!userInfo.token || userInfo.token < 1) {
      const token = userInfo.id + (crypto.randomBytes(16).toString('hex'));
      userInfo.token = token;
      userInfo.save();
      return res.status(200).json({token: token});
    } else if (userInfo.token) {
      return res.status(200).json({token: userInfo.token});
    } else {
      return res.status(200).json({message: 'error'});
    }
  } catch(error) {
    console.log(error)
    return res.status(400).json({message: error.message})
  }
})
export default router;

