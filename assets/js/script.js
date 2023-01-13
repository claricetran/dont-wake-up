


var wordPool = ["elves", "human", "dwarf", "castle", "forest", "dragon", "princess", "witch", "troll"]
var randomWord;
var maskedWord = [];
var timeLeft = 60;
var wordsFound = 0;

var startMiniGameBtn = document.getElementById("hangmanStartBtn")
var wordEl = document.getElementById("wordToFind")

startMiniGameBtn.addEventListener("click", function() {
    document.getElementById("main-back-btn").setAttribute("class", "nes-btn is-disabled");
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
                document.getElementById("wordsFound").textContent = wordsFound + "/5 words";
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

document.getElementById("yes").style.display = "none"
document.getElementById("no").style.display = "none"

function countdown() {
    timeLeft = 30;
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById("timeLeft").textContent = timeLeft + " seconds"
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            randomWord = '';
            maskedWord = [];
            wordEl.textContent = "Time is up!";
            if(wordsFound < 5) {
                wordEl.textContent = "Game over!";
                document.getElementById("dialogueText").textContent = "You did not make it in time! you only found " + wordsFound + " out of 5 words. You lost 1 life... Would you like to try again?"
                document.getElementById("main-back-btn").setAttribute("class", "nes-btn");
                document.getElementById("yes").style.display = "block"
                document.getElementById("no").style.display = "block"
            } else if(wordsFound === 5) {
                document.getElementById("dialogueText").textContent = "You have successfully found all 5 words! Congratulations! You gained 500 XP";
                document.getElementById("yes").style.display = "none"
                document.getElementById("no").style.display = "none"
                document.getElementById("main-continue-btn").setAttribute("class", "nes-btn");
            } else {
                var addXP = ((wordsFound-5)*10)+500;
                var extraWords = (wordsFound-5);
                document.getElementById("dialogueText").textContent = "You have successfully found all 5 words and " + extraWords + " extra words! Congratulations! You gained " + addXP + "XP."
                document.getElementById("yes").style.display = "none"
                document.getElementById("no").style.display = "none"
                document.getElementById("main-continue-btn").setAttribute("class", "nes-btn");
            }
        }
    }, 1000)
}

var dialogueNextBnt = document.getElementById("dialogueBtn")

dialogueNextBnt.addEventListener("click", function() {
    
})
