const Config = require("config");
const Q = require("q");
const Requestify = require("requestify");
const Test = require("./../modules/test.js");

const kUrlStub = "http://localhost:" + Config.port;

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunServerBasic);
	return;
}

/**
 does the server return a vaild status for root get (index.html?)
 */
const RunServerBasic = function(){
	const name = "ServerBasic";

	return Q(true).then(function(){
		return Requestify.get(kUrlStub);
	}).then(function(input){
		//console.log("Requestify kUrlStub:" + kUrlStub);
		Test.DealTest(name + " status", input.getCode(), 200);
		const body = input.getBody();
		//console.log(JSON.stringify(body));

		Test.DealTest(name + " body", body != null && body != "", true);

		//console.log(name + " done");
		return true;
	});
}
