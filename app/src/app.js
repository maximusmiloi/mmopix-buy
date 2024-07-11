import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import flash from 'connect-flash';
import auth from './routes/auth/auth.js';
import home from './routes/home.js';
import seller from './routes//seller/seller.js';
import admin from './routes/admin/admin.js';
import history from 'connect-history-api-fallback';
import etag from 'etag';

import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import serveStatic from 'serve-static';
import fs from 'fs';
import { fileURLToPath } from 'url';
dotenv.config();
const port = process.env.PORT;
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
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/* app.use('/', ) */
app.use('/', home)
app.use('/auth', auth);
app.use('/seller', seller);
app.use('/admin', admin);

app.use(history());
app.use(express.static('public'));
app.use((req, res, next) => {
  const filePath = path.join(__dirname, 'public', req.url);
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      res.setHeader('Last-Modified', stats.mtime.toUTCString());
    }
    next();
  });
});
app.use(serveStatic(path.join(__dirname, 'public'), {
  maxAge: '30d',
  etag: true,
  setHeaders: (res, path) => {
    const stat = fs.statSync(path);
    res.setHeader('Last-Modified', stat.mtime.toUTCString());
  }
}));
/* app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=2592000');
  res.setHeader('ETag', etag(req.path));
  next();
}); */
app.use(express.static('public', {
   maxAge: '30d',
   etag: true,
   lastModified: true, 
  }
));
/* app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=2592000');
  res.setHeader('ETag', 'W/"' + new Date().getTime() + '"');
  next();
}); */
app.listen(port, (err) => {
  err ? console.log(`Error to listen port ${port}: ${err}`) :console.log(`Server connect. PORT: ${port}`);
});