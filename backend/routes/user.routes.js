const express = require('express');
const { getUsers, createUser, updateUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);

module.exports = router;
