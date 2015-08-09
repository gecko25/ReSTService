'use strict'

/* What is express? */
/* It is a web framework that provides node 
with a lot of neat methods to handle common
functionalities in web application */

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

//Mongoose translates data from mongodb using a model -This is the mongoose model for our book
var Book = require('./models/bookModel');

//For any traffic dealing with /Books, let our BookRouter handle that. Pass it the Book model.
var bookRouter = require('./routes/bookRoutes')(Book);

//starts up our database
var db = mongoose.connect('mongodb://localhost/bookAPI');

var app = express(); //create an instance of express so we can use all the cool functionality it provides:D

//**PORT ASSIGNMENT**//
//Assign a port that our server should listen to in real life this would point to a host
//(i.e mywebsite.com:3000) and anytime a client wanted to do something, our node app is here 
//listening.
port = process.env.PORT || 3000;

//Someone actually listen on the port, please!
app.listen(port, function confirmListening(){
	console.log("Gulp is starting up application... " +"\n" +
				"Listening on port: " + port); 
})

//once loaded, these parsers will look at the req body, locate any JSON objects
//and then attach them to the request object (req.body)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/* MIDDLEWARE HANDLING */
//The use method "mounts the middleware functions" at the path
app.use('/api/books', bookRouter);  //this is the router we created from our bookRoutes module
//app.use('/api/author', authorRouter);


app.get('/', function getRoot(req,res){
	res.send("Welcome to our API"); //sends a message back with response object on a GET request
})


