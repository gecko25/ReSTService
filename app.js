var express = require('express');
var app = express(); //create an instance of express so we can use all the cool functionality it provides:D

//**PORT ASSIGNMENT**//
//Assign a port that our server should listen to
//I think in real life this would point to a host
//(i.e mywebsite.com:3000) and anytime a client 
//wanted to do something, our node app is here 
//listening.

port = process.env.PORT || 3000;

//**Assign a handler for our route**/
//The '/' indicates the root of our site. 
//What should we do when a client sends a req..?
//..We send a message back with response object!

app.get('/', function getRoot(req,res){
	res.send("Hello");
})

//Listen on the port please
app.listen(port, function confirmListening(){
	console.log("Starting up application... " +"\n" +
				"Listening on port: " + port);
})
