var app = angular.module('HomeApp', []);

app.controller('HomeController', function ($scope, $http){
    /*
        Set up default values
     */
    $scope.submitted = false;
    $scope.defaultPlayBet = {ROYAL_FLUSH: 500, STRAIGHT_FLUSH: 50, FOUR_OF_A_KIND: 10, FULL_HOUSE: 3, FLUSH: 1.5, STRAIGHT: 1 };
    $scope.playBet = {};

    $scope.savePlayBet = function(playBet) {
        $scope.playBet = playBet;
        console.log($scope.playBet);
        $("#playBetCollapsibleHeader").click();
        console.log("save play bet");
    };

    $scope.submit = function (times) {
        $scope.inputtimes = times;
        $scope.submitted = true;

        console.log($scope.playBet);

        $http.post('/api/simulate?times=' + times, $scope.playBet)
                .then(function (response) {
                    console.log(response.data);
                    $scope.result = response.data;
                    $scope.isGain = $scope.result.gain > 0;
                    $scope.result.gain = Math.abs($scope.result.gain);
                    $scope.submitted = false;
                    drawChart($scope.result, $scope.isGain);
                }, function error (response) {
                    console.log("error making POST call");
                    $scope.submitted =false;
            })
    };

});

function drawChart(result, isGain) {
    var label = "";

    if (isGain) {
        CanvasJS.addColorSet("colorSet",
                [//colorSet Array
                "#2E8B57",
                "#666362"
                ]);
        label = "Gain";
    } else {
        CanvasJS.addColorSet("colorSet",
                [//colorSet Array
                "#E55451",
                "#666362"
                ]);
        label = "Lost";
    }

    var chart = new CanvasJS.Chart("chartContainer",
	{
		theme: "theme2",
        colorSet: "colorSet",
		data: [
		{
			type: "doughnut",
			showInLegend: true,
			toolTipContent: "{y}",
			legendText: "{indexLabel}",
			dataPoints: [
				{  y: result.gain, indexLabel: label },
				{  y: result.bet, indexLabel: "Bet" }
			]
		}
		]
	});
	chart.render();
    console.log("chart rendered");
}
