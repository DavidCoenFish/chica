const FileSystem = require("fs");
const Path = require("path");

module.exports.randomString = function(length, chars) {
	var result = "";
	for (var i = length; i > 0; --i){
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}
module.exports.sRandomStringChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

module.exports.stringToAscii = function(in_string) {
	return (new Buffer(in_string).toString("ascii"))
}

module.exports.stringToUtf8 = function(in_string) {
	return (new Buffer(in_string).toString("utf8"))
}

module.exports.stringToBase64 = function(in_string) {
	return (new Buffer(in_string).toString("base64"))
}

module.exports.base64stringToUtf8 = function(in_string) {
	return (Buffer.from(in_string, "base64").toString("utf8"))
}

module.exports.responseSendError = function(in_response, in_statusCode, in_message, in_errorArray){
	in_response.statusCode = in_statusCode;
	var result = {};
	if (in_message != null)
	{
		result["message"] = in_message;
	}
	if ((in_errorArray != null) && (0 < in_errorArray.length))
	{
		result["errors"] = in_errorArray;
	}
	//in_response.send(JSON.stringify(result));
	in_response.json(result);
	in_response.end();
	//console.log("responseSendError in_statusCode:" + in_statusCode + " in_message:" + in_message);
}

const WalkSyncRecursive = function (currentDirPath, callback) {
	FileSystem.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = Path.join(currentDirPath, name);
		var stat = FileSystem.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat);
		} else if (stat.isDirectory()) {
			WalkSyncRecursive(filePath, callback);
		}
	});
}
module.exports.WalkSyncRecursive = WalkSyncRecursive;

module.exports.WalkSync = function (currentDirPath, callback) {
	FileSystem.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = Path.join(currentDirPath, name);
		var stat = FileSystem.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat);
		}
	});
}
module.exports.DirSync = function (currentDirPath, callback) {
	FileSystem.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = Path.join(currentDirPath, name);
		var stat = FileSystem.statSync(filePath);
		if (stat.isDirectory()) {
			callback(filePath, stat);
		}
	});
}
