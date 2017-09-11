var board = [0,1,2,3,4,5,6,7,8];
var state = false;
var selected = false;
var turn = false;
var huPlayer = false;
var computer = false;
var x = '<span class = "x x-hov"><i class="fa fa-times" aria-hidden="true"></i>'
var o = '<span class = "o o-hov"><i class="fa fa-circle-o" aria-hidden="true"></i>'
var round = 0;
var win = 0;
var loss = 0;
var draw = 0;
var bestSpot;

function emptyIndex(board){
	return board.filter(s => s != "x" && s != "o")
}

function winning(board, player){
if (
	(board[0] == player && board[1] == player && board[2] == player) ||
	(board[3] == player && board[4] == player && board[5] == player) ||
	(board[6] == player && board[7] == player && board[8] == player) ||
	(board[0] == player && board[3] == player && board[6] == player) ||
	(board[1] == player && board[4] == player && board[7] == player) ||
	(board[2] == player && board[5] == player && board[8] == player) ||
	(board[0] == player && board[4] == player && board[8] == player) ||
	(board[2] == player && board[4] == player && board[6] == player)
	) {
	return true;
	} else {
	return false;
	}
}

function minimax(newBoard, player){
	var availSpots = emptyIndex(newBoard);

	if(winning(newBoard,huPlayer)){
		return{score:-10};
	} else if(winning(newBoard,computer)){
		return{score:10};
	} else if(availSpots.length === 0){
		return {score:0};
	}

	var moves = [];

	for( var i = 0; i <availSpots.length; i ++){
		var move = {};
			move.index = newBoard[availSpots[i]];

		newBoard[availSpots[i]] = player;

		if(player == computer){
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]]= move.index;

		moves.push(move);
	}


	var bestMove;
	if(player == computer){
		var bestScore = -10000
		for (var i = 0; i < moves.length; i++){
			if(moves[i].score > bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++){
			if(moves[i].score < bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

function reset(){
	board = [0,1,2,3,4,5,6,7,8];
	state = false;
	selected = false;
	turn = false;
	huPlayer = false;
	computer = false;
	x = '<span class = "x x-hov"><i class="fa fa-times" aria-hidden="true"></i>'
	o = '<span class = "o o-hov"><i class="fa fa-circle-o" aria-hidden="true"></i>'
	round = 0;
	bestSpot;
	$("td").html(" ");
	$("td").removeClass("select");
	$("#starter").html("<h3>Who Starts?</h3>");
	$(".player-start").css("color","rgb(38,38,38)");
	$(".player-start").css("color","rgb(38,38,38)");
	$(".comp-start").css("color","rgb(38,38,38)");
	$("#player-p").text("I will start");
	$("#comp-p").text("Computer will start");
	$(".o-opt").css("border-bottom","0px");
	$(".o-opt").css("color","rgb(46,196,103)");
	$(".x-opt").css("border-bottom","0px");
	$(".x-opt").css("color","rgb(246,49,47)");
	return;
}

$(document).ready(function(){

	$(".option").click(function(){
		$("#starter").html(function(){
			if($(this).html() === "<h3>Pick x or o</h3>"){
				return "<h3>GO</h3>"
			}
		})
		if(selected === false){
			if($(this).hasClass('x')){
				huPlayer = "x";
				computer = "o";
				selected = true;
				$("td").html(" ");
				$("td").removeClass("select");
				$(".x-opt").css("border-bottom","3px solid rgba(49,160,210,.5)");
				$(".x-opt").css("color","rgba(246,49,47,.5)")
				$(".o-opt").css("border-bottom","0px")
				$(".o-opt").css("color","rgb(46,196,103)")
				if(turn === "computer" && state === true){
					callAI();
				}
			} else if($(this).hasClass('o')){
				huPlayer = "o";
				computer = "x"
				selected = true;
				$("td").html(" ");
				$("td").removeClass("select");
				$(".o-opt").css("border-bottom","3px solid rgba(49,160,210,.5)")
				$(".o-opt").css("color","rgba(46,196,103,.5)")
				$(".x-opt").css("border-bottom","0px");
				$(".x-opt").css("color","rgb(246,49,47)")
				if(turn === "computer" && state === true){
					callAI();
				}
			}
		}
	});

	$(".start").click(function(){
		$("#player-p").text("I will start over");
		$("#comp-p").text("Computer will start over");
		$("#starter").html(function(){
			if(huPlayer === "x" || huPlayer === "o"){
				return "<h3>GO</h3>"
			} else {
				return "<h3>Pick x or o</h3>"
			}
		})
		if(state === true){
			state = false;
			reset();
		} else {
			if($(this).hasClass("player-start")){
				state = true;
				turn = "player";
				$(".player-start").css("color","rgba(38,38,38,.5)")
				$(".comp-start").css("color","rgb(38,38,38)")
			} else if ($(this).hasClass("comp-start")){
				state = true;
				turn = "computer";
				$(".player-start").css("color","rgb(38,38,38)")
				$(".comp-start").css("color","rgba(38,38,38,.5)")
				if(huPlayer === "x" || huPlayer === "o"){
					callAI();
				}
			}
		}
	})


	$("td").hover(function(){
		if(state === true && turn === "player"){
			if($(this).hasClass("select")){

			} else {
				if(huPlayer === "x"){
					$(this).html(x)
				} else if(huPlayer === "o"){
					$(this).html(o)
				}
			}
		}
	},function(){
		if($(this).hasClass("select")){

		} else {
			$(this).html(" ")
		}
	});

	function callAI(){
		if(state === true && turn === "computer"){
			turn = "player";
			round++
			var compMove = minimax(board,computer).index;
				if(computer === "x"){
					$("#" + compMove).addClass("select");
					$("#" + compMove).html(x);
					board[compMove] = "x";
				} else if(computer === "o"){
					$("#" + compMove).addClass("select");
					$("#" + compMove).html(o);
					board[compMove] = "o";
				}
			if(winning(board,computer)){
				loss++
				$(".comp-score").html(" " + loss);
				$("#starter").html("<h3>Computer wins!</h3>")
				$(".message").html("Computer wins!")
				$("table").fadeOut(500,function(){
					$(".game-end").fadeIn(500);
				})
			} else if(winning(board,huPlayer)){
				win++;
				$(".player-score").html(" " + win);
				$("#starter").html("<h3>Player wins!</h3>")
				$(".message").html("Player wins!")
				$("table").fadeOut(500,function(){
					$(".game-end").fadeIn(500);
				})
			} else if(round > 8){
				draw++;
				$(".draw-score").html(" " + draw);
				$("#starter").html("<h3>Draw!</h3>")
				$(".message").html("It's a Draw!")
				$("table").fadeOut(500,function(){
					$(".game-end").fadeIn(500);
				})	
			}
		}
	}


	$("td").click(function(){
		var index = $(this).attr("id");
		if(state === true && turn === "player"){
			console.log(round);
			$(this).addClass("select");
			if(huPlayer === "x"){
				if(board[index] != "x" && board[index] != "o"){
					round++;
					turn = "computer";
					$(this).html(x);
					board[index] = "x";
					callAI();
				}
			} else if(huPlayer === "o"){
				if(board[index] != "x" && board[index] != "o"){
					round++;
					turn = "computer";
					$(this).html(o);
					board[index] = "o";
					callAI();
				}
			}
		}
	})

	$(".replay").click(function(){
		$(".game-end").fadeOut(400, function(){
			$("table").fadeIn(400);
		})
		reset();
	})
})