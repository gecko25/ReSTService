/* What is express? */
/* It is a web framework that provides node 
with a lot of neat methods to handle common
functionalities in web application */

var express  = require('express'),
    mongoose = require('mongoose');

var app = express(); //create an instance of express so we can use all the cool functionality it provides:D
var db = mongoose.connect('mongodb://localhost/bookAPI');

//Mongoose translates data from mongodb using a model
var Book = require('./models/bookModel');


//**PORT ASSIGNMENT**//
//Assign a port that our server should listen to
//I think in real life this would point to a host
//(i.e mywebsite.com:3000) and anytime a client 
//wanted to do something, our node app is here 
//listening.

port = process.env.PORT || 3000;

//*HANDLING ROUTES*/

//We are going to create a router for a 
//particular URL. 
var bookRouter = express.Router()

//Anytime a request for this URL
//occurs it gets passed to this router
//The route method returns a single instance
//of the particular route which then we can
//use to handle HTTP verbs
//http://expressjs.com/4x/api.html#router.route
bookRouter.route('/Books')
	.get(function(req, res){
		//var responseJson = {hello: "This is my api"};
		Book.find(function(err, books){
			if(err)
				res.send(err);
			else
				res.json(books);

		});
		//res.json(responseJson);
	});


//the use method "mounts the middleware functions" at the path
//http://expressjs.com/guide/using-middleware.html
app.use('/api', bookRouter);

//Another way to crete routes -- application level middleware
//The '/' indicates the root of our site. 
//What should we do when a client sends a req..?
//..We send a message back with response object!

app.get('/', function getRoot(req,res){
	res.send("Welcome to our API");
})

//Someone actually listen on the port, please!
app.listen(port, function confirmListening(){
	/*console.log("Starting up application... " +"\n" +
				"Listening on port: " + port); */
	console.log("Gulp is starting up application... " +"\n" +
				"Listening on port: " + port); 
})
