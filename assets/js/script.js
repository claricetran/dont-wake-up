// main game elements
var mainGameBackBtn = document.getElementById("main-back-btn")
var mainGameContinueBtn = document.getElementById("main-continue-btn")
var dialogueTextEl = document.getElementById("dialogueText")
var yesEl = document.getElementById("yes")
var noEl = document.getElementById("no")
var dialogueNextBnt = document.getElementById("dialogueBtn")
var divA1 = document.getElementById("a1")
var divA5 = document.getElementById("a5")
var divC3 = document.getElementById("c3")

yesEl.style.display = "none"
noEl.style.display = "none"

// hangman game elements
var wordPool = ["elves", "human", "dwarf", "castle", "forest", "dragon", "princess", "witch", "troll"]
var randomWord;
var maskedWord = [];
var timeLeft = 60;
var wordsFound = 0;

// var miniGameContainer = document.createElement("div")
// miniGameContainer.setAttribute("id", "miniGame")

// var miniGameTitle = document.createElement("p")
// miniGameTitle.textContent = "The Hangman Game"

// var wordFoundEl = document.createElement("p")
// wordFoundEl.setAttribute("id", "wordsFound")

var startMiniGameBtn = document.getElementById("hangmanStartBtn")
// startMiniGameBtn.setAttribute("")

// miniGameContainer.appendChild(miniGameTitle)
// miniGameTitle.append(wordFoundEl)

var wordEl = document.getElementById("wordToFind")
var wordFoundEl = document.getElementById("wordsFound")
var timeLeftEl = document.getElementById("timeLeft")

dialogueNextBnt.addEventListener("click", function() {
    
})



startMiniGameBtn.addEventListener("click", function() {
    mainGameBackBtn.setAttribute("class", "nes-btn is-disabled");
    countdown();
    randomizer();
    wordEl.textContent = maskedWord.join(" ");
    startMiniGameBtn.style.display = "none"
})

function randomizer() {
    maskedWord = [];
    randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    for(var i = 0; i < randomWord.length; i++) {
        maskedWord.push("_");
        wordEl.textContent = maskedWord.join(" ");
    }
};

var key;

function letterInWord() {
    for(var i = 0; i < randomWord.length; i++) {
        if(randomWord[i] === key) {
            maskedWord.splice([i], 1, randomWord[i]);
            wordEl.textContent = maskedWord.join(" ");
            if(!maskedWord.includes("_")){
                wordsFound++
                wordFoundEl.textContent = wordsFound + "/5 words";
                setTimeout(randomizer(), 1000)
                return;
            } 
        }
    }
}

document.addEventListener("keydown", keydownAction);

function keydownAction(event) {
    key = event.key.toLowerCase();
    return letterInWord();
}

function countdown() {
    timeLeft = 30;
    timerInterval = setInterval(function() {
        timeLeft--;
        timeLeftEl.textContent = timeLeft + " seconds"
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            randomWord = '';
            maskedWord = [];
            wordEl.textContent = "Time is up!";
            if(wordsFound < 5) {
                wordEl.textContent = "Game over!";
                dialogueTextEl.textContent = "You did not make it in time! you only found " + wordsFound + " out of 5 words. You lost 1 life... Would you like to try again?"
                mainGameBackBtn.setAttribute("class", "nes-btn");
                yesEl.style.display = "block"
                noEl.style.display = "block"
            } else if(wordsFound === 5) {
                dialogueTextEl.textContent = "You have successfully found all 5 words! Congratulations! You gained 500 XP";
                yesEl.style.display = "none"
                noEl.style.display = "none"
                mainGameContinueBtn.setAttribute("class", "nes-btn");
            } else {
                var addXP = ((wordsFound-5)*10)+500;
                var extraWords = (wordsFound-5);
                dialogueTextEl.textContent = "You have successfully found all 5 words and " + extraWords + " extra words! Congratulations! You gained " + addXP + "XP."
                yesEl.style.display = "none"
                noEl.style.display = "none"
                mainGameContinueBtn.setAttribute("class", "nes-btn");
            }
        }
    }, 1000)
}

