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

//Lets create a new route handler that will take anything in the format
// http://localhost:8000/api/books/somethinghere7372abcx839
// I *think* the colon : notation will assign the somethinghere837942djhdsf 
// as a param with the name 'bookId'

//Lets get our repeated code out of here and add some middleware.
bookRouter.use('/:bookId', function(req, res, next){
	var param = req.params.bookId;

	Book.findById(param, function(err, book){ //findById method comes from mongoose
		if (err)
			res.status(500).send(err)
		else if (book) {
			console.log("book=" + book);
			req.book = book; //add the JSON book directly to incoming req
			next();   //call any HTTP methods assigned to this bookRouter
		}
		else{
			res.status(404).send(err); //resource was not found
		}
	})
});


bookRouter.route('/:bookId')
	.get(function(req, res){	
				res.json(req.book);
		})
	
	.put(function(req,res){
		//the book that mongo got from db, which we put on the req, needs to be updated
		//the user input that we use to update is on the request body 
		req.book.author = req.body.author;
		req.book.title = req.body.title;
		req.book.genre = req.body.genre;
		req.book.read = req.body.read;
		
		req.book.save(function(err){
			if (err)
				res.status(404).send(err);
			else
				res.json(req.book);
			})
		
	.patch(function(req, res){
		//do not allow user to update the id
		if (req.body._id)
			delete req.body._id;
		
		console.log("req.book="+req.book);
		
		//only update the params that user has updated (req.body.??)
		for (var p in req.body){
				console.log("p="+p);
				req.book[p] = req.body[p];
		}

		// if (req.body.author)
		// 	req.book.author = req.body.author;

		// if (req.body.author)
		// 	req.book.title = req.body.title;

		// if (req.body.genre)
		// 	req.book.genre = req.body.genre;
			
		// if (req.book.read)
		// 	req.book.read = req.body.read;

		req.book.save(function(err){
			if (err)
				res.status(404).send(err);
			else
				res.json(req.book);
	});

	return bookRouter;
};

module.exports = routes;