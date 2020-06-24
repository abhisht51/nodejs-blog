const express = require('express');


const { body } = require('express-validator/check');

router = express.Router();

const feedController = require('../controllers/feed');


router.get('/posts', feedController.getPosts);


router.post('/posts', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),

], feedController.createPosts);

router.get('/post/:postID',feedController.getPost);

router.put('/post/:postID',[
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),]
    ,feedController.updatePost);


module.exports = router;
