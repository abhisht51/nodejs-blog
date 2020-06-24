const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find().then(
        posts=>{
            res.status(200).json({
                message:"Post fetcheed",
                posts:posts
            })
        }
    ).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
 };


exports.createPosts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        creator: { name: 'Abhisht Singh' },
        imageUrl: "images/download.jpeg",
    });

    post.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Post created successfully",
            post: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

}

exports.getPost = (req, res, next) => {
    const postID = req.params.postID;
    Post.findById(postID)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find the post');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Post fetched',
                post: post
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


exports.updatePost = (req,res,next)=>{
    const postID = req.params.postID;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    console.log(imageUrl);

        if(req.file){
        imageUrl = req.file.path;
    }
    if(!imageUrl){
        const error = new Error("No file has been picked up");
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postID).then(
        post=>{
            if(!post){
                const error = new Error('Could not find the post');
                error.statusCode = 404;
                throw error;
            }
            if(imageUrl !== post.imageUrl){
                clearImage(post.imageUrl);

            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save();
            }).then(result=>{
                res.status(202).json({
                    message:"Post edit successful",
                    post:result
                });
            }                
            ).catch(err => {
        if (!err.statusCode) {
            console.log("bahot dukh");
            err.statusCode = 500;
        }
        next(err);
    });
};

const clearImage = filePath=>{
    filePath = path.join(__dirname,'..',filePath);
    fs.unlink(filePath,err=>{
        console.log(err);
    })
}