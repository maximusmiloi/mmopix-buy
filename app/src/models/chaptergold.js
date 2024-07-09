import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const chaptergoldSchema = new Schema({
  name: String,
  region: String,
/*   version: String, */
  type: String,
  methodDelivery: Array,
/*   variant: Array, */
  options: Array,
  state: Boolean,
})
  
const Chaptergold = mongoose.model('Chaptergold', chaptergoldSchema);

export default Chaptergold;