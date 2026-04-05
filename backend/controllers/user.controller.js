const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'viewer',
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const user = await User.findById(id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
};
