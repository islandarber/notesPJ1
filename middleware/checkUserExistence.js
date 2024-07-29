import User from "../models/users.js";

export const checkUser = async (req, res, next) => {
  const { email, username } = req.body;

  try {
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    console.log('User checked');
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
