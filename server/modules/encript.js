const Config = require("config");
const Crypto = require("crypto");

const algorithm = "aes-256-ctr";
const password = Config.encodePassword;

module.exports.encodeStringBase64 = function(in_string, in_password) {
	//console.log("encodeStringBase64:" + in_string);
	var cipher = Crypto.createCipher(algorithm, in_password);
	var crypted = cipher.update(in_string, "utf8", "base64");
	crypted += cipher.final("base64");
	//console.log("encodeStringBase64 end");
	return crypted;
}

module.exports.decodeStringBase64 = function(in_string, in_password) {
	var decipher = Crypto.createDecipher(algorithm, in_password);
	var dec = decipher.update(in_string, "base64", "utf8");
	dec += decipher.final("utf8");
	return dec;
}
