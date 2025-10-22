const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const { chat } = require('../controllers/chatbotController');

const validateChatRequest = [
    body('message', 'Message is required and cannot be empty.')
        .trim()
        .notEmpty()
        .escape(),
];

// @route   POST api/chatbot/chat
// @desc    Send a message to the chatbot
// @access  Public
router.post('/chat', validateRequest(validateChatRequest), chat);

module.exports = router;