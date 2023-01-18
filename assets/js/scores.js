// Global variables
var allScoresString = localStorage.getItem("allScores");
var allScores = JSON.parse(allScoresString) || [];

// Document selectors
var scoreBoardList = document.getElementById("score-board-list");
var clearBtn = document.getElementById("clear-scores");
var returnBtn = document.getElementById("return-title-btn");

// append a list item for each score stored in local storage
allScores.forEach((item) => {
    var scoreItem = document.createElement("li");
    scoreItem.innerText = item.username + " - " + item.characterName + " - " + item.score;
    scoreBoardList.appendChild(scoreItem);
});

function clearScores(){
    var scoreBoardList = document.getElementById("score-board-list");
    localStorage.clear(allScores);
    for (var i=0; li=scoreBoardList[i]; i++){
        li.parentNode.removeChild(li);
    }
    location.reload()
}

clearBtn.addEventListener("click", clearScores);
returnBtn.addEventListener("click", function(){
    location.href = "./index.html";
})
