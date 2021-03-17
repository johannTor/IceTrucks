import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let truck = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  menu: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: Object,
    required: false
  },
  tags: {
    type: Array,
    required: true
  }
});

mongoose.models = {};

let Truck = mongoose.model('Truck', truck);
export default Truck;