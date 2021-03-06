/**
 *	express-uploadfiles
 *	(c) 2018 by Siarhei Dudko.
 *
 *	It is midleware to express. To upload files to a given directory. It uses streaming methods that allows you to download large files with a small amount of RAM.
 *	https://github.com/siarheidudko/express-uploadfiles
 *	LICENSE https://github.com/siarheidudko/express-uploadfiles/LICENSE
 */
 
 "use strict"
 
const MULTIPARTY = require('multiparty'),
	FS = require('fs'),
	PATH = require('path'),
	MKDIRP = require('mkdirp');

var UploadFiles = function(_settings){
	
	var self = this;
	
	this.options = { path: PATH.join(process.cwd(), 'tmp'), usekeyasname: false };
	for(const key in _settings){
		this.options[key] = _settings[key];
	}
	
	self.promise = function uploadFilesPromise(req, res){ 
		return new Promise(function(resolve, reject){
			var form = new MULTIPARTY.Form();
			form.parse(req, function(err, fields, files) {
				try{
					if(err){
						throw err;
					} else {
						var answer = {};
						var count = Object.keys(files).length;
						if(count === 0){
							reject(new Error("Files not received!"));
						}else {
							MKDIRP(self.options.path, function (err) {
								if (err)
									reject(new Error("I can not create a upload directory: "+e.message));
								else {
									var _message = {status:null, error:null, upload:{}};
									var _flag = false;
									for(const keyFile in files){
										if(self.options.usekeyasname)
											var _path = PATH.join(self.options.path, keyFile);
										else
											var _path = PATH.join(self.options.path, files[keyFile][0].originalFilename);
										FS.copyFile(files[keyFile][0].path, _path, (err) => {
											count--;
											if (err) {
												answer[keyFile] = err.message;
												_message.status = "witherrors";
											} else {
												answer[keyFile] = 'upload';
												_flag = true;
											}
											if(count === 0){
												if(_flag){
													if(_message.status === null)
														_message.status = "upload";
													_message.upload = answer;
													resolve(_message);
												} else {
													reject(new Error("Could not copy file: "+err.message))
												}
											}
											FS.unlink(files[keyFile][0].path, function (err){});	//fs.rename does not support cross device
										}); 
									}
								}
							});
						}
					}
				} catch(e) {
					reject(new Error("Processing formdata error: " + e.message));
				}
			});
		});
	}
	
	self.upload = function uploadFiles(req, res){	
		try{
			var message = {status:null, error:null, upload:{}};
			self.promise(req, res).then(function(resolve){
				message = resolve;
				res.writeHead(200, {'content-type': 'application/json'});
			}).catch(function(error){
				message.status = "error";
				message.error = error.message;
				res.writeHead(500, {'Content-Type': 'application/json'});
			}).finally(function(){
				res.end(JSON.stringify(message));
			}); 
		} catch(err){
			res.writeHead(500, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({status:"error", error:err.message}));
		}
	}
	
}

var UploadFilesModule = function(_settings){
	return new UploadFiles(_settings);
}

module.exports = UploadFilesModule;