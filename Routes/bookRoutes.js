'use strict'

var express = require('express');

var routes = function(Book){ 

	//*HANDLING ROUTES*/
	//We are going to create a router for a 
	//particular URL. 
	var bookRouter = express.Router()
	var bookController = require('../controllers/bookController')(Book);

	//Anytime a request for this URL
	//occurs it gets passed to this router
	//The route method returns a single instance
	//of the particular route which then we can
	//use to handle HTTP verbs
	//http://expressjs.com/4x/api.html#router.route
	bookRouter.route('/')
		.post(bookController.post)  // why not .post(bookController.post() )  ?
		.get(bookController.get);

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
				req.book = book; //add the JSON book directly to incoming req
				next();   //call any HTTP methods assigned to this bookRouter
			}
			else{
				res.status(404).send("Oops! We couldn't find the book you were looking for!"); //resource was not found
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
				else{
					res.json(req.book);
				}
			});
		})

		.patch(function(req, res){
			//do not allow user to update the id
			if (req.body._id)
				delete req.body._id;
			
			//only update the params that user has updated (req.body.??)
			for (var p in req.body){
					console.log("p="+p);
					req.book[p] = req.body[p];
			}

			req.book.save(function(err){
				if (err)
					res.status(404).send(err);
				else{
					res.json(req.book);
				}	
			});
		})
		.delete(function(req,res){
			req.book.remove(function(err, book){
				if (err){
					res.status(404).send(err);
				}else{
					res.status(204).send("Removed book" + book.title);
				}

		});



		});

	return bookRouter;
};

module.exports = routes;