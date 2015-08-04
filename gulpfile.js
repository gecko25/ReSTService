/**
 *The file that gulp looks to for configuration.
 *When gulp runs, it is going to look for this file.
 **/

/******
nodemon - a plugin(?) that automatically
          restarts server when changes to files are made
gulp    - "streaming build system" (like ant I think)          
******/

var gulp    = require('gulp') 
	nodemon = require('gulp-nodemon');  

//Tell gulp about our tasks & use that task to execute our nodemon plugin
gulp.task('default', function setupNodemon(){
	//nodemon is configured by a JSON object
	nodemon({
		script: 'app.js',  //what script will it run
		ext: 'js',		  //what extentions to watch for
		env: {
			PORT:8000	  //nodemon lets us setup our environment here (process.env.POR)
		},
		ignore: ['/.node_modules/**']  //so future installs dont get confused?
	})
	.on('restart', function restart(){
		console.log("Restarting..");
	});
})

/**NOTES**
-- Understand the syntax here! 
	We created an instance of nodeman -->var nodeman = require('nodeman')
	Then called a method on that instance and passed it a config obj as a param
	nodeman({configObj}).on(somestuff)
		//Whats going on behind scenes here? -- this is a constructor function Im guessing)
		//source code for this doesn't make tons of sense to me, so not sure --> https://github.com/remy/nodemon/tree/master/lib
*/	
	