const Config = require("config");
const Q = require("q");
const Requestify = require("requestify");
const Session = require("./../modules/session.js");
const Test = require("./../modules/test.js");

const kUrlStub = "http://localhost:" + Config.port;

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunGetSession);
	promiseFactoryArray.push(RunGetNoSession);
	promiseFactoryArray.push(RunDeleteSession);
	promiseFactoryArray.push(RunSessionEncodeDecode);
	promiseFactoryArray.push(RunSessionEncodeDecodeTimeout);
	return;
}

const RunGetSession = function(){
	const name = "get session";
	var date = new Date(); //(1492317686364); //can use a fixed time, will expire as server uses current time
	var accountID = "58f2c9dad8ddce15e0c945ed";
	var sessionKey = Session.sessionKeyFactory(accountID, date);

	return Q(true).then(function(){
		return Requestify.get(kUrlStub + "/api/v1/session?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		const body = input.getBody();
		//console.log(JSON.stringify(body));
		Test.DealProperty(name + " property id", body, "id");
		Test.DealTest(name + "id", body.id, accountID);
		//console.log(name + " done");
		return true;
	});
}

const RunGetNoSession = function(){
	const name = "get no session";
	//console.log(name + " start");

	return Q(true).then(function(){
		return Requestify.get(kUrlStub + "/api/v1/session");
	}).fail(function(input){
		Test.DealTest(name + " status", input.getCode(), 404);
		//console.log(name + " done");
		return true;
	});
}

const RunDeleteSession = function(){
	const name = "delete session";
	return Q(true).then(function(){
		return Requestify.delete(kUrlStub + "/api/v1/session");
	}).fail(function(input){
		Test.DealTest(name + " status", input.getCode(), 404);
		return true;
	});
}

const RunSessionEncodeDecode = function(){
	const name = "session encode decode";
	return Q(true).then(function(){
		var accountID = "58f2c9dad8ddce15e0c945ed";
		var date = new Date();
		var sessionKey = Session.sessionKeyFactory(accountID, date);
		var decodeSessionKey = Session.sessionKeyDecode(sessionKey, date);

		Test.DealTypeof(name + " sessionKey type", sessionKey, "string");
		Test.DealTypeof(name + " decodeSessionKey type", decodeSessionKey, "object");

		Test.DealProperty(name + " property accountID", decodeSessionKey, "id");
		Test.DealTest(name + " accountID", decodeSessionKey.id, accountID);

		//console.log(name + " done");
		return true;
	});
}

const RunSessionEncodeDecodeTimeout = function(){
	const name = "session encode decode timeout";
	return Q(true).then(function(){
		var accountID = "58f2c9dad8ddce15e0c945ed";
		var dateEncode = new Date();
		var sessionKey = Session.sessionKeyFactory(accountID, dateEncode);
		var dateExpire = new Date(dateEncode.valueOf() + Config.sessionDurationMS + 10);
		var decodeSessionKeyExpire = Session.sessionKeyDecode(sessionKey, dateExpire);

		var dateDecode = new Date(dateEncode.valueOf() + Config.sessionDurationMS - 10);
		var decodeSessionKey = Session.sessionKeyDecode(sessionKey, dateDecode);

		Test.DealTypeof(name + " sessionKey type", sessionKey, "string");
		Test.DealTest(name + " decodeSessionKeyExpire null", decodeSessionKeyExpire == null, true);

		Test.DealTypeof(name + " decodeSessionKey type", decodeSessionKey, "object");

		Test.DealProperty(name + " property accountID", decodeSessionKey, "id");
		Test.DealTest(name + " accountID", decodeSessionKey.id, accountID);

		//console.log(name + " done");
		return true;
	});
}

/*

	describe("DELETE /session", () => {
		it("it should not find a session", (done) => {
			Chai.request(Server)
				.delete("/api/v1/session")
				.then(function(res) {
					Assert.equal(res.status, 404);
					done();
				}).catch(function(err){
					throw err;
				}).end(function(err, res){

				});
		});
	})

});
*/