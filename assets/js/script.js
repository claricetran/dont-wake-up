// Global variables and document selectors
var playerCharacter = JSON.parse(localStorage.getItem("playerCharacter"));
var playerImage = document.getElementById("adventurer");
var playerName = document.getElementById("name");
var playerLevel = document.getElementById("currLevel")
var playerHealth = document.getElementById("health");
var playerXP = document.getElementById("xp");
var heartOne = document.getElementById("1");
var heartTwo = document.getElementById("2");
var heartThree = document.getElementById("3");
var dialogueTextEl = document.getElementById("dialogueText");
var mainStoryTextEl = document.getElementById("mainStoryText")


// Retrieving values from local storage and displaying them in character display panel
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

displayLives();

// Restart Button On-Click
var resetBtn = document.getElementById("restartBtn");
resetBtn.addEventListener("click", restartGame);

function restartGame() {
    localStorage.clear();
    location.href = "./index.html"
}

// change heart classes based on lives
function displayLives() {
    if (adventurerLives == 2.5) {
        heartThree.classList.add("is-half");
    }
    else if (adventurerLives == 2) {
        heartThree.classList.add("is-transparent");
    }
    else if (adventurerLives == 1.5) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-half");
    }
    else if (adventurerLives == 1) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-transparent");
    }
    else if (adventurerLevel == 0.5) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-transparent");
        heartOne.classList.add("is-half");
    }
    else if (adventurerLives == 0) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-transparent");
        heartOne.classList.add("is-transparent");
    }
    else {
        // leave heart classes as they are
    }
}

// main game elements
var mainGameBackBtn = document.getElementById("main-back-btn")
var mainGameContinueBtn = document.getElementById("main-continue-btn")

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
dialogueNextBnt.style.display = "none"

// Display dialogue one letter at a time
var allowNextDialogue = false;
var allowNextGame = true;
var gameIsPlaying = false;

function printMessage(destination, message, speed) {
    destination.innerHTML = ""
    var i = 0;
    var interval = setInterval(function () {
        destination.innerHTML += message.charAt(i);
        allowNextDialogue = false
        i++;
        if (i >= message.length) {
            allowNextDialogue = true
            clearInterval(interval);
        }
    }, speed);

}

// playCombat()

function playCombat() {
    gameGridEl.style.backgroundImage = "url(./assets/images/backgrounds/cave.png)"
    printMessage(mainStoryTextEl, "You finally reach the end of the cave and gasp with relive when you notice the stary night at the end of the tunnel", 30);
    mainGameContinueBtn.setAttribute("class", "nes-btn");

    mainGameContinueBtn.addEventListener("click", function () {
        if (allowNextDialogue && allowNextGame && !gameIsPlaying) {
            gameIsPlaying = true
            mainGameContinueBtn.setAttribute("class", "nes-btn is-disabled");
            mainGameBackBtn.setAttribute("class", "nes-btn is-disabled");
            startCombatGame("troll-lord-appearing", "e3", "troll-lord", "The only reason a warrior is alive is to fight, and the only reason a warrior fights is to win.", "Oh no! You ran into and Enemy. The Troll Lord isn't pleased to see a hero in his territory. If you want to pass, you will have to defeat him! Click on the enemy to deal damage once the game starts.")
            allowNextGame = false;
        }
    })

}

function makeEnemyAppear(enemyFileName, divId, newFileName) {
    var enemyEl = document.createElement("img")
    enemyEl.src = "./assets/images/characters/" + enemyFileName + ".png"

    var divContainer = document.getElementById(divId)
    divContainer.appendChild(enemyEl)

    var nextEnemyEl = document.createElement("img")
    nextEnemyEl.src = "./assets/images/characters/" + newFileName + ".png"
    nextEnemyEl.setAttribute("id", "targetEnemy")
    divContainer.appendChild(nextEnemyEl)
    enemyEl.setAttribute("class", "fade-out-image")
    function changeImage() {
        enemyEl.remove()
    }
    setTimeout(changeImage, 4500)
}

function startCombatGame(enemyAppear, position, enemyAfter, dialogue, story) {
    dialogueNextBnt.style.display = "block"
    makeEnemyAppear(enemyAppear, position, enemyAfter)
    printMessage(dialogueTextEl, dialogue, 30)
    printMessage(mainStoryTextEl, story, 30)
    var messageEl = document.createElement("h2")
    messageEl.setAttribute("id", "combatMessage")
    allowNextDialogue = false;
    dialogueNextBnt.addEventListener("click", function () {
        if (allowNextDialogue) {
            allowNextGame = true
            countdownTime = 4
            messageEl.textContent = "Ready?"
            divC3.appendChild(messageEl)
            countdown = setInterval(function () {
                countdownTime--
                messageEl.textContent = countdownTime
                if (countdownTime < 0) {
                    clearInterval(countdown)
                    messageEl.textContent = "Attack!"
                }
            }, 1000)
            setTimeout(startCombat, 4000)
        }
    })

    function startCombat() {
        messageEl.remove()
        var enemyHealth = 20
        var enemyHealthProgress = document.createElement("progress")
        enemyHealthProgress.setAttribute("class", "nes-progress is-success")
        enemyHealthProgress.setAttribute("id", "enemyHealthBar")
        enemyHealthProgress.setAttribute("value", enemyHealth)
        enemyHealthProgress.setAttribute("max", enemyHealth)
        divC3.appendChild(enemyHealthProgress)
        var targetEnemyEl = document.getElementById("targetEnemy")
        targetEnemyEl.addEventListener("click", function () {
            enemyHealth--
            enemyHealthProgress.setAttribute("value", enemyHealth)
            console.log(enemyHealth)
        })
        timerInterval = setInterval(function () {
            if (enemyHealth > 0) {
                adventurerHealth = adventurerHealth - 20
                playerHealth.setAttribute("value", adventurerHealth);
            } else {
                clearInterval(timerInterval)
                enemyHealthProgress.remove()
                targetEnemyEl.remove()
                messageEl.textContent = "Victory!"
                printMessage(dialogueTextEl, "Aaargh...", 30)
                printMessage(mainStoryTextEl, "You defeated the enemy and are able to pass!", 30)
                mainGameContinueBtn.setAttribute("class", "nes-btn")
                divC3.appendChild(messageEl)
                mainGameContinueBtn.addEventListener("click", function () {
                    return
                })
            }
            if (adventurerHealth <= 0) {
                clearInterval(timerInterval)
                enemyHealthProgress.remove()
                messageEl.textContent = "Defeated"
                divC3.appendChild(messageEl)
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


