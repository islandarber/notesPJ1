import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  content : {
    type: String,
    required: true,
  },  
  });

const Note = mongoose.model('Note', noteSchema);
export default Note;