const BodyParser = require("body-parser");
const Config = require("config");
const CookieParser = require("cookie-parser");
const Express = require("express");
const InitDatabase = require("./modules/initdatabase");
const Helmet = require("helmet");
const Whiskers = require("whiskers");

const app = Express();

module.exports = app; // for testing, reference by routes. so must be BEFORE require("./controllers")

app.engine(".html", Whiskers.__express);
app.set("views", __dirname + "/../content/templates");

app.use(Helmet());

app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.text());
app.use(BodyParser.json({ type: "application/json"}));

app.use(CookieParser(Config.sessionSecret));

//define routes AFTER configurations (such as setting up bodyparser before we load in all the application)
app.locals.applicationManager = require("./modules/applicationManager")();
app.use(require("./controllers"));


app.use(function (err, req, res, next) {
	console.log("app.use");
	console.log(err.stack);
	next();
})


InitDatabase().then(function(){
	const port = Config.get("port");
	console.log("Server listen on port:" + port + " environment:" + Config.get("environment"));

	app.listen(port);
});


///const Util = require("./modules/util");
//console.log(Util.randomString(32, Util.sRandomStringChars));

