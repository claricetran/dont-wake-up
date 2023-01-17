// Global variables
var category = "dreams";
// var gameStatus = playerCharacter.gameStatus;

// Document selectors
var quoteEl = document.getElementById("quote");
var authorEl = document.getElementById("author");
var creditsBtn = document.getElementById("credits-btn");
var creditsContainer = document.getElementById("credits-container");
var creditEl = document.getElementById("credits");
var endPageContent = document.getElementById("endpage-content");
var scoreBtn = document.getElementById("score-btn");
var winLossMessage = document.getElementById("win-loss-message");
var winContent = document.getElementById("win-content");
var loseContent = document.getElementById("lose-content");

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
// function winLossContent(){
//     if (gameStatus == "loss")
//     {   
//         winContent.classList.add("hidden");
//         loseContent.classList.remove("hidden");
//         winLossMessage.innerText = "You woke up before you could finish the story...";
//     }
//     else
//     {
//         winContent.classList.remove("hidden");
//         loseContent.classList.add("hidden");
//         winLossMessage.innerText = "Congratulations! You made it through the night and completed the story";
//     }
// }

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

creditsBtn.addEventListener("click", runCredits);
creditEl.addEventListener("animationend", returnToPage);
scoreBtn.addEventListener("click", submitScore);