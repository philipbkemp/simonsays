level = 0;
rows = 2;
cols = 2;
pattern = [];
patternShowIndex = -1;
speed = 1000;
delay = 500;
guess = [];
fails = 0;
levelsUp = 0;
grade = 0;

$(document).ready(function(){

	levelUp();

});

function showPattern() {
	if ( patternShowIndex < pattern.length ) {
		$($(".square")[pattern[patternShowIndex]-1]).css({opacity:"1"});
		setTimeout(showNextPattern,speed);
	} else {
		$("#grid").addClass("active");
		$(".square").off("click");
		$(".square").on("click",function(){
			guess.push( $(this).attr("data-index") );
			checkGuess();
		});
	}
}

function checkGuess() {
	if ( guess.length > pattern.length ) {
		return wasWrong();
	}

	for ( let i=0 ; i<guess.length ; i++ ) {
		if ( parseInt(guess[i]) !== parseInt(pattern[i]) ) {
			return wasWrong();
		}
	}

	if ( guess.length === pattern.length ) {
		return wasRight();
	}
}

function wasWrong() {
	$(".square").off("click");
	$("#grid").removeClass("active");
	fails++;
	$("#grid").addClass("failed");
	guess = [];
	patternShowIndex = -1;
	if ( fails < 3 ) {
		setTimeout(retry,2000);
	} else {
		setTimeout(gameOver,2000);
	}
}

function gameOver() {
	$("#grid").removeClass("active");
	$("#grid").addClass("game-over");
}

function wasRight() {
	$(".square").off("click");
	$("#grid").removeClass("active");
	$("#grid").addClass("passed");
	guess = [];
	patternShowIndex = -1;
	setTimeout(levelUp,2000);
}

function retry() {
	$("#grid").removeClass("failed");
	$("#grid").addClass("prompt");
	setTimeout(showNextPattern,2000);
}

function levelUp() {
	$("#grid").removeClass("passed");
	level++;
	$("#level").html("Level "+level);

	levelsUp++;
	if ( levelsUp === 5 ) {
		grade++;
	} else if ( levelsUp === 10 ) {
		rows++;
		speed = speed - 100;
		grade++;
	} else if ( levelsUp === 15 ) {
		cols++;
		speed = speed - 100;
		delay = delay - 50;
		levelsUp = 0;
		grade++;
	}

	createGrid(rows,cols);
	$("#grid").addClass("prompt");
	pattern = createPattern( 4+grade, rows+cols );
	setTimeout(showNextPattern,2000);
}

function showNextPattern() {
	$("#grid").removeClass("prompt");
	if ( patternShowIndex >= 0 ) {
		$($(".square")[pattern[patternShowIndex]-1]).css({opacity:""});
	}
	patternShowIndex++;
	setTimeout(showPattern,delay);
}

function createGrid(rows, cols) {

	$(".square").off("click");

	const gridContainer = document.getElementById('grid');
	gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
	gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
	gridContainer.innerHTML = "";

	for (let i = 0; i < rows * cols; i++) {
		const square = document.createElement('div');
		square.classList.add('square');
		square.setAttribute("data-index",i+1);
		square.style.backgroundColor = getRandomHexColour();
		gridContainer.appendChild(square);
	}
}

function getRandomHexColour() {
	let hex = '#';
	for (let i = 0; i < 6; i++) {
		hex += Math.floor(Math.random() * 16).toString(16);
	}
	return hex;
}

function createPattern(l, n) {
	guess = [];

	if (l <= 0 || n <= 0) {
		return [];
	}
	const result = [];
	for (let i = 0; i < l; i++) {
		result.push(Math.floor(Math.random() * n) + 1);
	}
	return result;
}