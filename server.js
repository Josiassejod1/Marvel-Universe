
'use strict'

const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
const Clarifai = require('clarifai');
const async = require('async');
const Inert =  require('inert');
const Path = require('path');
const api = require('marvel-api');
require('dotenv').config();

var marvel = api.createClient({
	publicKey: process.env.PUBLIC_KEY,
	privateKey:process.env.PRIVATE_KEY

});


const server = new Hapi.Server({
	connections: {
        routes: {
            files: {
                relativeTo: __dirname
            }
        }
    }
});


server.connection({
	host: '127.0.0.1',
	port: 3000
});

//Gets index.html route

server.register([Vision, Inert], (err) => {
	server.views({
		engines:{
			html: Handlebars
		},
		relativeTo: __dirname,
		path: './view'
	});
});

server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
        	file : 'index.js'
        }
    
});


//Starts up server

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});

//Gets information on Marvel Comic API
server.route({
	method :'GET',
	path: '/',
	handler: function(request, reply) {
		marvel.characters.findAll(function(err, results) {
  			if (err) {
    			return console.error(err);
  		}
 
  		//console.log(results.data);
  		var results = results.data;

  		reply.view('index',{comics: results});
		});	
	}
});