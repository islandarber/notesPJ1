import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String
  },
  content : {
    type: String,
    required: true,
  },  
  isDeleted: {
    type: Boolean,
    default: false,
  },
  color : {
    type: String,
    default: '#fff',
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  });

const Note = mongoose.model('Note', noteSchema);
export default Note;