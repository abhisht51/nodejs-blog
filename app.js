const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use('/images',express.static(path.join(__dirname,'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

app.use('/feed', feedRoutes);
app.use('/auth',authRoutes);
// app.use('/auth', userRoutes);


app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        message:message
    });
});


mongoose.connect('mongodb+srv://abhisht:abhisht@123@nodetest-fbgyn.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true})
    .then(result =>{
        app.listen(8080);
    })
    .catch(err=>console.log(err));
