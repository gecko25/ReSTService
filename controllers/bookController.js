'use strict'

function bookController(Book){

	var get = function(req, res){
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
	}

	var post = function(req,res){
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
	}	

	return {
		get: get,
		post: post
	}
}

module.exports = bookController;

//Q: why not bookCrontroller()
/*Q: why not
	return {
		get: get(),
		post: post()
	}
	
Q: WHy not in app.js 
*/