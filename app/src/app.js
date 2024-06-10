import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
const port = 85;
//console.log(process.env.PORT)
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const URL = "mongodb://127.0.0.1:27017/mmopixbuy";

mongoose  
  .connect(URL, {
/*     useNewUrlParser: true,
    useUnifiedTopology: true, */
  })
  .then(() =>  console.log('Connect to MongoDB'))
  .catch((err) => { console.log(`DB connction error: ${err}`)});
app.use(session({
  secret: '4324JIFNBEWIJ421421',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('public', { 'Content-Type': 'application/javascript' }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

app.listen(port, (err) => {
  err ? console.log(`Error to listen port ${port}: ${err}`) :console.log(`Server connect. PORT: ${port}`);
});