/**
 *	express-uploadfiles
 *	(c) 2018 by Siarhei Dudko.
 *
 *	It is midleware to express. To upload files to a given directory. It uses streaming methods that allows you to download large files with a small amount of RAM.
 *	https://github.com/siarheidudko/express-uploadfiles
 *	LICENSE https://github.com/siarheidudko/express-uploadfiles/LICENSE
 */
 
 "use strict"
 
var HTTP = require('http'),
	EXPRESS = require('express'),
	PATH = require('path');
	
var	uploadfiles = require(PATH.join(__dirname, 'index.js'));
	
var app = EXPRESS();
var app2 = EXPRESS();

const _settings = {
	path: PATH.join(__dirname, 'tmp'),
	usekeyasname: true
};

var uploadfilesONE = uploadfiles(_settings);
var uploadfilesTWO = uploadfiles();

console.log(uploadfilesONE);
console.log(uploadfilesTWO);

app.post('*', uploadfilesONE.upload);


app2.post('*', function(req, res){
	uploadfilesTWO.promise(req, res).then(function(resolve){
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(resolve));
	}).catch(function(error){
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.end(error.message);
	});
});

HTTP.createServer(app).listen(80, '0.0.0.0');
HTTP.createServer(app2).listen(81, '0.0.0.0');
HTTP.createServer(uploadfilesONE.upload).listen(82, '0.0.0.0');