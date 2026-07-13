const express = require('express');
const router = express.Router();
const { getList, addToList, removeFromList } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/list/:type', authMiddleware, getList);
router.post('/list/:type', authMiddleware, addToList);
router.delete('/list/:type', authMiddleware, removeFromList);

module.exports = router;
