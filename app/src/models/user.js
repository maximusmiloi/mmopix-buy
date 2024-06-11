import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  data_register: {
    type: Date,
    default: Date.now,
  },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: {type: String, required: true},
  telegram: String,
  discord: String, 
  role: String,
  balance: Number
})

const User = mongoose.model('User', userSchema);

export default User;