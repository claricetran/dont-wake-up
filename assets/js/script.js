
// Retrieving values from local storage and displaying them in character display panel
var playerCharacter = JSON.parse(localStorage.getItem("playerCharacter"));
var playerImage = document.getElementById("adventurer");
var playerName = document.getElementById("name");
var playerLevel = document.getElementById("currLevel")
var playerHealth = document.getElementById("health");
var playerXP = document.getElementById("xp");

var adventurerImg = playerCharacter.src;
var adventurerName = playerCharacter.characterName;
var adventurerLevel = playerCharacter.level;
var adventurerHealth = playerCharacter.health;
var adventurerDamage = playerCharacter.damage;
var adventurerXP = playerCharacter.xp;
var adventurerLives = playerCharacter.lives;

playerImage.setAttribute("src", adventurerImg);
playerName.textContent = adventurerName;
playerLevel.textContent = adventurerLevel;
playerHealth.setAttribute("value", adventurerHealth);
playerHealth.setAttribute("max", 250);
playerXP.setAttribute("value", adventurerXP);

// Restart Button On-Click
var resetBtn = document.getElementById("restartBtn");
resetBtn.addEventListener("click", restartGame);

function restartGame() {
    localStorage.clear();
    location.href = "./index.html"
}

// main game elements
var mainGameBackBtn = document.getElementById("main-back-btn")
var mainGameContinueBtn = document.getElementById("main-continue-btn")
var dialogueTextEl = document.getElementById("dialogueText")
var yesEl = document.getElementById("yes")
var noEl = document.getElementById("no")
var dialogueNextBnt = document.getElementById("dialogueBtn")
var gameGridEl = document.getElementById("gameScreenGrid")
var divA1 = document.getElementById("a1")
var divA3 = document.getElementById("a3")
var divA5 = document.getElementById("a5")
var divC3 = document.getElementById("c3")

yesEl.style.display = "none"
noEl.style.display = "none"

gameGridEl.style.backgroundImage = "url(./assets/images/backgrounds/cave.png)"

function makeEnemyAppear(enemyFileName, divId, newFileName) {
    var enemyEl = document.createElement("img")
    enemyEl.src = "./assets/images/characters/" + enemyFileName + ".png"
    enemyEl.setAttribute("id", "targetEnemy")
    var divContainer = document.getElementById(divId)
    divContainer.appendChild(enemyEl)
    function changeImage() {
        enemyEl.src = "./assets/images/characters/" + newFileName + ".png"
    }
    setTimeout(changeImage, 1000)
}

playCombat("troll-lord-appearing", "e3", "troll-lord")

function playCombat(enemyAppear, position, enemyAfter) {
    makeEnemyAppear(enemyAppear, position, enemyAfter)
    
    var endMessageEl = document.createElement("h2")
    endMessageEl.setAttribute("id", "combatMessage")


    
    function startCombat() {
        var enemyHealth = 20
        var enemyHealthProgress = document.createElement("progress")
        enemyHealthProgress.setAttribute("class", "nes-progress is-success enemyHealthBar")
        enemyHealthProgress.setAttribute("id", "enemyHealthBar")
        enemyHealthProgress.setAttribute("value", enemyHealth)
        enemyHealthProgress.setAttribute("max", enemyHealth)
        divC3.appendChild(enemyHealthProgress)
        var targetEnemyEl = document.getElementById("targetEnemy")
        targetEnemyEl.addEventListener("click", function () {
            enemyHealth--
            enemyHealthProgress.setAttribute("value", enemyHealth)
            console.log(enemyHealth)
            if(enemyHealth <= 0){
                enemyHealthProgress.remove()
                targetEnemyEl.remove()
                endMessageEl.textContent = "Victory!"
                divC3.appendChild(endMessageEl)
            }
        })
        timerInterval = setInterval(function () {
            if(enemyHealth > 0) {
                adventurerHealth = adventurerHealth - 20
                playerHealth.setAttribute("value", adventurerHealth);
            }
            if (adventurerHealth <= 0 || enemyHealth <= 0) {
                clearInterval(timerInterval)
                enemyHealthProgress.remove()
                endMessageEl.textContent = "Defeated"
                divC3.appendChild(endMessageEl)
            }
        }, 1000)
    }
}

// Hangman Game function
function playHangman() {
    // hangman game elements
    var wordPool = ["elves", "human", "dwarf", "castle", "forest", "dragon", "princess", "witch", "troll"]
    var randomWord;
    var maskedWord = [];
    var timeLeft = 30;
    var wordsFound = 0;

    // generating hangman game element
    var miniGameContainer = document.createElement("div")
    miniGameContainer.setAttribute("id", "miniGame")

    var miniGameTitle = document.createElement("p")
    miniGameTitle.textContent = "The Hangman Game"

    var wordEl = document.createElement("p")
    wordEl.setAttribute("id", "wordToFind")

    var startMiniGameBtn = document.createElement("button")
    startMiniGameBtn.textContent = "Start!"
    startMiniGameBtn.setAttribute("id", "hangmanStartBtn")

    miniGameContainer.appendChild(miniGameTitle)
    miniGameContainer.appendChild(wordEl)
    miniGameContainer.appendChild(startMiniGameBtn)

    divC3.appendChild(miniGameContainer)

    // generating hangman words found element
    var wordsFoundEl = document.createElement("p")
    wordsFoundEl.setAttribute("id", "wordsFound")
    wordsFoundEl.textContent = "0/5 words"

    // var wordsFoundContainer = document.createElement("div")
    // wordsFoundContainer.setAttribubte("id", "wordsFoundContainer")
    // wordsFoundContainer.appendChild(wordsFoundEl)
    divA1.appendChild(wordsFoundEl)

    // generating hangman timeer element
    var timeLeftContainer = document.createElement("div")
    timeLeftContainer.setAttribute("id", "timer")
    var timeLeftText = document.createElement("p")
    timeLeftText.textContent = "time left"
    var timeLeftEl = document.createElement("p")
    timeLeftEl.setAttribute("id", "timeLeft")
    timeLeftEl.textContent = timeLeft + " seconds"

    timeLeftContainer.appendChild(timeLeftText)
    timeLeftContainer.appendChild(timeLeftEl)

    divA5.appendChild(timeLeftContainer)

    dialogueNextBnt.addEventListener("click", function () {

    })

    startMiniGameBtn.addEventListener("click", function () {
        mainGameBackBtn.setAttribute("class", "nes-btn is-disabled");
        countdown();
        randomizer();
        wordEl.textContent = maskedWord.join(" ");
        startMiniGameBtn.style.display = "none"
    })

    function randomizer() {
        maskedWord = [];
        randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        for (var i = 0; i < randomWord.length; i++) {
            maskedWord.push("_");
            wordEl.textContent = maskedWord.join(" ");
        }
    };

    var key;

    function letterInWord() {
        for (var i = 0; i < randomWord.length; i++) {
            if (randomWord[i] === key) {
                maskedWord.splice([i], 1, randomWord[i]);
                wordEl.textContent = maskedWord.join(" ");
                if (!maskedWord.includes("_")) {
                    wordsFound++
                    wordsFoundEl.textContent = wordsFound + "/5 words";
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
        timerInterval = setInterval(function () {
            timeLeft--;
            timeLeftEl.textContent = timeLeft + " seconds"
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                randomWord = '';
                maskedWord = [];
                wordEl.textContent = "Time is up!";
                if (wordsFound < 5) {
                    wordEl.textContent = "Game over!";
                    dialogueTextEl.textContent = "You did not make it in time! you only found " + wordsFound + " out of 5 words. You lost 1 life... Would you like to try again?"
                    mainGameBackBtn.setAttribute("class", "nes-btn");
                    yesEl.style.display = "block"
                    noEl.style.display = "block"
                } else if (wordsFound === 5) {
                    dialogueTextEl.textContent = "You have successfully found all 5 words! Congratulations! You gained 500 XP";
                    yesEl.style.display = "none"
                    noEl.style.display = "none"
                    mainGameContinueBtn.setAttribute("class", "nes-btn");
                } else {
                    var addXP = ((wordsFound - 5) * 10) + 500;
                    var extraWords = (wordsFound - 5);
                    dialogueTextEl.textContent = "You have successfully found all 5 words and " + extraWords + " extra words! Congratulations! You gained " + addXP + "XP."
                    yesEl.style.display = "none"
                    noEl.style.display = "none"
                    mainGameContinueBtn.setAttribute("class", "nes-btn");
                }
            }
        }, 1000)
    }
}

