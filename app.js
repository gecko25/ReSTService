/* What is express? */
/* It is a web framework that provides node 
with a lot of neat methods to handle common
functionalities in web application */

var express  = require('express'),
    mongoose = require('mongoose');

var app = express(); //create an instance of express so we can use all the cool functionality it provides:D

//starts up our database
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
		

		/*
		var query = req.query;
		NOTE--> http://localhost:8000/api/books?genre=Historical%20Fiction
		Mongoose takes the '?genre=X' format and translates into a json object
			{
				genre: Historical Fuction
			}
		And then very politely puts that as a 'query' object on the request
		*/

		//This is a way kind sanitizing.
		//This only allows for genre queries to be made 
		// and not something silly like-->   ...?genre99=Fiction)
		var query = {};
		if (req.query.genre)
			query = req.query;

		Book.find(query, function(err, books){
			if(err)
				res.status(500).send(err);
			else
				res.json(books);
		});		
	});

//Lets create a new router that will take anything in the format
// http://localhost:8000/api/books/somethinghere7372abcx839
// I *think* the colon : notation will assign the somethinghere837942djhdsf 
// as a param with the name 'bookId'
bookRouter.route('/Books/:bookId')
	.get(function(req, res){
	
	var param = req.params.bookId; //get param=bookId from request
	Book.findById(param, function(err, book){  //Note new method: findbyId
			if(err)
				res.status(500).send(err);
			else
				res.json(book);
	})

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
