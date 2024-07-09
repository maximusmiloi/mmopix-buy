import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: Array,
  region: Array,
/*   version: Array, */
  type: Array,
  state: Boolean,
})

const Game = mongoose.model('Game', gameSchema);

export default Game;