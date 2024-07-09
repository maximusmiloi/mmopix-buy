import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middleware/auth.js';
import Game from '../../models/game.js';
import Order from '../../models/order.js';
import Chaptersgold from '../../models/chaptergold.js';
import getPriceG2g from '../../services/parserG2G.js';
import Product from '../../models/product.js';
import User from '../../models/user.js';
import Payment from '../../models/payment.js';
router.get(`/`, isAuthenticated, (req,res) => {
  try {
    const user = req.user;
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    } else {
      return res.render('admin/admin');
    }
  } catch ( error ) {
    console.log(error);
    return res.status(400).json({message: error.message})
  }
})
router.get(`/getgames`, isAuthenticated,  async(req, res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const gameAll = await Game.find();
    const chapterAll = await Chaptersgold.find();
    return res.status(200).json([gameAll, chapterAll]);
  } catch(error) {
    console.log(error);
    return res.status(400).json({message: error.message})
  }
})
router.post('/createnewchapter', isAuthenticated,  async(req,res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const chapterAll = await Chaptersgold.find();
    const name = req.body.values[0][0];
    const region = req.body.values[1][0];
    const findObject = async(array, field1, value1, field2, value2, field3, value3) => {
      return array.find(obj =>
        obj[field1] === value1 &&
        obj[field2] === value2 
      ) || null;
    }
    const hasChapter = await findObject(chapterAll, 'name', name, 'region', region);
    if(hasChapter) {
      return res.status(200).json({message: 'haveChapter'})
    } else {
      const chapter = new Chaptersgold({
        name: name,
        region: region,
        methodDelivery: [],
        options: [],
        type: 'gold',
        state: true,
      })
      chapter.save();
      return res.status(200).json({message: 'success'})
    }
  } catch ( error ) {
    return res.status(400).json({message: error.message})
  }

})

router.post(`/createnewgame`, isAuthenticated, async(req,res) => {
  try {
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const user = req.user;
    const name = req.body.values[0];
    const region = req.body.values[1];
/*     const version = req.body.values[2]; */
    const type = req.body.values[2];
    const gameCheck = await Game.findOne({name: { $in: name }});
    const game = new Game({
      name: name,
      region: region,
/*       version: version, */
      type: type,
      state: true
    })
    if(req.user.role === 'admin') {
      if(gameCheck) {
        return res.status(200).json({message: 'haveAlready'});
      } else {
        game.save();
        return res.status(200).json({message: 'success'});
      }
    } else {
      res.status(200).json({user});
    }
  } catch ( error ) {
    return res.status(400).json({message: error.message})
  }
})
router.post('/editgame', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const _id = req.body.idGame;
    await Game.updateOne({ _id }, { $set: { name: req.body.values[0], region: req.body.values[1], /* version: req.body.values[2], */ type: req.body.values[2]  } })
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.post('/deletegame', isAuthenticated,  async(req, res) => {
  try {
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const _id = req.body.idGame;
    await Game.deleteOne({ _id:  _id})
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.get('/stateGame', async(req,res) => {
  try {
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const _id = req.query.id;
    const state = req.query.state;
    await Game.updateOne({ _id }, { $set: { state: state} })
/*     const _id = req.body.idGame;
    await Game.deleteOne({ _id:  _id}) */
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.get('/statechapter', isAuthenticated,  async(req,res) => {
  try {
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const _id = req.query.id;
    const state = req.query.state;
    await Chaptersgold.updateOne({ _id }, { $set: { state: state} })
/*     const _id = req.body.idGame;
    await Game.deleteOne({ _id:  _id}) */
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})

router.get('/deleteoption', isAuthenticated,  async(req,res) => {
  try {
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const _id = req.query.id;
    const name = req.query.nameoption;
    const chapter = await Chaptersgold.findOne({_id: _id});
    chapter.options.forEach((option, index) => {
      if(option[0][0] ===  name) {
        chapter.options.splice(index, 1);
      }
    })
    chapter.save();
/*     await Chaptersgold.updateOne({ _id }, { $set: { state: state} }) */
/*     const _id = req.body.idGame;
    await Game.deleteOne({ _id:  _id}) */
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.post('/deletechapter', isAuthenticated,  async(req, res) => {
  if(!req.user || req.user.role !== 'admin') {
    return res.redirect('/auth/login');
  }
  try {
    const _id = req.body.idGame;
    await Chaptersgold.deleteOne({ _id:  _id})
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.post('/editchapter', isAuthenticated, async(req, res) => {
  if(!req.user || req.user.role !== 'admin') {
    return res.redirect('/auth/login');
  }
  try {
    const methodsDelivery = req.body.methodsDelivery;
    const options = req.body.optionsArray;
    const _id = req.body.idChapter;
    await Chaptersgold.updateOne({ _id }, { $set: { options: options, methodDelivery: methodsDelivery} })
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.get('/updateprices', isAuthenticated,  async(req, res) => {
  if(!req.user || req.user.role !== 'admin') {
    return res.redirect('/auth/login');
  }
  try {
    const priceUpdate = await getPriceG2g();
    if(priceUpdate == 'success') {
      return res.status(200).json({message: 'success'});
    } else {
      return res.status(200).json({message: 'error'});
    }
    
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.get('/getproducts', isAuthenticated, async(req, res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const products = await Product.find();
    return res.status(200).json({products});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.post('/productorder', isAuthenticated,  async(req,res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    let message;
    const id = req.body.values[0];
    const seller = req.body.values[1];
    const game = req.body.values[2];
    const region = req.body.values[3];
    const server = req.body.values[4];
    const available = req.body.valuesInput[0];
    const price = req.body.valuesInput[1];
    const buyer = req.body.valuesInput[2];
    const method = req.body.valuesInput[3];
    const discription = req.body.valuesInput[4];
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
    if(available.length < 0 || +available === 0 || available === '0') {
      res.status(200).json({message: 'emptyInput'});
    }
    const orders = await Order.findOne();
    const products = await Product.findOne();

    const user = await User.findOne({login: seller});
    if(!orders) {
      for(let product of products.data) {
/*   */
        if(product.login == seller && product.name[0] == game && product.id == id) {
          if(+product.available >= +available) {
            product.available = (+product.available - (+available)) + '';
          }
          else {
            return res.status(200).json({message: 'limit'})
          }
        }
      }
      products.markModified('data');
      products.save();

      const order = new Order({
        id: 0,
        data: [
          {
            id: 0,
            seller: seller,
            game: game,
            region: region,
            server: server,
            type: 'gold',
            available: available,
            price: price,
            status: 'new',
            buyer: buyer,
            method: method,
            discription: discription,
            date: formattedDate,
          }
        ]
      })
      order.save();
      const hasOrder = user.orders.some(order => order === order.id);
      if(hasOrder) {
        return res.status(200).json({message: 'hasOrder'});
      }
      user.orders = [order.id];
      user.save();
    } else {
      for(let product of products.data) {
        if(product.login == seller && product.name[0] == game && product.id == id) {
          if(+product.available >= +available) {
            product.available = (+product.available - (+available)) + '';
          }
          else {
            return res.status(200).json({message: 'limit'})
          }
        }
      }
      products.markModified('data');
      products.save();
      orders.id = orders.id + 1;
      orders.data.push({
        id: orders.id + 1,
        seller: seller,
        game: game,
        region: region,
        server: server,
        type: 'gold',
        available: available,
        price: price,
        status: 'new',
        buyer: buyer,
        method: method,
        discription: discription,
        date: formattedDate,
      });
      orders.markModified('data');
      orders.save();
      user.orders.push(orders.id + 1);
      user.save();
    }
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.get('/getorders', isAuthenticated, async(req, res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }

    const orders = await Order.findOne()
    const ordersData = orders.data;
    return res.status(200).json({ordersData});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.get('/getpayments', isAuthenticated,  async(req,res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }

    const payments = await Payment.findOne();
    if(!payments || payments.length < 1) {
      return res.status(200).json({payments: null});
    } else {
      return res.status(200).json({payments});
    }
    
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
});
router.post('/changestatuspayment', isAuthenticated,  async(req,res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const status = req.body.selectValue;
    const user = req.body.user;
    const id = req.body.id;
    const value = req.body.value;
    const payments = await Payment.findOne();
    const userInfo = await User.findOne({login: user})
    if(status === 'canceled') {
      payments.orders.forEach(order => {
        if(+order.id === +id && order.user === user) {
          if(order.status === 'canceled') {
            order.status = order.status;
          } else {
            order.status = 'canceled';
          }
        }
      })
      payments.markModified('orders');
      payments.save();
      await User.updateOne({ login: user }, { $set: { balance: userInfo.balance + (+value)} });
    }
    if(status === 'done') {
      payments.orders.forEach(order => {
        if(+order.id === +id && order.user === user) {
          order.status = 'done';
        }
      })
      payments.markModified('orders');
      payments.save();
    }
    if(status === 'inwork') {
      payments.orders.forEach(order => {
        if(+order.id === +id && order.user === user) {
          order.status = 'inwork';
        }
      })
      payments.markModified('orders');
      payments.save();
    }
    
/*     const status = req.query.select;
    const payments = await Payment.findOne();
    if(status === 'inwork') {

    } */
/*     if(!payments || payments.length < 1) {
      return res.status(200).json({payments: null});
    } else {
      return res.status(200).json({payments});
    } */
      return res.status(400).json({message: 'success'})
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
});
router.post('/changestatusorder', isAuthenticated,  async(req,res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const status = req.body.status;
    const seller = req.body.seller;
    const id = req.body.id;
    const server = req.body.server;
    const order = await Order.findOne();
    const sellerInfo = await User.findOne({login: seller});
    order.data.forEach(async order => {
      if(+order.id === +id && order.seller[0] === seller && order.server[0] === server) {
        if(order.status === 'canceled' && order.status === 'done') {
          if(status === 'done') {
            order.status = status;
            sellerInfo.balance = sellerInfo.balance + (+order.price);
            sellerInfo.save();
          }
          if(status === 'canceled') {
            order.status = status;
/*             sellerInfo.balance = sellerInfo.balance + (+order.price);
            sellerInfo.save(); */
          }
        } else {
          if(status === 'inwork') {
            const requestTelegramBot = await fetch(`https://api.telegram.org/MmopixStore_bot:7392220371:AAFFVCrssnxR_-_LhrAbSlv4CiQNF_fbJGE`);
            const resTelegramBot = await requestTelegramBot.json();
            console.log(resTelegramBot);
            order.status = status;
          }
          order.status = status;
        }
      }
    })
    order.markModified('data');
    order.save();
/*     if(status === 'canceled') {
      payments.orders.forEach(order => {
        if(+order.id === +id && order.user === user) {
          if(order.status === 'canceled') {
            order.status = order.status;
          } else {
            order.status = 'canceled';
          }
        }
      })
      payments.markModified('orders');
      payments.save();
      await User.updateOne({ login: user }, { $set: { balance: userInfo.balance + (+value)} });
    } */

    return res.status(400).json({message: 'success'})
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
});
router.post('/paymentsave', async(req,res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const newPayments  = req.body.arrayAdd;
    const updatePayments = req.body.arrayUpdate;
    const payments = await Payment.findOne();
    if(!payments || payments.methods.length < 1) {
      const payment = new Payment({
        id: 0,
        methods: newPayments,
      })
      payment.save();
    } else {
      updatePayments.forEach(element => {
        payments.methods.forEach(method => {
          if(method[0] == element[0]) {
            method[1] = element[1];
          }
        })
      })
      if(newPayments.length >= 1) {
        newPayments.forEach(el => {
          payments.methods.push(el);
        })
      }
      payments.markModified('methods');
      payments.save()
    }
    
/*     if(!payments || payments.length < 1) {
      return res.status(200).json({payments: null});
    } else {
      return res.status(200).json({payments});
    } */
    return res.status(200).json({message: 'success'});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
router.get('/info', async(req, res) => {
  try{
    if(!req.user || req.user.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    const users = await User.find();
    return res.status(200).json({users});
  } catch(error) {
    return res.status(400).json({message: error.message})
  }
})
export default router;

