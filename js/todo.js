function TodoCtrl($scope) {
	// Grab persisted todo list
	forge.prefs.get("todos", function (todos) {
		// Updating Angular model, $apply makes sure the view is updated too.
		$scope.$apply(function () {
			if (todos) {
				$scope.todos = todos;
			} else {
				$scope.todos = [
					{text:'learn angular', done:true},
					{text:'build an angular app', done:false},
					{text:'extend angular app to work with Forge', done:false}];
			}
		});
	});
	forge.prefs.get("archived", function (archived) {
		$scope.$apply(function () {
			if (archived) {
				$scope.archived = archived;
			} else {
				$scope.archived = [];
				forge.prefs.set("archived", $scope.archived);
			}
		});
	});
	
	// Add Forge tabbar buttons
	forge.tabbar.addButton({
		icon: "img/list.png",
		text: "Todo list"
	}, function (button) {
		button.setActive();
		button.onPressed.addListener(function () {
			$scope.$apply($scope.showList);
		});
	});
	forge.tabbar.addButton({
		icon: "img/archive.png",
		text: "Archive"
	}, function (button) {
		button.onPressed.addListener(function () {
			$scope.$apply($scope.showArchive);
		});
	})
 
	$scope.showList = function () {
		$scope.listClass = "show";
		$scope.archiveClass = "hide";
		// Add archive button
		forge.topbar.removeButtons();
		forge.topbar.addButton({
			icon: "img/accept.png"
		}, function () {
			$scope.$apply($scope.archive);
		});
	};
	
	$scope.showArchive = function () {
		$scope.listClass = "hide";
		$scope.archiveClass = "show";
		// No topbar buttons for the archive
		forge.topbar.removeButtons();
	};
	
	// Show list initially
	$scope.showList();
 
	$scope.addTodo = function() {
		$scope.todos.push({text:$scope.todoText, done:false});
		$scope.todoText = '';
		forge.prefs.set("todos", $scope.todos);
	};
 
	$scope.remaining = function() {
		var count = 0;
		angular.forEach($scope.todos, function(todo) {
			count += todo.done ? 0 : 1;
		});
		return count;
	};
 
	$scope.archive = function() {
		var oldTodos = $scope.todos;
		$scope.todos = [];
		angular.forEach(oldTodos, function(todo) {
			if (!todo.done) $scope.todos.push(todo);
			else $scope.archived.push(todo);
		});
		forge.prefs.set("todos", $scope.todos);
		forge.prefs.set("archived", $scope.archived);
	};
}

