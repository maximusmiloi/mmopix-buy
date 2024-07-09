import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: Number,
  data: Array,
})

const Product = mongoose.model('Product', productSchema);

export default Product;