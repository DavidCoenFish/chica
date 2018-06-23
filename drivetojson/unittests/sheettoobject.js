const Q = require('q');
const Test = require("./../modules/test.js");
const Cursor = require("./../modules/cursor.js");
const SheetToObject = require("./../modules/sheettoobject.js");
const MockDataServer = require("./../modules/mockdataserver.js");

//module.exports.sheetToObject = function(in_dataServer, in_sheetId, in_cursor, in_baseObject){


module.exports = function(promiseArray) {
	RunSimpleInt(promiseArray);
	RunSimpleFloat(promiseArray);
	RunSimpleBool(promiseArray);
	RunSimpleString(promiseArray);
	RunSimpleArray(promiseArray);
	RunData(promiseArray);
	return;
}

const RunSimpleInt = function(promiseArray) {
	promiseArray.push(Q(true).then(function(input){
		var dataServer = MockDataServer({
			"fileId0" : {
				"data" : {
					"toc" : [
							[ "int:version", 42 ]
						]
					}
				}
			});

		var baseObject = {};
		var cursor = Cursor();
		return SheetToObject.sheetToObject(dataServer, "fileId0", cursor, baseObject).then(function(input){
			var expected = {"version" : 42};
			Test.DealTest("RunSimpleInt", JSON.stringify(baseObject), JSON.stringify(expected));
			return true;
		});
	}));
}

const RunSimpleFloat = function(promiseArray) {
	promiseArray.push(Q(true).then(function(input){
		var dataServer = MockDataServer({
			"fileId0" : {
				"data" : {
					"toc" : [
							[ "float:value", 2.5 ]
						]
					}
				}
			});

		var baseObject = {};
		var cursor = Cursor();
		return SheetToObject.sheetToObject(dataServer, "fileId0", cursor, baseObject).then(function(input){
			var expected = {"value" : 2.5};
			Test.DealTest("RunSimpleFloat", JSON.stringify(baseObject), JSON.stringify(expected));
			return true;
		});
	}));
}

const RunSimpleBool = function(promiseArray) {
	promiseArray.push(Q(true).then(function(input){
		var dataServer = MockDataServer({
			"fileId0" : {
				"data" : {
					"toc" : [
							[ "bool:value", null ]
						]
					}
				}
			});

		var baseObject = {};
		var cursor = Cursor();
		return SheetToObject.sheetToObject(dataServer, "fileId0", cursor, baseObject).then(function(input){
			var expected = {"value" : false};
			Test.DealTest("RunSimpleBool", JSON.stringify(baseObject), JSON.stringify(expected));
			return true;
		});
	}));
}

const RunSimpleString = function(promiseArray) {
	promiseArray.push(Q(true).then(function(input){
		var dataServer = MockDataServer({
			"fileId0" : {
				"data" : {
					"toc" : [
							[ "string:value", "hello" ]
						]
					}
				}
			});

		var baseObject = {};
		var cursor = Cursor();
		return SheetToObject.sheetToObject(dataServer, "fileId0", cursor, baseObject).then(function(input){
			var expected = {"value" : "hello"};
			Test.DealTest("RunSimpleString", JSON.stringify(baseObject), JSON.stringify(expected));
			return true;
		});
	}));
}

const RunSimpleArray = function(promiseArray) {
	promiseArray.push(Q(true).then(function(input){
		var dataServer = MockDataServer({
			"fileId0" : {
				"data" : {
					"toc" : [
							[ "value:array:int", "1" ],
							[ "value:int:array", "2" ],
							[ "int:value:array", "3" ],
						]
					}
				}
			});

		var baseObject = {};
		var cursor = Cursor();
		return SheetToObject.sheetToObject(dataServer, "fileId0", cursor, baseObject).then(function(input){
			var expected = {"value" : [1,2,3]};
			Test.DealTest("RunSimpleArray", JSON.stringify(baseObject), JSON.stringify(expected));
			return true;
		});
	}));
}

const RunData = function(promiseArray) {
	promiseArray.push(Q(true).then(function(input){
		var dataServer = MockDataServer({
			"fileId0" : {
				"data" : {
					"toc" : [
							[ "root:array:1:array:outer:inner:int", "1" ],
							[ "root:array:1:array:foo:bar:int", "2" ],
							[ "root:array:2:array:moo:bool", true ],
							[ "root:array:2:array:goo:bool", false ],
						]
					}
				}
			});

		var baseObject = {};
		var cursor = Cursor();
		return SheetToObject.sheetToObject(dataServer, "fileId0", cursor, baseObject).then(function(input){
			var expected = {"root" : [null,[{"outer":{"inner":1}},{"foo":{"bar":2}}],[{"moo":true},{"goo":false}]]};
			Test.DealTest("RunData", JSON.stringify(baseObject), JSON.stringify(expected));
			return true;
		});
	}));
}
