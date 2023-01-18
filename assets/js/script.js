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
var titleBtn = document.getElementById("title-btn");
var musicEl = document.getElementById("music");
var healthPotionEl = document.getElementById("healthPotion");

// Retrieving values from local storage
var adventurerID = playerCharacter.id;
var adventurerImg = playerCharacter.src;
var adventurerName = playerCharacter.characterName;
var adventurerLevel = playerCharacter.level;
var adventurerHealth = playerCharacter.health;
var adventurerDamage = playerCharacter.damage;
var adventurerXP = playerCharacter.xp;
var adventurerLives = playerCharacter.lives;
var adventurerHealthMax = playerCharacter.max
var playerScore = 0;

if(playerCharacter.id === undefined){
    adventurerID = "nameless";
    adventurerImg ="assets/images/nameless.png";
    adventurerLevel = 100;
    adventurerHealth = 1000;
    adventurerHealthMax = 1000;
    adventurerDamage = 10;
    adventurerXP = 0;
    adventurerLives = 3;
}

// Display to character panel
playerImage.setAttribute("src", adventurerImg);
playerName.textContent = adventurerName;
playerLevel.textContent = adventurerLevel;
playerHealth.setAttribute("value", adventurerHealth);
playerHealth.setAttribute("max", adventurerHealthMax);
playerXP.setAttribute("value", adventurerXP);
playerXP.setAttribute("max", 100);

displayLives();

// Save player information to local storage
function savePlayerInfo() {
	var playerCharacterSave = {
		id: adventurerID,
		characterName: adventurerName,
		health: adventurerHealth,
		damage: adventurerDamage,
		xp: adventurerXP,
		level: adventurerLevel,
		lives: adventurerLives,
		src: adventurerImg,
		currScene: taleTracker,
	};
	localStorage.setItem("playerCharacter", JSON.stringify(playerCharacterSave));
    console.log("save")
}

// Clear player character save and return to start page
function restartGame() {
	localStorage.clear("playerCharacter");
    localStorage.clear("gameStatus");
    localStorage.clear("score");
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
	} else if (adventurerLives == 0.5) {
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

function calculateScore() {
	var levelScore = adventurerLevel * 1000;
	var livesScore = adventurerLives * 250;
	playerScore = levelScore + livesScore + adventurerHealth + adventurerXP;
    console.log(playerScore)
}

// Music controls
musicEl.volume = 0.1;
musicEl.loop = true;

// Header On-Click Events
saveBtn.addEventListener("click", function(){
    if(!gameIsPlaying){
        savePlayerInfo()
    }
});

resetBtn.addEventListener("click", restartGame);
titleBtn.addEventListener("click", function () {
	location.href = "./index.html";
});

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
var allowGameReset = false;
var gameIsPlaying = false;
var gameWin = false;
var inCombat = false;

dialogueNextBtn.style.visibility = "hidden";
mainGameBackBtn.style.visibility = "hidden";
yesEl.style.visibility = "hidden";
noEl.style.visibility = "hidden";
// JSON will be saved to this variable after fetching.
var tale;
var taleArray;
// Track where user's story index is - starts at 0 on init. Needs to be saved to local storage on saves, also needs to load and be updated when reloading saved game.
var taleTracker;
var storyIndex;
var dialogIndex;
var miniGame = "none";

// var continueButtonState = false;
// var dialogButtonState = false;

// when the user has no more advnturer hearts they
function gameLose() {
	setTimeout(() => {
		localStorage.setItem("gameStatus", "lost");
		location.href = "./endGame.html";
	}, 3000);
}

function checkGameWin() {
	if (taleTracker == taleArray.length - 1) {
		calculateScore();
		localStorage.setItem("gameStatus", "win");
		localStorage.setItem("score", playerScore);
		location.href = "./endGame.html";
	}
}

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
healthPotionEl.addEventListener("click", function () {
	if (!gameIsPlaying && adventurerHealth < playerHealth.max) {
		adventurerHealth = adventurerHealth + 10;
		playerHealth.setAttribute("value", adventurerHealth);
	}
});

var combatVersion = [
	{
		backgroundImg: "url(./assets/images/backgrounds/cave.png)",
		begginingText:
			"You finally reach the end of the cave and gasp with relief when you notice the starry night at the end of the tunnel.",
		enemyFileNameWithCloud: "./assets/images/characters/Troll-lord-appearing.png",
		enemyFileNameNoCloud: "./assets/images/characters/Troll-lord.png",
		dialogue: "How dare you try to pass through my kingdom!!",
		story: "Oh no! You ran into an enemy. The Troll Lord isn't pleased to see a hero in his territory. If you want to pass, you will have to defeat him!",
		enemyHealthPoints: 20,
		enemyDamagePoints: 20,
		enemyWinDialogue:
			"The only reason a warrior is alive is to fight, and the only reason a warrior fights is to win.",
	},
	{
		backgroundImg: "url(./assets/images/backgrounds/swamp.png)",
		begginingText:
			"You wander through the forest. The ground begins to get soggy. With every step your feet get more soaked and the air starts to fill with a putrid smell. A greenish fog emerges from all wround you...",
		enemyFileNameWithCloud: "./assets/images/characters/Swamp-witch-appearing.png",
		enemyFileNameNoCloud: "./assets/images/characters/Swamp-witch.png",
		dialogue: "You dare come close to the dreaded swamp witch? You will get what you deserve!",
		story: "Oh no! The Witch is challenging you to a battle! In order to continue, you need to defeat her.",
		enemyHealthPoints: 50,
		enemyDamagePoints: 15,
		enemyWinDialogue:
			"He that fights and runs away, May turn and fight another day; But he that is in battle slain, Will never rise to fight again.",
	},
];

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

    inCombat = true 
	indexToReplay = index;
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
	gameIsPlaying = true;
	console.log("Game is Playing: " + gameIsPlaying);
	console.log("Combat Game Start");

	gameGridEl.style.backgroundImage = backgroundImg;
	printMessage(storyTextPEl, begginingText, 30);
	mainGameContinueBtn.setAttribute("class", "nes-btn");

	mainGameContinueBtn.addEventListener("click", function () {
		if (allowNextDialogue && allowNextGame && gameIsPlaying && inCombat) {
			mainGameContinueBtn.setAttribute("class", "nes-btn is-disabled");
			startCombatGame(indexToReplay);
			makeEnemyAppear();
			// makes sure the game doesn't restart when continue is clicked at the end
			allowNextGame = false;
            inCombat = false;
		}
	});
}

function startCombatGame(indexToReplay) {
	var startBtn = document.createElement("button");
	startBtn.setAttribute("class", "nes-btn");
	startBtn.textContent = "Fight!";
	dialogueBtnContainer.appendChild(startBtn);

	printMessage(dialogueTextEl, dialogue, 30);
	printMessage(storyTextPEl, story, 30);

	var messageEl = document.createElement("h2");
	messageEl.setAttribute("id", "combatMessage");

	startBtn.addEventListener("click", function (event) {
		event.preventDefault();
		if (allowNextDialogue) {
			printMessage(
				storyTextPEl,
				" Click on the enemy to deal damage once the game starts.",
				30
			);
			startBtn.remove();
			allowNextGame = true;
			countdownTime = 4;
			messageEl.textContent = "Ready?";
			divB3.appendChild(messageEl);
			countdown = setInterval(function () {
				countdownTime--;
				messageEl.textContent = countdownTime;
				if (countdownTime < 0) {
					clearInterval(countdown);
					messageEl.textContent = "Attack!";
				}
			}, 1000);
			setTimeout(function () {
				startCombat(indexToReplay);
			}, 4000);
		}
	});
}

function makeEnemyAppear() {
	// Console logging states
	console.log("Enemy Appears");

	// creating first image with cloud
	var enemyEl = document.createElement("img");
	enemyEl.setAttribute("src", enemyFileNameWithCloud);
	enemyEl.setAttribute("class", "fade-out-image");
	// creating image that will stay once the one with clouds is gone
	var nextEnemyEl = document.createElement("img");
	nextEnemyEl.setAttribute("id", "targetEnemy");
	nextEnemyEl.setAttribute("src", enemyFileNameNoCloud);

	var divContainer = document.getElementById("e3");
	divContainer.appendChild(enemyEl);
	divContainer.appendChild(nextEnemyEl);

	function changeImage() {
		enemyEl.remove();
	}
	setTimeout(changeImage, 4500);
}

function startCombat(indexToReplay) {
	// Console logging states
	console.log("Fighting Started");
	// removing the start message
	var messageEl = document.getElementById("combatMessage");
	messageEl.remove();
	// creating enemy health bar
	var enemyHealth = enemyHealthPoints;
	var enemyHealthProgress = document.createElement("progress");
	enemyHealthProgress.setAttribute("class", "nes-progress is-success");
	enemyHealthProgress.setAttribute("id", "enemyHealthBar");
	enemyHealthProgress.setAttribute("value", enemyHealth);
	enemyHealthProgress.setAttribute("max", enemyHealth);
	divC3.appendChild(enemyHealthProgress);
	// Adding event listener to defeat enemy
	var targetEnemyEl = document.getElementById("targetEnemy");
	targetEnemyEl.addEventListener("click", function () {
		enemyHealth--;
		enemyHealthProgress.setAttribute("value", enemyHealth);
	});
	var timePlayed = 0;
	timerInterval = setInterval(function () {
		if (enemyHealth > 0) {
			timePlayed++;
			adventurerHealth = adventurerHealth - enemyDamagePoints;
			playerHealth.setAttribute("value", adventurerHealth);
		} else {
			var figthTimeTotal = playerHealth.max / enemyDamagePoints;
			var xpGainedCombat = Math.floor((figthTimeTotal / timePlayed) * enemyHealthPoints * 2);
			addXPToTotal(xpGainedCombat);
			console.log("Player Won");
			clearInterval(timerInterval);
			enemyHealthProgress.remove();
			targetEnemyEl.remove();
			messageEl.textContent = "Victory!";
			allowNextDialogue = false;
			printMessage(dialogueTextEl, "Aaargh...", 30);
			var endMessage =
				"You defeated the enemy and gained " +
				xpGainedCombat +
				" XP! You are able to continue!";
			printMessage(storyTextPEl, endMessage, 30);
			mainGameContinueBtn.setAttribute("class", "nes-btn");
			divB3.appendChild(messageEl);
			gameIsPlaying = false;
			playerHealth.setAttribute("value", adventurerHealth);
			allowGameReset = true;
			gameWin = true;
			clearMiniGame();
		}
		if (adventurerHealth <= 0) {
			console.log("Player Lost");
			adventurerLives = adventurerLives - 0.5;
			displayLives();
			clearInterval(timerInterval);
			if (adventurerLives == 0) {
				gameLose();
			}
			enemyHealthProgress.remove();
			messageEl.textContent = "Defeated";
			printMessage(dialogueTextEl, enemyWinDialogue, 30);
			divB3.appendChild(messageEl);
			var restartBtn = document.createElement("button");
			restartBtn.setAttribute("class", "nes-btn");
			restartBtn.textContent = "Try again";
			dialogueBtnContainer.appendChild(restartBtn);
			allowNextDialogue = false;
			restartBtn.addEventListener("click", function (event) {
				event.preventDefault();
				if (allowNextDialogue) {
					console.log("Player is restarting mini game");
					playerCharacter.health = playerHealth.max;
					adventurerHealth = playerCharacter.health;
					playerHealth.setAttribute("value", adventurerHealth);
					dialogueTextEl.textContent = "";
					restartBtn.remove();
					resetMiniGameGrid();
					playCombat(indexToReplay);
				}
			});
		}
	}, 1000);
}

var butcherWordPool = [
	"meat",
	"deli",
	"cured",
	"links",
	"salami",
	"bacon",
	"beef",
	"pork",
	"lamb",
	"chicken",
	"filet",
	"fish",
	"venison",
	"poultry",
	"halal",
	"kosher",
	"meatloaf",
	"steak",
	"sausage",
	"ribs",
	"drumsticks",
	"ham",
	"roast",
	"cleaver",
	"salt",
];

var forestWordPool = [
	"stick",
	"flint",
	"berries",
	"rabbit",
	"squirrel",
	"fire",
	"rock",
	"forage",
	"forest",
	"raspberry",
	"strawberry",
	"blueberry",
	"dandelion",
	"pebble",
	"blackberry",
	"nettle",
	"elderflower",
	"chestnut",
	"mushroom",
	"huckleberry",
	"acorn",
	"walnut",
	"almond",
	"cashew",
	"watercress",
	"burdock",
	"parsnip",
];

// Hangman Game function
function playHangman(chosenWordPool, totalTime, nbrOfWords) {
	yesEl.style.display = "none";
	noEl.style.display = "none";
	mainGameContinueBtn.setAttribute("class", "nes-btn is-disabled");
	//instructions removed as they're printed in the story now

	playerHealth.setAttribute("value", adventurerHealth);
	console.log("Hangman Game Start");
	gameIsPlaying = true;
	console.log("Game is Playing: " + gameIsPlaying);
	// hangman game elements
	var wordPool = chosenWordPool;
	var randomWord;
	var maskedWord = [];
	var timeLeft = totalTime;
	var wordsFound = 0;

	// generating hangman game element
	var miniGameTitle = document.createElement("p");
	miniGameTitle.textContent = "The Hangman Game";
	miniGameTitle.setAttribute("id", "miniGameTilte");

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
		startHangmanGame(timeLeft);
		randomizer();
		wordEl.textContent = maskedWord.join(" ");
		startMiniGameBtn.style.display = "none";
	});

	function randomizer() {
		console.log("Randomizing word");
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
			adventurerHealth = adventurerHealth - 3;
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

	function startHangmanGame(timeLeft) {
		console.log("Countdown starts time to find words");
		timerInterval = setInterval(function () {
			timeLeft--;
			timeLeftEl.textContent = "Time Left: " + timeLeft + " seconds";
			if (timeLeft <= 0 || adventurerHealth <= 0) {
				clearInterval(timerInterval);
				randomWord = "";
				maskedWord = [];
				if (wordsFound < nbrOfWords) {
					console.log("Player lost");
					var loosingText;
					if (adventurerHealth > 0) {
						loosingText =
							"You did not make it in time! you only found " +
							wordsFound +
							" out of " +
							nbrOfWords +
							" words. You lost half a life...";
						wordEl.textContent = "Time is up!";
					} else {
						loosingText = "You ran out of health and died. You lost half a life...";
						wordEl.textContent = "You died...";
					}
					adventurerLives = adventurerLives - 0.5;
					displayLives();
					if (adventurerLives == 0) {
						gameLose();
					}
					printMessage(dialogueTextEl, loosingText, 30);
					mainGameBackBtn.setAttribute("class", "nes-btn");
					var restartBtn = document.createElement("button");
					restartBtn.setAttribute("class", "nes-btn");
					restartBtn.textContent = "Try again";
					dialogueBtnContainer.appendChild(restartBtn);
					allowNextDialogue = false;
					restartBtn.addEventListener("click", function (event) {
						event.preventDefault();
						if (allowNextDialogue) {
							console.log("Player restarted mini game");
							restartBtn.remove();
							wordEl.remove();
							resetMiniGameGrid();
							playerCharacter.health = playerHealth.max;
							adventurerHealth = playerCharacter.health;
							playerHealth.setAttribute("value", adventurerHealth);
							playHangman(chosenWordPool, totalTime, nbrOfWords);
						}
					});
				} else {
					if (wordsFound === nbrOfWords) {
						console.log("Player won but no extra words");
						var winningMessage =
							"You have successfully found all " +
							nbrOfWords +
							" words! Congratulations! You gained 100 XP";
						addXPToTotal(100);
					} else {
						console.log("Player won with extra words");
						var addXP = (wordsFound - nbrOfWords) * 10 + 100;
						var extraWords = wordsFound - nbrOfWords;
						addXPToTotal(addXP);
						var winningMessage =
							"You have successfully found all " +
							nbrOfWords +
							" words and " +
							extraWords +
							" extra words! Congratulations! You gained " +
							addXP +
							" XP.";
					}
					gameWin = true;
					printMessage(dialogueTextEl, winningMessage, 30);
					mainGameContinueBtn.setAttribute("class", "nes-btn");
					gameIsPlaying = false;
					console.log("Game is Playing: " + gameIsPlaying);
					wordEl.remove();
					playerHealth.setAttribute("value", adventurerHealth);
					allowGameReset = true;
					clearMiniGame();
				}
			}
		}, 1000);
	}
}

// General Mini game functions

// reset mini game Grid
function resetMiniGameGrid() {
	for (var i = 0; i < gameGridEl.children.length; i++) {
		var itemsToClear = gameGridEl.children[i].children;
		if (itemsToClear.length > 0) {
			itemsToClear[itemsToClear.length - 1].remove();
		}
	}
}
// clearMini Games
function clearMiniGame() {
	mainGameContinueBtn.addEventListener("click", function () {
		if (allowGameReset) {
			console.log("Mini Game is over and next story is starting");
			clearDialog();
			clearStory();
			resetMiniGameGrid();
			allowGameReset = false;
		}
	});
}
// adding xp and leveling up player
function addXPToTotal(amountOfXp) {
	console.log(amountOfXp + "XP gained");
	adventurerXP = adventurerXP + amountOfXp;
	playerXP.setAttribute("value", adventurerXP);

	if (adventurerXP >= playerXP.max) {
		var levelUps = Math.floor(adventurerXP / playerXP.max);
		adventurerXP = adventurerXP - playerXP.max * levelUps;
		playerXP.setAttribute("value", adventurerXP);
		adventurerLevel = adventurerLevel + levelUps;
		playerLevel.textContent = adventurerLevel;
		console.log("Player Leveled up " + levelUps);
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

//checks the current scene for a dialog
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
function loadScene() {
	console.log(hasStory());
	// if there is a story to the scene then load the scene
	updateBackgroundImage();
	if (hasStory()) {
		console.log("pm in load scene a");
		printMessage(
			storyTextPEl,
			taleArray[taleTracker][1].story[storyIndex].replace("Player", adventurerName),
			30
		);
	}
	// if there's a dialog to the scene AND there's no story or the story has reached the end, then load the dialog. Dialog will always be loaded after the story if there is onne.
	if (
		hasDialog() == true &&
		(hasStory() == false || storyIndex == taleArray[taleTracker][1].story.length - 1)
	) {
		console.log("enable disabled because end of story or no story, load dialog");
		enableContinue(false);
		clearDialog();
		setTimeout(() => {
			loadDialog();
			showDialogButton(true);
		}, 3000);
	}
	// if there is a game to play, check what type of game it is and play it.
	if (hasGame(taleArray[taleTracker][1].game) == true) {
		if (taleArray[taleTracker][1].game == "hangman") {
			playHangman(butcherWordPool, 60, 6);
		} else if (taleArray[taleTracker][1].game == "hangman 2") {
			playHangman(forestWordPool, 60, 6);
		} else if (taleArray[taleTracker][1].game == "troll") {
			playCombat(0);
		} else if (taleArray[taleTracker][1].game == "witch") {
			playCombat(1);
		}
	}
}

function loadDialog() {
	// if there are options ot the story
	if (hasOptions() == true) {
		// load the dialog first
		console.log("pm in load dialog a");
		printMessage(
			dialogueTextEl,
			taleArray[taleTracker][1].dialog[dialogIndex].replace("Player:", adventurerName + ":"),
			30
		);
		//load the options after 3 seconds
		setTimeout(() => {
			loadOptions();
			showOptions(true);
			showDialogButton(true);
		}, 3000);
	} else {
		// if there's no options then just load the dialog
		console.log("pm in load dialog b");
		printMessage(
			dialogueTextEl,
			taleArray[taleTracker][1].dialog[dialogIndex].replace("Player:", adventurerName + ":"),
			30
		);
	}
}

// give the options the values based on the JSON.
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
	checkGameWin();
	// When not playing the game
	if (!gameIsPlaying && allowNextDialogue) {
		// if the current scene does not have a game
		if (hasGame(taleArray[taleTracker][1].game) == false) {
			console.log(
				"update continue button taleTracker: " +
					taleTracker +
					" storyI: " +
					storyIndex +
					" dialogI: " +
					dialogIndex
			);

			storyIndex++;
			if (storyIndex == taleArray[taleTracker][1].story.length) {
				if (
					//storyIndex == taleArray[taleTracker][1].story.length &&
					hasDialog() == true
				) {
					enableContinue(false);
					clearDialog();
					loadDialog();
					showDialogButton(true);
				} else if (
					//storyIndex == taleArray[taleTracker][1].story.length &&
					hasDialog() == false
				) {
					taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);
					clearStory();
					storyIndex = 0;
					dialogIndex = 0;
					loadScene();
				}
			} else {
				clearStory();
				loadScene();
			}
		} else if (hasGame(taleArray[taleTracker][1].game) == true) {
			console.log("game end, scene update");
			if (gameWin) {
				taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[0]);
			} else {
				taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[1]);
			}
			gameWin = false;
			storyIndex = 0;
			dialogIndex = 0;
			loadScene();
		}
	}
});

// taleTracker ++ changed to taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[0]);
// Load the dialog to the dialog section
dialogueNextBtn.addEventListener("click", () => {
	if (!gameIsPlaying && allowNextDialogue) {
		// clear options on click in case there are any
		showOptions(false);
		console.log("dialog button clicked");
		dialogIndex++;
		clearDialog();
		if (dialogIndex < taleArray[taleTracker][1].dialog.length) {
			console.log(
				"update taleTracker: " +
					taleTracker +
					" storyI: " +
					storyIndex +
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
					if (hasOptions() == true && yesEl.children[0].checked == true) {
						console.log("at 424: " + taleTracker);
						taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[0]);
					} else if (hasOptions() == true && noEl.children[0].checked == true) {
						// if user chooses to not play the game
						console.log("at 434:" + taleTracker);
						taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[1]);
					} else {
						console.log("at 905:");
						taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);
					}
				} else {
					// if there's no game
					console.log("at 439:" + taleTracker);
					console.log(
						taleTracker +
							" " +
							Object.keys(tale).indexOf(taleArray[taleTracker][1].next)
					);
					//
					taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);
				}
				storyIndex = 0;
				dialogIndex = 0;
				console.log(
					"next scene should be enabled. taleTracker: " +
						taleTracker +
						" storyI: " +
						storyIndex +
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
				if (hasGame(taleArray[taleTracker + 1][1].game) == true) {
					// if user chooses to play the game
					console.log("next story has game is true");
					if (hasOptions() == true && yesEl.children[0].checked == true) {
						console.log("at 424: " + taleTracker);
						taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[0]);
					} else if (hasOptions() == true && noEl.children[0].checked == true) {
						// if user chooses to not play the game
						console.log("at 434:" + taleTracker);
						taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next[1]);
					} else {
						taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);
					}
				} else {
					console.log("at 906: " + taleTracker);
					taleTracker = Object.keys(tale).indexOf(taleArray[taleTracker][1].next);
				}
				storyIndex = 0;
				dialogIndex = 0;
				console.log(
					"next scene should be enabled. taleTracker: " +
						taleTracker +
						" storyI: " +
						storyIndex +
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

// update background image based on location.
function updateBackgroundImage() {
	if (taleArray[taleTracker][1].place != "") {
		gameGridEl.style.backgroundImage = taleArray[taleTracker][1].place;
	}
}

// First load of the game.
function initGame() {
	taleArray = Object.entries(tale);
	console.log(taleArray);
	// clear dialog and story to load new prompts
	clearDialog();
	clearStory();

	if (playerCharacter.currScene != null) {
		taleTracker = playerCharacter.currScene;
	} else {
		taleTracker = 0;
	}
	storyIndex = 0;
	dialogIndex = 0;
	console.log("pm in initgame");
	// printMessage(storyTextPEl, taleArray[taleTracker][1].story[storyIndex], 30);
	loadScene();
	if (taleTracker == 0) {
		enableContinue(false);
	} else {
		enableContinue(true);
	}
}

// Game is started after story json data is grabbed.
fetch("./assets/JSON/story.json")
	.then((res) => res.json())
	.then((data) => {
		tale = data;
		initGame();
	});
