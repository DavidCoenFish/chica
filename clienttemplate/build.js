const Mustache = require("mustache");
const Util = require("./modules/util.js");
const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");


const WalkSync = function (currentDirPath, callback) {
	FileSystem.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = Path.join(currentDirPath, name);
		var stat = FileSystem.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat, name);
		}
	});
}

const GatherTemplates = function(in_templateArray) {
	const templatePath = Path.join(__dirname, "/template/");
	//console.log("templatePath:" + templatePath);
	WalkSync(templatePath, function(filePath, stat, name){
		//console.log("filePath:" + filePath + " stat:" + stat + " name:" + name);
		in_templateArray.push({"filePath" : filePath, "name" : name });
	});
	return;
}

var templateArray = [];
GatherTemplates(templateArray);

const ReadFileTemplate = function(in_template, in_promice){
	return in_promice.then(function(){ 
		return Util.readFilePromise(in_template.filePath);
	}).then(function(in_input){
		in_template.file = in_input;
	});
}

const RenderTemplate = function(in_template, in_data, in_locale, in_promice){
	var tokens = in_template.name.split(".");
	var extention = tokens.pop();
	tokens.push(in_locale);
	tokens.push(extention);
	var newFileName = tokens.join(".");
	//console.log(newFileName + " in_locale:" + in_locale + " in_data:" + JSON.stringify(in_data));
	var output = Mustache.render(in_template.file, in_data);
	//console.log("polo");
	return in_promice.then(function(){
		return Util.writeFilePromise("./../client/source/static/" + newFileName, output);
	});
}

var localeData = undefined;
var localeKeys = undefined;
Util.readFilePromise("./../drivetojson/data/locale.json").then(function(in_input){
	console.log(in_input);
	var locale  = JSON.parse(in_input);
	localeKeys = Object.keys(locale);
	return Util.readFilePromise("./../drivetojson/data/localedata.json");
}).then(function(in_input){
	localeData = JSON.parse(in_input);
	return;
}).then(function(in_input){
	var promice = Q(true);
	for (var index = 0; index < templateArray.length; ++index){
		var template = templateArray[index];
		promice = ReadFileTemplate(template, promice);
	}
	return promice;
}).then(function(in_input){
	var promice = Q(true);
	for (var index = 0; index < templateArray.length; ++index){
		var template = templateArray[index];

		for (var subIndex = 0; subIndex < localeKeys.length; ++subIndex){
			var locale = localeKeys[subIndex];
			var data = {
				"locale":locale, 
				"title": function(){
					return function(text, render){
						if (text in localeData){
							var localeDataText = localeData[text];
							if (locale in localeDataText){
								return localeDataText[locale];
							}
						}
						console.log("WARING: locale data not found for text:" + text + " locale:" + locale);
						return "";
					}
				}
			}
			promice = RenderTemplate(template, data, locale, promice);
		}
	}
	return promice;
}).done(function(){
	console.log("DONE");
	process.exit(0);
},function(error){
	console.log("FAILED:" + error);
	process.exit(1);
});



