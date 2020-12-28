var questionList = [
  {
    question: "1) Commonly used data types DO NOT include:",
    answers: ["strings", "booleans", "alerts", "numbers"],
    correctAnswer: 3
  },
  {
    question: "2) The condition in an if / else statement is enclosed within ____.",
    answers: ["quotes", "curly brackets", "parentheses", "square brackets"],
    correctAnswer: 3
  },
  {
    question: "3) Arrays in JavaScript can be used to store ____.",
    answers: ["numbers and strings", "other arrays", "booleans", "all of the above"],
    correctAnswer: 4
  },
  {
    question: "4) String values must be enclosed within ____ when being assigned to variables.",
    answers: ["commas", "curly brackets", "quotes", "parentheses"],
    correctAnswer: 3
  },
  {
    question: "5) A very useful tool used during development and debugging for printing content to the debugger is:",
    answers: ["JavaScript", "terminal / bash", "for loops", "console.log"],
    correctAnswer: 4
  },
  {
    question: "6) Which of the following will check if the variable 'x' is equal in both value and type to the variable 'y'?",
    answers: ["x = y", "x == y", "x === y", "x != y"],
    correctAnswer: 3
  }
];

var viewScoresDiv = document.getElementById("view-high-scores");
var resultDiv = document.getElementById("result-block");
var resultText = document.getElementById("result-text");
var timerDiv = document.getElementById("timer-div");
var timeCounter = document.getElementById("timer");
var scoreTableBody = document.getElementById("score-table-body");

var startBtn = document.getElementById("start-btn");
var answerBtnDiv = document.getElementById("answer-btns");
var returnBtn = document.getElementById("return-btn");
var submitScoreBtn = document.getElementById("submit-score-btn");
var clearScoresBtn = document.getElementById("clear-score-btn");

var submitScoreForm = document.getElementById("submit-score-form");
var initialInput = document.getElementById("init-enter");

var currentQuestion;
var currentTime;
var timerInterval;
var resultTimeout;
var scoreList;

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

/* Removes a component by ID by setting its display to 'none' */
function hideID(id) {
  var element = document.getElementById(id);

  element.style.display = "none";
}

/* Removes a component by ID by setting its display to empty string */
function showID(id) {
  var element = document.getElementById(id);

  element.style.display = "";
}

/* Set the start of the quiz */
function initializePage() {
  showID("start-page");
  hideID("question-page");
  hideID("result-block");
  hideID("complete-page");
  hideID("high-score-page");
  viewScoresDiv.style.visibility = "visible";
  timerDiv.style.visibility = "hidden";
}

/* Updates the question and answer text to the specified question index */
function updateQuestion(qIdx) {
  var questionText = document.getElementById("question-text");

  if (qIdx < questionList.length) {
    questionText.textContent = questionList[qIdx].question;

    for (var i = 0; i < 4; i++) {
      var answerText = document.getElementById("answer-btn-" + (i + 1));
      answerText.textContent = (i + 1) + ". " + questionList[qIdx].answers[i];
    }
  }
}

/* changes the quiz to the final score page */
function finishQuiz() {
  var scoreDisplay = document.getElementById("final-score");
  clearInterval(timerInterval);

  hideID("question-page");
  timerDiv.style.visibility = "hidden";
  scoreDisplay.textContent = currentTime;
  initialInput.value = "";
  showID("complete-page");
}

/* Ends the quiz when the timer expires */
function updateTimer(adjust) {
  currentTime = currentTime + adjust > 0 ? currentTime + adjust : 0;
  timeCounter.textContent = currentTime;

  if (currentTime === 0) {
    finishQuiz();
  }
}

/* Gets high scores from local storage */
function loadScores() {
  scoreList = JSON.parse(localStorage.getItem("highScores")) || [];
}

/* High score page */
function showScores() {
  loadScores();

  /* High score table updates */
  scoreTableBody.innerHTML = "";
  for (var i = 0; i < scoreList.length; i++) {
    var tableRow = document.createElement("tr");
    var initialsData = document.createElement("td");
    var scoreData = document.createElement("td");

    initialsData.textContent = scoreList[i].initials;
    scoreData.textContent = scoreList[i].score;

    tableRow.append(initialsData);
    tableRow.append(scoreData);

    scoreTableBody.append(tableRow);
  }
  showID("high-score-page");
}

/* Add listener to start quiz when Start button is clicked */
startBtn.addEventListener("click", function () {
  /* Hide 'View High Scores' */
  viewScoresDiv.style.visibility = "hidden";

  /* Show Timer */
  timerDiv.style.visibility = "visible";

  /* Hide start page */
  hideID("start-page");

  /* Load first question */
  currentQuestion = 0;
  updateQuestion(0);

  /* Show question page */
  showID("question-page");

  /* Start timer countdown */
  currentTime = 75;
  timeCounter.textContent = currentTime;
  timerInterval = setInterval(function () {
    updateTimer(-1);
  }, 1000);
});

/* Add listener to question answer buttons */
answerBtnDiv.addEventListener("click", function (event) {
  if (event.target.matches("button")) {
    /* Check if answer is correct */
    if (event.target.id === "answer-btn-" + questionList[currentQuestion].correctAnswer) {
      resultText.textContent = "Correct!";
      sfxRight.play();
    } else {
      updateTimer(-10);
      resultText.textContent = "Wrong!";
      sfxWrong.play();
    }
    showID("result-block");

    /* Hide result of previous question after 2 seconds */
    clearTimeout(resultTimeout);
    resultTimeout = setTimeout(function () {
      hideID("result-block");
    }, 2000);

    /* Remove focus from button */
    event.target.blur();

    /* Moves to next question or finishes quiz on last question */
    currentQuestion++;
    if (currentQuestion < questionList.length) {
      updateQuestion(currentQuestion);
    } else {
      finishQuiz();
    }
  }
});

/* Add listener to View High Scores div to move directly to high score page */
viewScoresDiv.addEventListener("click", function () {
  hideID("start-page");
  viewScoresDiv.style.visibility = "hidden";
  showScores();
})

/* Add listener to 'Return' button to reinitialize to start condition */
returnBtn.addEventListener("click", initializePage);

/* Add listener to 'Submit Score' form to add score to storage and open score page */
submitScoreForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (initialInput.value != "") {
    /* add initials & score to score array */
    var newScore = {
      initials: initialInput.value,
      score: currentTime
    }
    scoreList.push(newScore);

    /* Sort new array to keep scores in order */
    scoreList.sort(function (a, b) {
      if (a.score < b.score) {
        return 1
      } else if (a.score > b.score) {
        return -1;
      } else {
        return 0;
      }
    })

    /* Store new scores list in local storage */
    localStorage.setItem("highScores", JSON.stringify(scoreList));
    hideID("complete-page");
    showScores();
  }
})

/* Clear score function */
clearScoresBtn.addEventListener("click", function (event) {
  event.target.blur();
  localStorage.removeItem("highScores");
  showScores();
})

/* Initialization */
loadScores();