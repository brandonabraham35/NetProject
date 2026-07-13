const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { getList, addToList, removeFromList } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const movieSchema = Joi.object({
  id: Joi.alternatives().try(Joi.string(), Joi.number()).required()
}).unknown(true);

router.get('/list/:type', authMiddleware, getList);
router.post('/list/:type', authMiddleware, validateRequest(movieSchema), addToList);
router.delete('/list/:type', authMiddleware, validateRequest(movieSchema), removeFromList);

module.exports = router;
