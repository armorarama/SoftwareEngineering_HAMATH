// (function saveScore(game_mode){
(function saveScore(){
	var game_mode = "rookie";
	var URL = game_mode + "_mode";

	// game_mode and score are hardcoded for the sake of example
    var game_data = {
    	"mode" : game_mode,
    	"score" : 99
    };

    $.post(URL, game_data, function(data,status){
        // if (status==="success") { alert("your score of " + score + " was saved." } );
        // else { alert("Sorry but your score was not saved.\nStatus: " + status }
    });
})();