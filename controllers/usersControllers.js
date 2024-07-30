import User from '../models/users.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const secretToken = process.env.secretToken;

const generateToken = (data) => {
  return jwt.sign(data, secretToken, { expiresIn: '1h' });
};

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

    const token = generateToken({ email: user.email, id: user._id });
    res.json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.user; // Assuming req.user contains the authenticated user's ID
  try {
    const data = await User.findById(id).populate('notes');
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.json(data);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.json(data);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = generateToken({ id: user._id });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.myEmail,
        pass: process.env.myPassword,
      },
    });

    let mailOptions = {
      from: process.env.myEmail,
      to: email,
      subject: 'Reset Password',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      https://noteskite.onrender.com/reset/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const sendConfirmationEmail = async (email) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.myEmail,
      pass: process.env.myPassword,
    },
  });

  let mailOptions = {
    from: process.env.myEmail,
    to: email,
    subject: 'Password Updated Successfully',
    text: `Your password has been updated successfully. If you did not request this change, please contact our support immediately.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent:', info.response);
    }
  });
};

export const passwordResetConfirm = async (req, res) => {
  const { token, password } = req.body;

  // Validate reset token and find user
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
  }

  // Hash new password and save it
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined; // Clear the reset token
  user.resetPasswordExpires = undefined; // Clear the expiration date
  await user.save();
  await sendConfirmationEmail(user.email);

  res.status(200).json({ message: 'Password has been successfully reset' });
};