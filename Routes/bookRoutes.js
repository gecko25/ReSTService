var express = require('express');

var routes = function(Book){ 

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
bookRouter.route('/')
	.post(function(req,res){

		/* 
			We want to pass post data into this book 
			We need a body parser for this
			The body parser is a a middleware that can read the body
			and put into a nice JSON object that we understand
		*/
		//The parser has added json object to req body.
		//I have no clue what this line of code is doing..
		//Book requires to our bookModel.js 
		//but there are no function Book() constructors
		var book = new Book(req.body);  

		book.save(); //where does this method come from?!
		//console.log(book.__proto__);
		res.status(201).send(book);


	})
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
bookRouter.route('/:bookId')
	.get(function(req, res){	
	var param = req.params.bookId; //get param=bookId from request
	Book.findById(param, function(err, book){  //Note new method: findbyId
			if(err)
				res.status(500).send(err);
			else
				res.json(book);
		})
	})
	//put is a way to edit existing data
	.put(function(req,res){
		//first have to get it from the db
		Book.findById(req.params.bookId, function(err, book){  //Note new method: findbyId
			if(err){
				res.status(500).send(err);
			}else{
				//before we return the book we need to update it with the information the request
				console.log(book);
				book.author = req.body.author;
				book.title = req.body.title;
				book.genre = req.body.genre;
				book.read = req.body.read;
				book.save();

				res.json(book);
				//res.status(201).send(book);
			}	
		})
	})

	return bookRouter;
};

module.exports = routes;