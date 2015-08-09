'use strict'

//Mongoose translates data from mongodb using a model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bookModel = new Schema({
    title: {
        type: String
    },
    author: {type: String},
    genre: {type: String},
    read: {type: Boolean, default:false}
});


//Were going to load this model into mongoose 
//& call it 'Book'

//We have a new model (a new schema) call Book
//Lets return this book model so that app.js we 
//can have an instance of that book model
module.exports= mongoose.model('Book', bookModel);