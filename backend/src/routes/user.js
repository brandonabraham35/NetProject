const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { getList, addToList, removeFromList, getSearchHistory, clearSearchHistory, updateProgress, removeProgress, getProfiles, createProfile, getNotifications } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// The frontend passes the full TMDB movie object in the body to add/remove from the list.
// The controller specifically checks for `req.body.id`.
const movieSchema = Joi.object({
  id: Joi.alternatives().try(Joi.string(), Joi.number()).required()
}).unknown(true);

router.get('/list/:type', authMiddleware, getList);
router.post('/list/:type', authMiddleware, validateRequest(movieSchema), addToList);
router.delete('/list/:type', authMiddleware, validateRequest(movieSchema), removeFromList);

router.get('/search-history', authMiddleware, getSearchHistory);
router.delete('/search-history', authMiddleware, clearSearchHistory);

const progressSchema = Joi.object({
  movieId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  progress: Joi.number().required()
}).unknown(true);

router.post('/progress', authMiddleware, validateRequest(progressSchema), updateProgress);
router.delete('/progress/:movieId', authMiddleware, removeProgress);

const profileSchema = Joi.object({
  name: Joi.string().required(),
  avatar: Joi.string().optional().allow(''),
  language: Joi.string().optional(),
  preferences: Joi.object().optional()
});

router.get('/profiles', authMiddleware, getProfiles);
router.post('/profiles', authMiddleware, validateRequest(profileSchema), createProfile);

router.get('/notifications', authMiddleware, getNotifications);

module.exports = router;
