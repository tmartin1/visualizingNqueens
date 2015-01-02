var printing = false;
var nQueens = function() {
	var N = Math.floor($("#nSet").val());
	if (N > 15) N = 15;
	var board = [], cache = [], solutions = [], currentSolution = [];
	for (var i=0; i<(N*N); i++) {
	  board[i] = 0;
	}

	var placeQueens = function(rowNumber) {
	  if (rowNumber === N) {
	    solutions.push(currentSolution.slice());
	  } else {
	    for (var i=0; i<N; i++) {
	      var position = rowNumber*N+i;
	      if (board[position] === 0) {
	        // place queen on first legal square in row.
	        currentSolution.push(i);
	        for (var j=0; j<cache[position].length; j++) {
	          board[cache[position][j]] += 1;
	        }
	        // place next queen.
	        placeQueens(rowNumber+1);
	        // pick queen up, continue to look through row.
	        for (var j=0; j<cache[position].length; j++) {
	          board[cache[position][j]] -= 1;
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

	var start = new Date().getTime();
	buildCache();
	placeQueens(0);
	var end = new Date().getTime();

	var runtime = end - start;
	var message = solutions.length+' solutions found for '+N+' queens in '+runtime+'ms.';
	if (!printing) {
		$('#displayHeader').html(message);
		printBoard(N, solutions);
	}
};

var printBoard = function(N, solutions) {
  if (printing) return;
  printing = true;
	buildDisplay(N);
  (function timedDisplay(board) {
	  setTimeout(function() {
	    // Modify the board
	    for (var i=0; i<solutions[board].length; i++) {
	    	// Clear previously displayed results.
		    if (board > 0) $('#cell'+(solutions[board-1][i]+i*N)).html('');
	    	$('#cell'+(solutions[board][i]+i*N)).html('&#9813;');
	    }
			if (board === solutions.length-1) printing = false;
	  	if (++board < solutions.length) timedDisplay(board);
		}, 1000/Math.sqrt(solutions.length/(solutions.length/100)));
  })(0);
};

var buildDisplay = function(N) {
	$('#display').empty();
	for (var x=0; x<N; x++) {
		var row = $('<tr></tr>');
		for (var y=0; y<N; y++) {
			var cell = $('<td></td>');
			var cellid = 'cell'+((x*N)+y);
			cell.attr({ id: cellid, align: 'center' });
			cell.css({ 'width': '36px',	'height': '36px', 'padding': '0px' });
			if ((y+x)%2 === 1) cell.css("background-color", "LightGray"); // black square
			row.append(cell);
		}
		$('#display').append(row);
	}
};

$(document).ready(function() {
	$('#nSet').keyup(function() {
		if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
       this.value = this.value.replace(/[^0-9\.]/g, '');
    }
	});

	$('#nSet').keypress(function(e) {
		if(e.which === 13) nQueens();
	});
});