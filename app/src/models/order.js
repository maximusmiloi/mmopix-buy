import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  id: Number,
  data: Array,
})

const Order = mongoose.model('Order', orderSchema);

export default Order;