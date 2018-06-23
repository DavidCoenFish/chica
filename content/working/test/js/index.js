const module = angular.module('IndexApp', ["ngTable"]);

module.controller('IndexContoller', IndexContoller);
IndexContoller.$inject = ["NgTableParams", '$scope', '$window'];

function IndexContoller(NgTableParams, $scope, $window) {
	$scope.selected = "mydocs";

	$scope.isSelected = function(in_name) {
		return ($scope.selected === in_name);
	};
	$scope.onTab = function(in_name) {
		$scope.selected = in_name;
	};

	var data = [
		{ type: "folder", icon:"graphics/icons_folder.png", name: "folder A", lastedit: 1490501050626.0, creation: 1490501040626.0 },
		{ type: "folder", icon: "graphics/icons_folder.png", name: "folder B", lastedit: 1490501050626.0, creation: 1490501040626.0 },
		{ type: "movie", icon: "graphics/icons_movie.png", name: "movie A", lastedit: 1490501050626.0, creation: 1490501040626.0 },
		{ type: "movie", icon: "graphics/icons_lqre.png", name: "lqre", lastedit: 1490501050626.0, creation: 1490501040626.0 },
		{ type: "movie", icon: "graphics/icons_lqre_charactersheet.png", name: "character", lastedit: 1490501050626.0, creation: 1490501040626.0 }
	];
	$scope.tableParams = new NgTableParams({}, { dataset: data });
}

