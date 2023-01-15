var quoteEl = document.getElementById("quote");
var authorEl = document.getElementById("author");
var category = "dreams";

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