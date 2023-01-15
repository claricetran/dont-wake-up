// Global variables and document selectors
var category = "dreams";

var quoteEl = document.getElementById("quote");
var authorEl = document.getElementById("author");
var creditsBtn = document.getElementById("credits-btn");
var creditsContainer = document.getElementById("credits-container");
var creditEl = document.getElementById("credits");
var endPageContent = document.getElementById("endpage-content");

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

function runCredits(){
    endPageContent.classList.add("hidden");
    creditsContainer.classList.remove("hidden");
}

function returnToPage(){
    endPageContent.classList.remove("hidden");
    creditsContainer.classList.add("hidden");
}

creditsBtn.addEventListener("click", runCredits);
creditEl.addEventListener("animationend", returnToPage);