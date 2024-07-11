import mongoose from "mongoose";
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    unique: true,
  },
  password : {
    type: String,
    required: true,
  },
  email : {
    type: String,
    required: true,
    match : [emailRegex, 'Please fill a valid email address'],
  },
  notes : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
  }],
});

const User = mongoose.model('User', userSchema);
export default User;