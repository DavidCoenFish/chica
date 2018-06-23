const Q = require("q");
const Encript = require("./../modules/encript.js");
const Test = require("./../modules/test.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunEncodeDecode);
	return;
}

const RunEncodeDecode = function(){
	const name = "encode decode";
	return Q(true).then(function(){
		var password = "1234";
		var input = JSON.stringify({"foo":"bar","moo":[1,2,3]});
		var encoded0 = Encript.encodeStringBase64(input, password);
		var encoded0b = Encript.encodeStringBase64(input, "1");
		var dencoded0 = Encript.decodeStringBase64(encoded0, password);
		var encoded1 = Encript.encodeStringBase64(dencoded0, password);
		var dencoded1 = Encript.decodeStringBase64(encoded1, password);

		Test.DealTypeof(name + " encoded", encoded0, "string");
		Test.DealTypeof(name + " decoded", dencoded1, "string");
		Test.DealTest(name + " round trip", dencoded1, input);
		Test.DealTestNot(name + " false", encoded0, encoded0b);

		//console.log(name + " done");
		return true;
	})
}
