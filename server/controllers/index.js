const express = require("express");
const checkUser = require("./../modules/checkUser");

const router = express.Router({strict:true});
module.exports = router;

//router.use("/api/v1", require("./session"))

/*
router.get("/api/v1/session", function(in_request, in_response) {
	in_response.statusCode = 200;
	in_response.setHeader("Content-Type", "application/json");
	in_response.json({
		"url": in_request.url,
		"body": JSON.stringify(in_request.body),
		"query": JSON.stringify(in_request.query),
		"params": JSON.stringify(in_request.params)
	});
	in_response.end();
});
*/

router.use("/api/v1", require("./accounts"))
router.use("/api/v1", require("./session"))

const indexAlias = ["/", "/index", "/index.htm", "/index.html"];

//router.get(indexAlias, checkUser);

router.get(indexAlias, function(request, response) {
	//console.log("router request index");
	response.render("index.html", {date: new Date().toISOString()});	
})
