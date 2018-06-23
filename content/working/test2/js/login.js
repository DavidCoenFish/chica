angular.module('LoginApp', [])
	.controller('LoginContoller', function($scope) {
		$scope.showError = false;
		$scope.errorMessage = "now is the time for all good men to come to the aid of the party";
		$scope.selected = "guest";

		$scope.isSelected = function(in_name) {
			return ($scope.selected === in_name);
		};
		$scope.onTab = function(in_name) {
			$scope.selected = in_name;
		};
		$scope.onGuest = function() {
			$scope.greeting = "onGuest";
			$scope.showError = true;
		};
		$scope.onLogin = function() {
			$scope.greeting = "onLogin";
		};
		$scope.onNew = function() {
			$scope.greeting = "onNew";
		};
		$scope.onRecover = function() {
			$scope.greeting = "onRecover";
		};

		$scope.onDismissError = function($event) {
			$event.stopPropagation();
			$scope.showError = false;
		};
		$scope.stopPropagation = function($event) {
			$event.stopPropagation();
		};
});