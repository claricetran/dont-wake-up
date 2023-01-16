// Global variables and document selectors
var playerCharacter = JSON.parse(localStorage.getItem("playerCharacter"));
var playerImage = document.getElementById("adventurer");
var playerName = document.getElementById("name");
var playerLevel = document.getElementById("currLevel");
var playerHealth = document.getElementById("health");
var playerXP = document.getElementById("xp");
var heartOne = document.getElementById("1");
var heartTwo = document.getElementById("2");
var heartThree = document.getElementById("3");


var musicEl = document.getElementById("music");
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
playerXP.setAttribute("max", 100);

displayLives();

// music controls
musicEl.volume = 0.1;
musicEl.loop = true;

// Restart Button On-Click
var resetBtn = document.getElementById("restartBtn");
resetBtn.addEventListener("click", restartGame);

function restartGame() {
    localStorage.clear();
    location.href = "./index.html";
}

// change heart classes based on lives
function displayLives() {
    if (adventurerLives == 2.5) {
        heartThree.classList.add("is-half");
    } else if (adventurerLives == 2) {
        heartThree.classList.add("is-transparent");
    } else if (adventurerLives == 1.5) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-half");
    } else if (adventurerLives == 1) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-transparent");
    } else if (adventurerLevel == 0.5) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-transparent");
        heartOne.classList.add("is-half");
    } else if (adventurerLives == 0) {
        heartThree.classList.add("is-transparent");
        heartTwo.classList.add("is-transparent");
        heartOne.classList.add("is-transparent");
    } else {
        // leave heart classes as they are
    }
}

// main game elements
var mainGameBackBtn = document.getElementById("main-back-btn");
var mainGameContinueBtn = document.getElementById("main-continue-btn");
var dialogueTextEl = document.getElementById("dialogueText");
var storyTextPEl = document.getElementById("storyText");
var dialogueBtnContainer = document.getElementById("dialogueBtnContainer")
var yesEl = document.getElementById("yes");
var noEl = document.getElementById("no");
var dialogueNextBtn = document.getElementById("dialogueBtn");
var gameGridEl = document.getElementById("gameScreenGrid")
var divA1 = document.getElementById("a1");
var divA3 = document.getElementById("a3")
var divA5 = document.getElementById("a5");
var divB3 = document.getElementById("b3")
var divC3 = document.getElementById("c3");


// Display dialogue one letter at a time
var allowNextDialogue = false;
var allowNextGame = true;
var gameIsPlaying = false;

yesEl.style.display = "none";
noEl.style.display = "none";
dialogueNextBtn.style.visibility = "hidden";
mainGameBackBtn.style.visibility = "hidden";

// JSON will be saved to this variable after fetching.
var tale;
var taleArray;
// Track where user's story index is - starts at 0 on init. Needs to be saved to local storage on saves, also needs to load and be updated when reloading saved game.
var taleTracker;
var sceneIndex;
var dialogIndex;

// var continueButtonState = false;
// var dialogButtonState = false;

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

function playTrollCombat() {
    playCombat("url(./assets/images/backgrounds/cave.png)", "You finally reach the end of the cave and gasp with relive when you notice the stary night at the end of the tunnel", "troll-lord-appearing", "troll-lord", "How dare you try to pass through my Kingdom!!", "Oh no! You ran into and Enemy. The Troll Lord isn't pleased to see a hero in his territory. If you want to pass, you will have to defeat him!", 20, 20, "The only reason a warrior is alive is to fight, and the only reason a warrior fights is to win.")
}

function playCombat(backgroundImg, begginingText, enemyAppear, enemyAfter, dialogue, story, enemyHealthPoints, enemyDamagePoints, enemyWinDialogue) {
    adventurerHealth = playerCharacter.health;
    playerHealth.setAttribute("value", adventurerHealth);
    gameIsPlaying = true
    console.log("Game is Playing: " + gameIsPlaying)
    console.log("Combat Game Start")
    gameGridEl.style.backgroundImage = backgroundImg
    allowNextDialogue = false
    printMessage(storyTextPEl, begginingText, 30);
    mainGameContinueBtn.setAttribute("class", "nes-btn");
    mainGameContinueBtn.addEventListener("click", function () {
        if (allowNextDialogue && allowNextGame && gameIsPlaying) {
            mainGameContinueBtn.setAttribute("class", "nes-btn is-disabled");
            startCombatGame()
            allowNextGame = false;
        }
    })

    function startCombatGame() {
        console.log("Enemy Appears")
        var startBtn = document.createElement("button")
        startBtn.setAttribute("class", "nes-btn")
        startBtn.textContent = "Fight!"
        dialogueBtnContainer.appendChild(startBtn)
        makeEnemyAppear(enemyAppear, enemyAfter)
        printMessage(dialogueTextEl, dialogue, 30)
        printMessage(storyTextPEl, story, 30)
        var messageEl = document.createElement("h2")
        messageEl.setAttribute("id", "combatMessage")
        allowNextDialogue = false;
        startBtn.addEventListener("click", function (event) {
            event.preventDefault()
            if (allowNextDialogue) {
                printMessage(storyTextPEl, " Click on the enemy to deal damage once the game starts.", 30)
                startBtn.remove()
                allowNextGame = true
                countdownTime = 4
                messageEl.textContent = "Ready?"
                divB3.appendChild(messageEl)
                countdown = setInterval(function () {
                    countdownTime--
                    messageEl.textContent = countdownTime
                    if (countdownTime < 0) {
                        clearInterval(countdown)
                        messageEl.textContent = "Attack!"
                    }
                }, 1000)
                setTimeout(function () {
                    startCombat()
                }, 4000)
            }
        })
    }

    function startCombat() {
        console.log("Fighting Started")
        var messageEl = document.getElementById("combatMessage")
        messageEl.remove()
        var enemyHealth = enemyHealthPoints
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
        })
        timerInterval = setInterval(function () {
            if (enemyHealth > 0) {
                adventurerHealth = adventurerHealth - enemyDamagePoints
                playerHealth.setAttribute("value", adventurerHealth);
            } else {
                addXPToTotal(adventurerHealth)
                console.log("Player Won")
                clearInterval(timerInterval)
                enemyHealthProgress.remove()
                targetEnemyEl.remove()
                messageEl.textContent = "Victory!"
                printMessage(dialogueTextEl, "Aaargh...", 30)
                var endMessage = "You defeated the enemy and gained " + adventurerHealth + " XP! You are able to continue!"
                printMessage(storyTextPEl, endMessage, 30)
                mainGameContinueBtn.setAttribute("class", "nes-btn")
                divB3.appendChild(messageEl)
                gameIsPlaying = false
                clearMiniGame()
            }
            if (adventurerHealth <= 0) {
                console.log("Player Lost")
                adventurerLives = adventurerLives - 0.5
                displayLives()
                clearInterval(timerInterval)
                enemyHealthProgress.remove()
                messageEl.textContent = "Defeated"
                printMessage(dialogueTextEl, enemyWinDialogue, 30)
                divB3.appendChild(messageEl)
                var restartBtn = document.createElement("button")
                restartBtn.setAttribute("class", "nes-btn")
                restartBtn.textContent = "Try again"
                dialogueBtnContainer.appendChild(restartBtn)
                allowNextDialogue = false;
                restartBtn.addEventListener("click", function (event) {
                    event.preventDefault()
                    if (allowNextDialogue) {
                        console.log("Player is restarting mini game")
                        dialogueTextEl.textContent = ""
                        restartBtn.remove()
                        resetMiniGameGrid()
                        playCombat(backgroundImg, begginingText, enemyAppear, enemyAfter, dialogue, story, enemyHealthPoints, enemyWinDialogue)
                    }
                })

            }
        }, 1000)
    }

    function makeEnemyAppear(enemyFileName, newFileName) {

        var enemyEl = document.createElement("img")
        enemyEl.src = "./assets/images/characters/" + enemyFileName + ".png"

        var divContainer = document.getElementById("e3")
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

}


var RPGwordPool = [
    "elves",
    "human",
    "dwarf",
    "castle",
    "forest",
    "dragon",
    "princess",
    "witch",
    "troll",
];

// playHangman(RPGwordPool, 35, 6)

// Hangman Game function
function playHangman(chosenWordPool, totalTime, nbrOfWords) {
    adventurerHealth = playerCharacter.health;
    yesEl.style.display = "none";
    noEl.style.display = "none";
    mainGameContinueBtn.setAttribute("class", "nes-btn is-disabled");
    printMessage(storyTextPEl, "Find as many words as you can in the time given! If the timer runs out before getting at least 5 words you loose a life. Any extra words give you extra XP !", 20)
    adventurerHealth = playerCharacter.health;
    playerHealth.setAttribute("value", adventurerHealth);
    console.log("Hangman Game Start")
    gameIsPlaying = true
    console.log("Game is Playing: " + gameIsPlaying)
    // hangman game elements
    var wordPool = chosenWordPool
    var randomWord;
    var maskedWord = [];
    var timeLeft = totalTime;
    var wordsFound = 0;

    // generating hangman game element
    var miniGameTitle = document.createElement("p");
    miniGameTitle.textContent = "The Hangman Game";
    miniGameTitle.setAttribute("id", "miniGameTilte")

    var wordEl = document.createElement("p");
    wordEl.setAttribute("id", "wordToFind");

    var startMiniGameBtn = document.createElement("button");
    startMiniGameBtn.textContent = "Start!";
    startMiniGameBtn.setAttribute("id", "hangmanStartBtn");

    divB3.appendChild(miniGameTitle);
    divC3.appendChild(wordEl);
    divC3.appendChild(startMiniGameBtn);

    // generating hangman words found element
    var wordsFoundEl = document.createElement("p");
    wordsFoundEl.setAttribute("id", "wordsFound");
    wordsFoundEl.textContent = "0/" + nbrOfWords +  " words";

    divA1.appendChild(wordsFoundEl);

    var timeLeftEl = document.createElement("p");
    timeLeftEl.setAttribute("id", "timeLeft");
    timeLeftEl.textContent = "Time Left: " + timeLeft + " seconds";

    divA5.appendChild(timeLeftEl);

    startMiniGameBtn.addEventListener("click", function () {
        mainGameBackBtn.setAttribute("class", "nes-btn is-disabled");
        startHangmanGame();
        randomizer();
        wordEl.textContent = maskedWord.join(" ");
        startMiniGameBtn.style.display = "none";
    });

    function randomizer() {
        console.log("Randomizing word")
        maskedWord = [];
        randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        for (var i = 0; i < randomWord.length; i++) {
            maskedWord.push("_");
            wordEl.textContent = maskedWord.join(" ");
        }
    }

    var key;

    function letterInWord() {
        if (!randomWord.includes(key)) {
            adventurerHealth = adventurerHealth - 1
            console.log(adventurerHealth)
            playerHealth.setAttribute("value", adventurerHealth);
        }
        for (var i = 0; i < randomWord.length; i++) {
            if (randomWord[i] === key) {
                maskedWord.splice([i], 1, randomWord[i]);
                wordEl.textContent = maskedWord.join(" ");
                if (!maskedWord.includes("_")) {
                    wordsFound++;
                    wordsFoundEl.textContent = wordsFound + "/" + nbrOfWords + " words";
                    setTimeout(randomizer(), 1000);
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

    function startHangmanGame() {
        console.log("Countdown starts time to find words")
        timeLeft = 30;
        timerInterval = setInterval(function () {
            timeLeft--;
            timeLeftEl.textContent = "Time Left: " + timeLeft + " seconds";
            if (timeLeft <= 0 || adventurerHealth <= 0) {
                clearInterval(timerInterval);
                randomWord = "";
                maskedWord = [];
                if (wordsFound < nbrOfWords) {
                    console.log("Player lost")
                    var loosingText;
                    if (adventurerHealth > 0) {
                        loosingText = "You did not make it in time! you only found " + wordsFound + " out of " + nbrOfWords + " words. You lost half a life...";
                        wordEl.textContent = "Time is up!";
                    } else {
                        loosingText = "You ran out of health and died. You lost half a life...";
                        wordEl.textContent = "You died...";
                    }
                    adventurerLives = adventurerLives - 0.5
                    displayLives()
                    printMessage(dialogueTextEl, loosingText, 30)
                    mainGameBackBtn.setAttribute("class", "nes-btn");
                    var restartBtn = document.createElement("button")
                    restartBtn.setAttribute("class", "nes-btn")
                    restartBtn.textContent = "Try again"
                    dialogueBtnContainer.appendChild(restartBtn)
                    allowNextDialogue = false;
                    restartBtn.addEventListener("click", function (event) {
                        event.preventDefault()
                        if (allowNextDialogue) {
                            console.log("Player restarted mini game")
                            restartBtn.remove()
                            wordEl.remove()
                            resetMiniGameGrid()
                            playHangman(chosenWordPool, totalTime, nbrOfWords)
                        }
                    })
                } else {
                    if (wordsFound === nbrOfWords) {
                        console.log("Player won but no extra words")
                        var winningMessage = "You have successfully found all " + nbrOfWords + " words! Congratulations! You gained 100 XP";
                        addXPToTotal(100)
                    } else {
                        console.log("Player won with extra words")
                        var addXP = (wordsFound - nbrOfWords) * 10 + 100;
                        var extraWords = wordsFound - nbrOfWords;
                        addXPToTotal(addXP)
                        var winningMessage = "You have successfully found all " + nbrOfWords + " words and " + extraWords + " extra words! Congratulations! You gained " + addXP + " XP.";
                    }
                    printMessage(dialogueTextEl, winningMessage, 30)
                    mainGameContinueBtn.setAttribute("class", "nes-btn");
                    gameIsPlaying = false
                    console.log("Game is Playing: " + gameIsPlaying)
                    wordEl.remove()
                    clearMiniGame()
                }
            }
        }, 1000);
    }
}

// General Mini game functions

// reset mini game Grid
function resetMiniGameGrid() {
    for (var i = 0; i < gameGridEl.children.length; i++) {
        var itemsToClear = gameGridEl.children[i].children
        if (itemsToClear.length > 0) {
            itemsToClear[itemsToClear.length - 1].remove()
        }
    }
}
// clearMini Games
function clearMiniGame() {
    mainGameContinueBtn.addEventListener("click", function () {
        if (!gameIsPlaying) {
            console.log("Mini Game is over and next story is starting")
            dialogueTextEl.textContent = ""
            storyTextPEl.textContent = ""
            resetMiniGameGrid()
        }
    })
}
// adding xp and leveling up player
function addXPToTotal(amountOfXp) {
    console.log(amountOfXp + "XP gained")
    adventurerXP = adventurerXP + amountOfXp
    playerXP.setAttribute("value", adventurerXP)

    if (adventurerXP >= playerXP.max) {
        var levelUps = Math.floor(adventurerXP / playerXP.max)
        adventurerXP = adventurerXP - (playerXP.max * levelUps)
        playerXP.setAttribute("value", adventurerXP)
        adventurerLevel = adventurerLevel + levelUps
        playerLevel.textContent = adventurerLevel
        console.log("Player Leveled up " + levelUps)
    }
}

// Clears the dialog text
function clearDialog() {
    dialogueTextEl.innerText = "";
}

// Clears the story text
function clearStory() {
    storyTextPEl.innerText = "";
}

//checks the scene for story
function hasStory() {
    if (taleArray[taleTracker][1].story !== undefined) {
        return true;
    } else {
        return false;
    }
}

//checks the scene for a dialog
function hasDialog() {
    if (taleArray[taleTracker][1].dialog !== undefined) {
        return true;
    } else {
        return false;
    }
}

function hasOptions() {
    if (taleArray[taleTracker][1].options !== undefined) {
        return true;
    } else {
        return false;
    }
}

// checks the scene for a game
function hasGame() {
    if (taleArray[taleTracker][1].game !== undefined) {
        return true;
    } else {
        return false;
    }
}

// Load the story to the story section
function loadScene() {
    printMessage(storyTextPEl, taleArray[taleTracker][1].story[sceneIndex], 30);
    if (sceneIndex == taleArray[taleTracker][1].story.length - 1) {
        enableContinue(false);
        clearDialog();
        setTimeout(() => {
            loadDialog();
            showDialogButton(true);
        }, 3000);
    }
}

function loadDialog() {
    printMessage(dialogueTextEl, taleArray[taleTracker][1].dialog[dialogIndex], 30);

    // if (taleArray[taleTracker][1].dialog != null && taleArray[taleTracker][1].dialog.length > 0) {
    // 	showDialogButton(true);
    // 	if (taleArray[taleTracker][1].dialog.length == 1) {
    // 		showDialogButton(false);
    // 		enableContinue(true);
    // 	}
    // if (dialogIndex < taleArray[taleTracker][1].dialog.length) {
    // 	showDialogButton(true);
    // } else {
    // 	showDialogButton(false);
    // }
    // }
    // taleTracker++;
    // sceneIndex = 0;
    // add return boolean to let load/continue functions know when to renable continue button.
    // loadStory();
}

mainGameContinueBtn.addEventListener("click", () => {
    if (!gameIsPlaying) {
        sceneIndex++;
        console.log(
            "update taleTracker: " + taleTracker + " storyI: " + sceneIndex + " dialogI: " + dialogIndex
        );
        console.log(sceneIndex + 1 == taleArray[taleTracker][1].story.length);
        if (sceneIndex < taleArray[taleTracker][1].story.length) {
            clearStory();
            loadScene();
        } else if (sceneIndex + 1 == taleArray[taleTracker][1].story.length) {
            enableContinue(false);
            clearDialog();
            loadDialog();
            showDialogButton(true);
        }
    }
});

dialogueNextBtn.addEventListener("click", () => {
    if (!gameIsPlaying) {
        console.log("dialog button clicked");
        dialogIndex++;
        clearDialog();
        // // taleArray[taleTracker][1].dialog.length;
        if (dialogIndex < taleArray[taleTracker][1].dialog.length) {
            console.log(
                "update taleTracker: " +
                taleTracker +
                " storyI: " +
                sceneIndex +
                " dialogI: " +
                dialogIndex
            );
            printMessage(dialogueTextEl, taleArray[taleTracker][1].dialog[dialogIndex], 30);
            if (dialogIndex + 1 == taleArray[taleTracker][1].dialog.length) {
                showDialogButton(false);
                taleTracker++;
                sceneIndex = 0;
                dialogIndex = 0;
                console.log(
                    "next scene should be enabled. taleTracker: " +
                    taleTracker +
                    " storyI: " +
                    sceneIndex +
                    " dialogI: " +
                    dialogIndex
                );
                setTimeout(() => {
                    enableContinue(true);
                    clearStory();
                    loadScene();
                }, 3000);
                // 		showDialogButton(false);
                // 		taleTracker++;
                // 		sceneIndex = 0;
                // 		clearStory();
                // 		// loadStory();
            }
        } else {
            setTimeout(() => {
                showDialogButton(false);
                taleTracker++;
                sceneIndex = 0;
                dialogIndex = 0;
                console.log(
                    "next scene should be enabled. taleTracker: " +
                    taleTracker +
                    " storyI: " +
                    sceneIndex +
                    " dialogI: " +
                    dialogIndex
                );
                enableContinue(true);
                clearStory();
                loadScene();
            }, 3000);
        }
    }
});

// Load the dialog to the dialog section



// Hides or shows the dialog button depending on if it is true/false
function showDialogButton(state) {
    if (state) {
        dialogueNextBtn.style.visibility = "visible";
    } else {
        dialogueNextBtn.style.visibility = "hidden";
    }
}

// enable/disable continue button in story section based on true false
function enableContinue(state) {
    if (state) {
        mainGameContinueBtn.classList.remove("is-disabled");
        mainGameContinueBtn.disabled = false;
    } else {
        mainGameContinueBtn.classList.add("is-disabled");
        mainGameContinueBtn.disabled = true;
    }
}

// TODO: update background image based on location.
// function updateBackgroundImage(){}

// First load of the game.
function initGame() {
    taleArray = Object.entries(tale);
    taleTracker = 0;
    // clear dialog and story to load new prompts
    clearDialog();
    clearStory();
    //call updateBackgroundImage(); here
    //check if there is a story for the scene then proceed to print the text and use continue button as needed.
    sceneIndex = 0;
    dialogIndex = 0;
    printMessage(storyTextPEl, taleArray[taleTracker][1].story[sceneIndex], 30);
    enableContinue(false);
    setTimeout(() => {
        clearDialog();
        printMessage(dialogueTextEl, taleArray[taleTracker][1].dialog[sceneIndex], 30);
        showDialogButton(true);
    }, 5000);
}

// Game is started after story json data is grabbed.
fetch("./assets/JSON/story.json")
    .then((res) => res.json())
    .then((data) => {
        tale = data;
        // initGame();
    });
