var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
var _=require('lodash');

var app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/hello', function(req, res, next) {
  res.send('Hello World!');
  next();
});

mongoose.connect('mongodb://localhost/dockertools');
mongoose.connection.once('open',function(){

	app.models=require('./model/index');

	//Load the routes

	var routes=require('./routes');
	_.each(routes,function(controller,route){
		app.use(route,controller(app,route));
	});

	console.log('listening on port 3000');
	app.listen(3000);
});