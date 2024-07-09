import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  data_register: {
    type: Date,
    default: Date.now,
  },
  token: String,
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: {type: String, required: true},
  telegram: String,
  telegramId: Number,
  discord: String, 
  role: String,
  balance: Number,
  products: Array,
  orders: Array,
  payments: Array,
  paymentOrders: Array,
})

const User = mongoose.model('User', userSchema);

export default User;