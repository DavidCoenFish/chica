const Database = require("./../modules/database.js");
const MongoDB = require("mongodb");
const Q = require("q");
const Test = require("./../modules/test.js");

const sTestCollection = "tests_collection";

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunInsertAndGet);
	promiseFactoryArray.push(RunUpdate);
	promiseFactoryArray.push(RunUpdateArray);
	promiseFactoryArray.push(RunInsertIDType);
	promiseFactoryArray.push(RunArrayPush);
	promiseFactoryArray.push(RunArrayRemove);
	return;
}

const ClearDatabase = function(){
	return Database.deleteCollection(sTestCollection);
}

const RunInsertAndGet = function(){
	const name = "database insert and get";
	const id = "fish_dsc@yahoo.co.uk";
	var document = {
		"_id": id,
		"data": 1,
		"foo": "bar"
	};
	return ClearDatabase().then(function(){
		return Database.insertDocument(sTestCollection, document);
	}).then(function(input) {
		Test.DealTest(name + " insert document return", input, id);
		return Database.getDocument(sTestCollection, id);
	}).then(function(input) {
		var result = JSON.stringify(input);
		var expectedResult = JSON.stringify(document);
		Test.DealTest(name + " document", result, expectedResult);

		//console.log(name + " done");
		return true;
	});
}

const RunUpdate = function(){
	const name = "database insert and get 2";
	const id = "abcd";
	var document = {
		"_id": id,
		"data": 1,
		"foo": "bar",
		"moo": { "a" : 1, "b" : [2,3], "c" : {
			"d" : "e", "h" : "i" 
		} }
	};

	var delta = {
		"data": 3,
		"foo": "bar2",
		"moo.b.2" : 4,
		"moo.c.f" : "g",
		//"moo": { "b" : [2,3,4], "c" : {
		//	"f" : "g"
		//} },
		"zoo" : "goo"
	};

	var unset = {
		"moo.c.h" : "",
	}
	var target = {
		"_id": id,
		"data": 3,
		"foo": "bar2",
		"moo": { "a" : 1, "b" : [2,3,4], "c" : {
			"d" : "e",
			"f" : "g"
		} },
		"zoo" : "goo"
	};

	return ClearDatabase().then(function(){
		return Database.insertDocument(sTestCollection, document);
	}).then(function(input) {
		Test.DealTest(name + " insert document return", input, id);
		return Database.upsertDocument(sTestCollection, id, delta);
	}).then(function(input) {
		Test.DealTest(name + " upsertDocument", input, true);
		//console.log("upsertDocument:" + JSON.stringify(input));
		return Database.unsetDocument(sTestCollection, id, unset);
	}).then(function(input) {
		Test.DealTest(name + " unsetDocument", input, true);
		//console.log("unsetDocument:" + JSON.stringify(input));
		//Test.DealTest(name + " upsert document return", input, id);
		return Database.getDocument(sTestCollection, id);
	}).then(function(input) {
		var result = JSON.stringify(input);
		var expectedResult = JSON.stringify(target);
		Test.DealTest(name + " document", result, expectedResult);
		
		//console.log("result:" + result);
		//console.log(name + " done");
		return true;
	});
}

const RunUpdateArray = function(){
	const name = "database update array";
	const id = "abcd";

	var document = {
		"_id": id,
		"data": ["a","z","c"]
	};

	var delta = {
		"data.1": "b"
	};

	var target = {
		"_id": id,
		"data": ["a","b","c"]
	};
	
	return ClearDatabase().then(function(){
		return Database.insertDocument(sTestCollection, document);
	}).then(function(input) {
		Test.DealTest(name + " insert document return", input, id);
		return Database.upsertDocument(sTestCollection, id, delta);
	}).then(function(input) {
		return Database.getDocument(sTestCollection, id);
	}).then(function(input) {
		var result = JSON.stringify(input);
		var expectedResult = JSON.stringify(target);
		Test.DealTest(name + " document", result, expectedResult);
		
		//console.log("result:" + result);
		//console.log(name + " done");
		return true;
	});
}

const RunInsertIDType = function(){
	const name = "database insert id type";
	var document = {
		"data": 1,
		"foo": "bar"
	};
	return ClearDatabase().then(function(){
		return Database.insertDocument(sTestCollection, document);

	}).then(function(input) {
		Test.DealTypeof(name + " input type", input, "object");
		Test.DealTest(name + " type", (input instanceof MongoDB.ObjectId), true);

		//console.log(name + " done");
		return true;
	});
}

const RunArrayPush = function(){
	const name = "database array push";
	const id = "abcd";
	var document = {
		"_id" : id,
		"foo": ["a", "b", "c"]
	};

	return ClearDatabase().then(function(){
		return Database.insertDocument(sTestCollection, document);
	}).then(function(input) {
		return Database.pushItemToArray(sTestCollection, id, "foo", "d");
	}).then(function(input) {
		Test.DealTest(name + " pushItemToArray return", input, true);

		return Database.getDocument(sTestCollection, id);
	}).then(function(input) {
		Test.DealTest(name + " getDocument", -1 !== input.foo.indexOf("d"), true);
		
		//console.log(name + " done");
		return true;
	});
}

const RunArrayRemove = function(){
	const name = "database array remove";
	const id = "abcd";
	var document = {
		"_id" : id,
		"foo": ["a", "b", "c", "b"]
	};
	var target = {
		"_id" : id,
		"foo": ["a", "c"]
	};

	return ClearDatabase().then(function(){
		return Database.insertDocument(sTestCollection, document);
	}).then(function(input) {
		return Database.removeItemFromArray(sTestCollection, id, "foo", "b");
	}).then(function(input) {
		Test.DealTest(name + " removeItemFromArray return", input, true);

		return Database.getDocument(sTestCollection, id);
	}).then(function(input) {
		var result = JSON.stringify(input);
		var expected = JSON.stringify(target);
		Test.DealTest(name + " getDocument", result, expected);
		
		//console.log(name + " done");
		return true;
	});
}