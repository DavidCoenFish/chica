const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunMakeDefaultArrayDate);
	promiseFactoryArray.push(RunMakeDefaultArrayString);
}

const MakeDefaultDateFactory = function(in_offset){
	return function(){
		return new Date(in_offset);
	}
}


const RunMakeDefaultArrayDate = function(){
	const name = "MakeDefaultArrayDate ";
	return Q(true).then(function(){
		var factory0 = MakeDefaultDateFactory(100000);
		var factory1 = MakeDefaultDateFactory(200000);
		var factory2 = MakeDefaultDateFactory(300000);

		var date0 = factory0();
		var date1 = factory1();
		var date2 = factory2();

		Test.DealTest(name + "date0", date0.valueOf(), 100000);
		Test.DealTest(name + "date1", date1.valueOf(), 200000);
		Test.DealTest(name + "date2", date2.valueOf(), 300000);

		date0.setHours(8);

		var date0a = factory0();

		Test.DealTest(name + "date0a", date0a.valueOf(), 100000);
	});
};

const MakeDefaultStringFactory = function(in_value){
	return function(){
		return (" " + in_value).slice(1);
	}
}


const RunMakeDefaultArrayString = function(){
	const name = "MakeDefaultArrayString ";

	return Q(true).then(function(){
		var factory0 = MakeDefaultStringFactory("foo");
		var factory1 = MakeDefaultStringFactory("bar");
		var factory2 = MakeDefaultStringFactory("the cow");

		var value0 = factory0();
		var value1 = factory1();
		var value2 = factory2();

		Test.DealTest(name + "value0", value0, "foo");
		Test.DealTest(name + "value1", value1, "bar");
		Test.DealTest(name + "value2", value2, "the cow");

		value0 += "bll";

		var value0a = factory0();
		Test.DealTest(name + "value0a", value0a, "foo");
	});
};


