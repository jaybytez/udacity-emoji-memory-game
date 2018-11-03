// All usefull cards and shortcuts to simplify coding
let cards = ['angry', 'dizzy', 'flushed', 'frown', 
            'grimace', 'surprise', 'laugh', 'tired'];
    // Duplicate list to create matching cards     
     cards = cards.concat(cards);
  
    // Variables
let currentSeconds,
    flippedCards = [],
    match = 0,
    second = 0,
    delay = 550,
    totalPairs = cards.length / 2,

    // jQuery selector shortcuts
    $rating = $('.rating'),
    $stars = $('.fa-star'),
    $moves = $('.moves'),
    $timer = $('.timer'),
    $restart = $('.restart'),
    $deck = $('.deck');

// Function that shuffles the cards to ensure uniqueness
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// The init() function starts the game
function init() {

    // The shuffle the cards array
    let allCards = shuffle(cards);
    $deck.empty();

    // Games starts
    flippedCard = [];
    match = 0;
    moves = 0;
    //rating(moves);
    $stars.removeClass('fa-star-o').addClass('fa-star');
    $moves.text('0');

    // A for loop to dynamically create the card layout
    for (let i = 0; i < allCards.length; i++) {
        // The icons are a part of the font awesome library
        // This builds the name dynamically from the array
        $deck.append($('<li class="card"><i class="fa fa-' + 
            allCards[i] + '"></i></li>'))
    }
    // Register the card flip listener now that the cards are placed
    addCardListener();

    // Enables the timer to reset
    resetTimer(currentSeconds);
    second = 0;
    $timer.text(`${second}`)
    initTime();
}

// Adds a score from 1 to 3 stars depending on the amount of moves done
function rating(moves) {
    // 
    let rating = 3;

    // Scoring system from 1 to 3 stars
    let stars3 = 10,
        stars2 = 16,
        star1 = 20;

    if (moves > stars3 && moves < stars2) {
        $stars.eq(3).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars2 && moves < star1) {
        $stars.eq(2).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > star1) {
        $stars.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return {
        score: rating
    };
}

// Add boostrap modal for winner
function gameOver(moves, score) {
    $('#winText').text(`You got a score of ${score} ` +
        `with ${ moves} moves in ${second} seconds.`);
    $('#winModal').modal('toggle');
}

// Clicking on the reset button restarts the game
$restart.bind('click', function(confirmed) {
    if (confirmed) {
        $stars.removeClass('fa-star-o').addClass('fa-star');
        init();
    }
});

// This function validates each card that has been flipped.
let addCardListener = function() {

    // Validate the card that is flipped
    $deck.find('.card').bind('click', function() {
        let $this = $(this);

        if ($this.hasClass('show') || $this.hasClass('match')) {
            return true;
        }

        let card = $this.context.innerHTML;
        $this.addClass('open show');
        flippedCards.push(card);

        // Compares cards
        if (flippedCards.length > 1) {
            if (card === flippedCards[0]) {
                $deck.find('.open').addClass('match');
                setTimeout(function() {
                    $deck.find('open').removeClass('open show');
                }, delay);
                match++;

                // If cards are not match
            } else {
                $deck.find('.open').addClass('notmatch');
                setTimeout(function() {
                    $deck.find('.open').removeClass('open show');
                }, delay / 1.5);
            }

            // The flippedCards array specifies all added cards facing up
            flippedCards = [];

            // Increments moves
            moves++;

            // Moves determine the score
            rating(moves);

            // The number of moves are tracked
            $moves.html(moves);
        }

        // When the game is completed
        if (totalPairs === match) {
            rating(moves);
            let score = rating(moves).score;
            setTimeout(function() {
                gameOver(moves, score);
            }, 500);
        }
    });
}

// Initiates the timer
function initTime() {
    currentSeconds = setInterval(function() {
        $timer.text(`${second}`)
        second = second + 1
    }, 1000);
}

// Resets the timer
function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}

// Invoke init to start()
init();