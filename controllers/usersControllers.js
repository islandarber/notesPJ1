import User from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretToken = process.env.SECRET_TOKEN;

const generateToken = (data) => {
  return jwt.sign(data, secretToken, { expiresIn: '1h' });
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try { 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({email: user.email, id: user._id })

    res.json({ user, token });
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const registerUser = async (req, res) => {
  const {username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User.create({username, email, password: hashedPassword });
    return res.status(201).json(newUser);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const {id} = req.user;
  try {
    const data = await User.findById(id).populate('notes');
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.json(data);
    }
  } catch (error) {
    res.sendStatus(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const {id} = req.params;
  try {
    const data = await User.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.json(data);
    }
  } catch (error) {
    res.sendStatus(500).json({ message: error.message });
  }
};