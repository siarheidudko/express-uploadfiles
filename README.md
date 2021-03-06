﻿﻿
# Express-Uploadfiles
It is midleware to express. To upload files to a given directory. It uses streaming methods that allows you to download large files with a small amount of RAM.
  
[![npm](https://img.shields.io/npm/v/express-uploadfiles.svg)](https://www.npmjs.com/package/express-uploadfiles)
[![npm](https://img.shields.io/npm/dy/express-uploadfiles.svg)](https://www.npmjs.com/package/express-uploadfiles)
[![NpmLicense](https://img.shields.io/npm/l/express-uploadfiles.svg)](https://www.npmjs.com/package/express-uploadfiles)
![GitHub last commit](https://img.shields.io/github/last-commit/siarheidudko/express-uploadfiles.svg)
![GitHub release](https://img.shields.io/github/release/siarheidudko/express-uploadfiles.svg)

## Install

```
	npm i express-uploadfiles --save
```

## Use

#### connection library
```
	var Uploadfiles = require('express-uploadfiles');
```

#### use as a function in express
```
	var HTTP = require('http'),
		EXPRESS = require('express'),
		PATH = require('path'),
		UPLOADFILES = require('express-uploadfiles');
	
	var app = EXPRESS();
	
	const _settings = {
		path: PATH.join(__dirname, 'tmp'),
		usekeyasname: true
	};
	var uploadfiles = UPLOADFILES(_settings);
	app.post('*', uploadfiles.upload);
	
	HTTP.createServer(app).listen(80, '0.0.0.0');
```

#### use as a function in http
```
	var HTTP = require('http'),
		UPLOADFILES = require('express-uploadfiles');
	
	var uploadfiles = UPLOADFILES();
	
	HTTP.createServer(uploadfiles.upload).listen(80, '0.0.0.0');
```

#### use as promise in custom function
```
	var HTTP = require('http'),
		EXPRESS = require('express'),
		UPLOADFILES = require('express-uploadfiles');
	
	var app = EXPRESS();
	
	var uploadfiles = UPLOADFILES();
	app.post('*', function(req, res){
		uploadfiles.promise(req, res).then(function(resolve){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(resolve));
		}).catch(function(error){
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		});
	});
	
	HTTP.createServer(app).listen(80, '0.0.0.0');
```

## API
#### settings object:
```
{
	path: './tmp/',
	usekeyasname: false
}
```
- path - file upload directory
- usekeyasname - when saving, use the form data keys as file names

example shows default settings

#### return object json:
```
	{
		"status": "upload",
		"error": null,
		"upload": {
			"test2": "upload",
			"test": "upload"
		}
	}
```

- status - the result of downloading files, there are 3 types
    - error - no files uploaded
	- witherrors - not all files uploaded
	- upload - all files uploaded without errors
- error - error text
- upload - Object key (name post data) - value (download result: upload - if uploaded, or error text)

if you use promise and no file is uploaded, the reject of string type will be returned

## LICENSE

MIT
