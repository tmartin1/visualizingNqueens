var nQueens = function() {
	var N = Math.floor(document.getElementById("nSet").value);
	if (N > 15) N = 15;
	var legals = [], cache = [], solutions = [], currentSolution = [];
	// Build chess board.
	for (var i=0; i<(N*N); i++) {
	  legals[i] = 0;
	}

	var placeQueens = function(rowNumber) {
	  if (rowNumber === N) {
	    // base case
	    solutions.push(currentSolution.slice());
	  } else {
	    // recursive case
	    for (var i=0; i<N; i++) {
	      var position = rowNumber*N+i;
	      if (legals[position] === 0) {
	        // place queen on first legal square in row.
	        currentSolution.push(i);
	        for (var j=0; j<cache[position].length; j++) {
	          legals[cache[position][j]] += 1;
	        }
	        // place next queen.
	        placeQueens(rowNumber+1);
	        // pick queen up, continue to look through row.
	        for (var j=0; j<cache[position].length; j++) {
	          legals[cache[position][j]] -= 1;
	        }
	        currentSolution.pop();
	      }
	    }
	  }
	};

	var buildCache = function() {
	  for (var i=0; i<(N*N); i++) {
	    cache.push(cachedLegals(i,1).slice());
	  }
	};

	var cachedLegals = function(target, modifier) {
	  var results = [];
	  var tdiv = Math.floor(target / N);
	  var tmod = target % N;
	  for (var i=0; i<(N*N); i++) {
	    var idiv = Math.floor(i / N);
	    var imod = i % N;
	    // check each cell for threat, modify status if threatened.
	    if (idiv===tdiv || imod===tmod || (idiv+imod)===(tdiv+tmod) || (idiv-imod)===(tdiv-tmod)) {
	      results.push(i);
	    }
	  }
	  return results;
	};

	var printBoard = function() {
		document.getElementById("display").innerHTML = "";
	  
	  (function timedDisplay(board) {
		  // for (var board = 0; board < num; board++) {
		  setTimeout(function() {
		    var printed = "";
		    for (var y = 0; y < N; y++) {
		      var line = "";
		      var queenPosition = solutions[board][y];
		      for (x = 0; x < N; x++) {
		        if (x === queenPosition) {
		          line += String.fromCharCode(9813); // queen char code
		        } else {
		          if ((y+x)%2 === 0) line += String.fromCharCode(9634); // white square
		          else line += String.fromCharCode(9641); // black square
		        }
		      }
		      printed += "<br>"+line;
		    }
		    document.getElementById("display").innerHTML = printed;
		  	if (++board < solutions.length) timedDisplay(board);
		  // }
			}, 1000/Math.sqrt(solutions.length/(solutions.length/100)))
	  })(0);
	};



	var start = new Date().getTime();
	buildCache();
	placeQueens(0);
	var end = new Date().getTime();
	var runtime = end - start;
	// Results are found, ask user if they want to see results.
	var message = solutions.length+' solutions found for '+N+' queens in '+runtime+'ms.';
	document.getElementById("displayHeader").innerHTML = message;
	printBoard();
};