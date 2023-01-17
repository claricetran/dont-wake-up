// Global variables
var category = "dreams";
var gameStatus = localStorage.getItem("gameStatus");

// Document selectors
var quoteEl = document.getElementById("quote");
var authorEl = document.getElementById("author");
var creditsBtn = document.getElementById("credits-btn");
var sleepBtn = document.getElementById("sleep-btn");
var creditsContainer = document.getElementById("credits-container");
var creditEl = document.getElementById("credits");
var endPageContent = document.getElementById("endpage-content");
var scoreBtn = document.getElementById("score-btn");
var winLossMessage = document.getElementById("win-loss-message");
var winContent = document.getElementById("win-content");
var loseContent = document.getElementById("lose-content");

winLossContent();
// api call to set endgame quote
var requestURL = "https://api.api-ninjas.com/v1/quotes?category=" + category;
fetch(requestURL, {
    method: 'GET',
    headers: {
        "X-API-Key": "a2HXv80M0uUmoqw0uk1UTw==ZCjZMFcvapnCJVkD"
    }
})
.then(function(response){
    return response.json();
})
.then(function(data){
    var quote = data[0].quote;
    var author = data[0].author;
    quoteEl.textContent = quote;
    authorEl.textContent = (" - " + author);
});

// sets end game content depending on whether the player wins or loses
function winLossContent(){
    if (gameStatus == "lost")
    {   
        winContent.classList.add("hidden");
        loseContent.classList.remove("hidden");
        winLossMessage.innerText = "You woke up before you could finish the story...";
    }
    else if (gameStatus == "win")
    {
        winContent.classList.remove("hidden");
        loseContent.classList.add("hidden");
        winLossMessage.innerText = "Congratulations! You made it through the night and completed the story";
    }
    else
    {
        runCredits();
        creditEl.addEventListener("animationend", function(){
            location.href = "./index.html"
        });
    }
}

function runCredits(){
    endPageContent.classList.add("hidden");
    creditsContainer.classList.remove("hidden");
}

function returnToPage(){
    endPageContent.classList.remove("hidden");
    creditsContainer.classList.add("hidden");
}

function submitScore(){
    location.href = "./scores.html"
}

function backToSleep(){
    location.href = "./index.html";
}

creditsBtn.addEventListener("click", runCredits);
creditEl.addEventListener("animationend", returnToPage);
scoreBtn.addEventListener("click", submitScore);
sleepBtn.addEventListener("click", backToSleep);