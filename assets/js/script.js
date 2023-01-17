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
var saveBtn = document.getElementById("save-btn");
var resetBtn = document.getElementById("restart-btn");
var titleBtn = document.getElementById("title-btn")
var musicEl = document.getElementById("music");
var healthPotionEl = document.getElementById("healthPotion")

// Retrieving values from local storage
var adventurerID = playerCharacter.id;
var adventurerImg = playerCharacter.src;
var adventurerName = playerCharacter.characterName;
var adventurerLevel = playerCharacter.level;
var adventurerHealth = playerCharacter.health;
var adventurerDamage = playerCharacter.damage;
var adventurerXP = playerCharacter.xp;
var adventurerLives = playerCharacter.lives;

// Display to character panel
playerImage.setAttribute("src", adventurerImg);
playerName.textContent = adventurerName;
playerLevel.textContent = adventurerLevel;
playerHealth.setAttribute("value", adventurerHealth);
playerHealth.setAttribute("max", 250);
playerXP.setAttribute("value", adventurerXP);
playerXP.setAttribute("max", 100);

displayLives();

// Save player information to local storage
function savePlayerInfo(){
    var playerCharacterSave = {
        "id": adventurerID,
        "characterName": adventurerName,
        "health": adventurerHealth,
        "damage": adventurerDamage,
        "xp": adventurerXP,
        "level": adventurerLevel,
        "lives": adventurerLives,
        "src": adventurerImg
    }
    localStorage.setItem("playerCharacter", JSON.stringify(playerCharacterSave));
}

// Clear player character save and return to start page
function restartGame() {
    localStorage.clear(playerCharacter);
    location.href = "./index.html";
}

// Change heart classes based on lives
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

// Music controls
musicEl.volume = 0.1;
musicEl.loop = true;

// Header On-Click Events
saveBtn.addEventListener("click", savePlayerInfo);
resetBtn.addEventListener("click", restartGame);
titleBtn.addEventListener("click", function(){
    location.href = "./index.html";
})


// Main game document selectors
var mainGameBackBtn = document.getElementById("main-back-btn");
var mainGameContinueBtn = document.getElementById("main-continue-btn");
var dialogueTextEl = document.getElementById("dialogueText");
var storyTextPEl = document.getElementById("storyText");
var dialogueBtnContainer = document.getElementById("dialogueBtnContainer");
var yesEl = document.getElementById("yes");
var noEl = document.getElementById("no");
var dialogueNextBtn = document.getElementById("dialogueBtn");
var gameGridEl = document.getElementById("gameScreenGrid");
var divA1 = document.getElementById("a1");
var divA3 = document.getElementById("a3");
var divA5 = document.getElementById("a5");
var divB3 = document.getElementById("b3");
var divC3 = document.getElementById("c3");

// Display dialogue one letter at a time
var allowNextDialogue = false;
var allowNextGame = true;
var gameIsPlaying = false;

yesEl.style.display = "none";
noEl.style.display = "none";
dialogueNextBtn.style.visibility = "hidden";
mainGameBackBtn.style.visibility = "hidden";
yesEl.style.visibility = "hidden";
noEl.style.visibility = "hidden";
// JSON will be saved to this variable after fetching.
var tale;
var taleArray;
// Track where user's story index is - starts at 0 on init. Needs to be saved to local storage on saves, also needs to load and be updated when reloading saved game.
var taleTracker;
var sceneIndex;
var dialogIndex;
var miniGame = "none";

// var continueButtonState = false;
// var dialogButtonState = false;

function printMessage(destination, message, speed) {
    destination.innerHTML = "";
    var i = 0;
    var interval = setInterval(function () {
        destination.innerHTML += message.charAt(i);
        allowNextDialogue = false;
        i++;
        if (i >= message.length) {
            allowNextDialogue = true;
            clearInterval(interval);
        }
    }, speed);
}

// Health potion function
healthPotionEl.addEventListener("click", function(){
    if(!gameIsPlaying && adventurerHealth < playerHealth.max){
        adventurerHealth = adventurerHealth + 10
        playerHealth.setAttribute("value", adventurerHealth);
        console.log(playerHealth)
    }
})

var combatVersion = [
    {
        backgroundImg: "url(./assets/images/backgrounds/cave.png)",
        begginingText: "You finally reach the end of the cave and gasp with relive when you notice the stary night at the end of the tunnel",
        enemyFileNameWithCloud: "./assets/images/characters/troll-lord-appearing.png",
        enemyFileNameNoCloud: "./assets/images/characters/troll-lord.png",
        dialogue: "How dare you try to pass through my Kingdom!!",
        story: "Oh no! You ran into and Enemy. The Troll Lord isn't pleased to see a hero in his territory. If you want to pass, you will have to defeat him!",
        enemyHealthPoints: 20,
        enemyDamagePoints: 20,
        enemyWinDialogue: "The only reason a warrior is alive is to fight, and the only reason a warrior fights is to win."
    },
    {
        backgroundImg: "url(./assets/images/backgrounds/swamp.png)",
        begginingText: "You wander through the forest as the ground begins to get soggy. with every step your feet get more soaked and the air starts to fill with a putrid smell and a greenish fog emerges from all wround you...",
        enemyFileNameWithCloud: "./assets/images/characters/Swamp-witch-appearing.png",
        enemyFileNameNoCloud: "./assets/images/characters/Swamp-witch.png",
        dialogue: "You dare come close to the dreaded swamp witch? You will get what you deserve!",
        story: "Oh no! The Witch is challenging you to a battle! In order to continue you need to defeat her",
        enemyHealthPoints: 50,
        enemyDamagePoints: 15,
        enemyWinDialogue: "He that fights and runs away, May turn and fight another day; But he that is in battle slain, Will never rise to fight again."
    }
]

var backgroundImg;
var begginingText;
var enemyFileNameWithCloud;
var enemyFileNameNoCloud;
var dialogue;
var story;
var enemyHealthPoints;
var enemyDamagePoints;
var enemyWinDialogue;
var indexToReplay;

function playCombat(index) {
    saveBtn.classList.add("is-disabled")

    indexToReplay = index
    backgroundImg = combatVersion[index].backgroundImg;
    begginingText = combatVersion[index].begginingText;
    enemyFileNameWithCloud = combatVersion[index].enemyFileNameWithCloud;
    enemyFileNameNoCloud = combatVersion[index].enemyFileNameNoCloud;
    dialogue = combatVersion[index].dialogue;
    story = combatVersion[index].story;
    enemyHealthPoints = combatVersion[index].enemyHealthPoints;
    enemyDamagePoints = combatVersion[index].enemyDamagePoints;
    enemyWinDialogue = combatVersion[index].enemyWinDialogue;

    // Setting health back to saved health at start of game

    // Console logging states
    gameIsPlaying = true
    console.log("Game is Playing: " + gameIsPlaying)
    console.log("Combat Game Start")

    gameGridEl.style.backgroundImage = backgroundImg
    printMessage(storyTextPEl, begginingText, 30);
    mainGameContinueBtn.setAttribute("class", "nes-btn");



    mainGameContinueBtn.addEventListener("click", function () {
        if (allowNextDialogue && allowNextGame && gameIsPlaying) {
            mainGameContinueBtn.setAttribute("class", "nes-btn is-disabled");
            startCombatGame(indexToReplay)
            makeEnemyAppear()
            // makes sure the game doesn't restart when continue is clicked at the end
            allowNextGame = false;
        }
    })
}

function startCombatGame(indexToReplay) {

    var startBtn = document.createElement("button")
    startBtn.setAttribute("class", "nes-btn")
    startBtn.textContent = "Fight!"
    dialogueBtnContainer.appendChild(startBtn)

    printMessage(dialogueTextEl, dialogue, 30)
    printMessage(storyTextPEl, story, 30)

    var messageEl = document.createElement("h2")
    messageEl.setAttribute("id", "combatMessage")

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
                startCombat(indexToReplay)
            }, 4000)
        }
    })
}

function makeEnemyAppear() {
    // Console logging states
    console.log("Enemy Appears")

    // creating first image with cloud
    var enemyEl = document.createElement("img")
    enemyEl.setAttribute("src", enemyFileNameWithCloud)
    enemyEl.setAttribute("class", "fade-out-image")
    // creating image that will stay once the one with clouds is gone
    var nextEnemyEl = document.createElement("img")
    nextEnemyEl.setAttribute("id", "targetEnemy")
    nextEnemyEl.setAttribute("src", enemyFileNameNoCloud)

    var divContainer = document.getElementById("e3")
    divContainer.appendChild(enemyEl)
    divContainer.appendChild(nextEnemyEl)

    function changeImage() {
        enemyEl.remove()
    }
    setTimeout(changeImage, 4500)
}

function startCombat(indexToReplay) {
    // Console logging states
    console.log("Fighting Started")
    // removing the start message
    var messageEl = document.getElementById("combatMessage")
    messageEl.remove()
    // creating enemy health bar
    var enemyHealth = enemyHealthPoints
    var enemyHealthProgress = document.createElement("progress")
    enemyHealthProgress.setAttribute("class", "nes-progress is-success")
    enemyHealthProgress.setAttribute("id", "enemyHealthBar")
    enemyHealthProgress.setAttribute("value", enemyHealth)
    enemyHealthProgress.setAttribute("max", enemyHealth)
    divC3.appendChild(enemyHealthProgress)
    // Adding event listener to defeat enemy
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
            allowNextDialogue = false;
            printMessage(dialogueTextEl, "Aaargh...", 30)
            var endMessage = "You defeated the enemy and gained " + adventurerHealth + " XP! You are able to continue!"
            printMessage(storyTextPEl, endMessage, 30)
            mainGameContinueBtn.setAttribute("class", "nes-btn")
            divB3.appendChild(messageEl)
            gameIsPlaying = false
            saveBtn.classList.remove("is-disabled")
            playerHealth.setAttribute("value", adventurerHealth)
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
                    playerCharacter.health = playerHealth.max
                    adventurerHealth = playerCharacter.health;
                    playerHealth.setAttribute("value", adventurerHealth);
                    dialogueTextEl.textContent = ""
                    restartBtn.remove()
                    resetMiniGameGrid()
                    playCombat(indexToReplay)
                }
            })

        }
    }, 1000);
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

// playHangman(RPGwordPool, 40, 5)

// Hangman Game function
function playHangman(chosenWordPool, totalTime, nbrOfWords) {
    saveBtn.classList.add("is-disabled")

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
    wordsFoundEl.textContent = "0/" + nbrOfWords + " words";

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
            adventurerHealth = adventurerHealth - 3
            playerHealth.setAttribute("value", adventurerHealth);
        }
        for (var i = 0; i < randomWord.length; i++) {
            if (randomWord[i] === key) {
                maskedWord.splice([i], 1, randomWord[i]);
                wordEl.textContent = maskedWord.join(" ");
                if (!maskedWord.includes("_") && adventurerHealth > 0) {
                    wordsFound++;
                    wordsFoundEl.textContent = wordsFound + "/" + nbrOfWords + " words";
                    setTimeout(randomizer, 500);
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
                    saveBtn.classList.remove("is-disabled")

                    playerHealth.setAttribute("value", adventurerHealth)
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
        if (!gameIsPlaying && allowNextDialogue) {
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
    console.log("Checking story: " + taleTracker);
    if (taleArray[taleTracker][1].story !== undefined) {
        console.log("has story");
        return true;
    } else {
        console.log("no story");
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

// checks if there's options in the scene
function hasOptions() {
    if (taleArray[taleTracker][1].options !== undefined) {
        return true;
    } else {
        return false;
    }
}

function showOptions(state) {
    if (state) {
        yesEl.style.visibility = "visible";
        noEl.style.visibility = "visible";
    } else {
        yesEl.style.visibility = "hidden";
        noEl.style.visibility = "hidden";
    }
}

// checks the scene for a game
function hasGame(game) {
    if (game != undefined) {
        return true;
    } else {
        return false;
    }
}

// Load the story to the story section
//TODO: changing background function should be called in here.
function loadScene() {
    console.log(hasStory());
    if (hasStory()) {
        printMessage(storyTextPEl, taleArray[taleTracker][1].story[sceneIndex], 30);
    }
    if (hasStory() == false || sceneIndex == taleArray[taleTracker][1].story.length - 1) {
        console.log("enable disabled because end of story or no story, load dialog");
        enableContinue(false);
        clearDialog();
        setTimeout(() => {
            loadDialog();
            showDialogButton(true);
        }, 3000);
    }
}

function loadDialog() {
    if (hasOptions() == true) {
        printMessage(
            dialogueTextEl,
            taleArray[taleTracker][1].dialog[dialogIndex].replace("Player:", adventurerName + ":"),
            30
        );

        setTimeout(() => {
            loadOptions();
            showOptions(true);
            showDialogButton(true);
        }, 3000);
    } else {
        printMessage(
            dialogueTextEl,
            taleArray[taleTracker][1].dialog[dialogIndex].replace("Player:", adventurerName + ":"),
            30
        );
    }
}

function loadOptions() {
    yesEl.children[1].innerText = taleArray[taleTracker][1].options.one.replace(
        "Player:",
        adventurerName + ":"
    );
    noEl.children[1].innerText = taleArray[taleTracker][1].options.two.replace(
        "Player:",
        adventurerName + ":"
    );
}

mainGameContinueBtn.addEventListener("click", () => {
    if (!gameIsPlaying && allowNextDialogue) {
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

// taleTracker ++ changed to taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[0]);
// Load the dialog to the dialog section
dialogueNextBtn.addEventListener("click", () => {
    if (!gameIsPlaying && allowNextDialogue) {
        // if (hasOptions() == false || dialogIndex + 1 < taleArray[taleTracker][1].dialog.length) {
        //     console.log("no options OR not at scene where options are needed yet");
        // clear options on click in case there are any
        showOptions(false);
        // }
        console.log("dialog button clicked");
        dialogIndex++;
        clearDialog();
        if (dialogIndex < taleArray[taleTracker][1].dialog.length) {
            console.log(
                "update taleTracker: " +
                taleTracker +
                " storyI: " +
                sceneIndex +
                " dialogI: " +
                dialogIndex
            );
            loadDialog();
            if (dialogIndex + 1 == taleArray[taleTracker][1].dialog.length) {
                console.log("Options? " + hasOptions());
                showDialogButton(false);
                //checks if the next scene has a game
                if (hasGame(taleArray[taleTracker + 1][1].game) == true) {
                    // if user chooses to play the game
                    console.log("next story has game is true");
                    // TODO: The if statement here is getting messed up when trying to go to the next scene. the taleTracker is not getting updated properly at lines 420 and 424 based on user selection.
                    if (yesEl.children[0].checked == true) {
                        // clearStory();
                        // clearDialog();
                        // enableContinue(false);
                        // showDialogButton(false);
                        // showOptions(false);

                        console.log("at 424: " + taleTracker);
                        taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[0]);
                    } else if (noEl.children[0].checked == true) {
                        // if user chooses to not play the game
                        console.log("at 434:" + taleTracker);
                        taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[1]);
                    } else {
                        taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);
                    }
                } else {
                    // if there's no game
                    console.log("at 439:" + taleTracker);
                    console.log(
                        taleTracker + " " + Object.keys(tale).indexOf(taleArray[taleTracker][1].next)
                    );
                    //
                    taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);
                }
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
            }
        } else {
            setTimeout(() => {
                showDialogButton(false);
                console.log("at 465:" + taleTracker);
                console.log(Object.keys(tale).indexOf(taleArray[taleTracker][1].next));
                taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);

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
    console.log(taleArray);
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
        loadDialog();
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
