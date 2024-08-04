import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  id: Number,
  courseRUB: Number,
  methods: Array,
  idOrder: Number,
  orders: Array, 
})

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;