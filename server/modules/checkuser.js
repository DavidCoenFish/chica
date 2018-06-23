/*
middleware to redirect request to login if no user
*/

module.exports = function(request, response, next) {
	console.log("request.signedCookies:" + JSON.stringify(request.signedCookies));
	if(false === "userId" in request.session) {
		response.redirect("/login");
		return;
	}
	next();
};