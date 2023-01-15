// Retrieving values from local storage and displaying them in character display panel
var playerCharacter = JSON.parse(localStorage.getItem("playerCharacter"));
var playerImage = document.getElementById("adventurer");
var playerName = document.getElementById("name");
var playerLevel = document.getElementById("currLevel");
var playerHealth = document.getElementById("health");
var playerXP = document.getElementById("xp");
var heartOne = document.getElementById("1");
var heartTwo = document.getElementById("2");
var heartThree = document.getElementById("3");
var dialogueTextEl = document.getElementById("dialogueText");

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
playerXP.setAttribute("value", adventurerXP);

displayLives();

function printMessage(destination, message, speed) {
	var i = 0;
	var interval = setInterval(function () {
		destination.innerHTML += message.charAt(i);
		i++;
		if (i > message.length) {
			clearInterval(interval);
		}
	}, speed);
}

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
var yesEl = document.getElementById("yes");
var noEl = document.getElementById("no");
var dialogueNextBtn = document.getElementById("dialogueBtn");
var divA1 = document.getElementById("a1");
var divA5 = document.getElementById("a5");
var divC3 = document.getElementById("c3");
var storyTextPEl = document.getElementById("storyText");

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

function playHangman() {
	// hangman game elements
	var wordPool = [
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
	var randomWord;
	var maskedWord = [];
	var timeLeft = 30;
	var wordsFound = 0;

	// generating hangman game element
	var miniGameContainer = document.createElement("div");
	miniGameContainer.setAttribute("id", "miniGame");

	var miniGameTitle = document.createElement("p");
	miniGameTitle.textContent = "The Hangman Game";

	var wordEl = document.createElement("p");
	wordEl.setAttribute("id", "wordToFind");

	var startMiniGameBtn = document.createElement("button");
	startMiniGameBtn.textContent = "Start!";
	startMiniGameBtn.setAttribute("id", "hangmanStartBtn");

	miniGameContainer.appendChild(miniGameTitle);
	miniGameContainer.appendChild(wordEl);
	miniGameContainer.appendChild(startMiniGameBtn);

	divC3.appendChild(miniGameContainer);

	// generating hangman words found element
	var wordsFoundEl = document.createElement("p");
	wordsFoundEl.setAttribute("id", "wordsFound");
	wordsFoundEl.textContent = "0/5 words";

	// var wordsFoundContainer = document.createElement("div")
	// wordsFoundContainer.setAttribubte("id", "wordsFoundContainer")
	// wordsFoundContainer.appendChild(wordsFoundEl)
	divA1.appendChild(wordsFoundEl);

	// generating hangman timeer element
	var timeLeftContainer = document.createElement("div");
	timeLeftContainer.setAttribute("id", "timer");
	var timeLeftText = document.createElement("p");
	timeLeftText.textContent = "time left";
	var timeLeftEl = document.createElement("p");
	timeLeftEl.setAttribute("id", "timeLeft");
	timeLeftEl.textContent = timeLeft + " seconds";

	timeLeftContainer.appendChild(timeLeftText);
	timeLeftContainer.appendChild(timeLeftEl);

	divA5.appendChild(timeLeftContainer);

	dialogueNextBtn.addEventListener("click", function () {});

	startMiniGameBtn.addEventListener("click", function () {
		mainGameBackBtn.setAttribute("class", "nes-btn is-disabled");
		countdown();
		randomizer();
		wordEl.textContent = maskedWord.join(" ");
		startMiniGameBtn.style.display = "none";
	});

	function randomizer() {
		maskedWord = [];
		randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
		for (var i = 0; i < randomWord.length; i++) {
			maskedWord.push("_");
			wordEl.textContent = maskedWord.join(" ");
		}
	}

	var key;

	function letterInWord() {
		for (var i = 0; i < randomWord.length; i++) {
			if (randomWord[i] === key) {
				maskedWord.splice([i], 1, randomWord[i]);
				wordEl.textContent = maskedWord.join(" ");
				if (!maskedWord.includes("_")) {
					wordsFound++;
					wordsFoundEl.textContent = wordsFound + "/5 words";
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

	function countdown() {
		timeLeft = 30;
		timerInterval = setInterval(function () {
			timeLeft--;
			timeLeftEl.textContent = timeLeft + " seconds";
			if (timeLeft <= 0) {
				clearInterval(timerInterval);
				randomWord = "";
				maskedWord = [];
				wordEl.textContent = "Time is up!";
				if (wordsFound < 5) {
					wordEl.textContent = "Game over!";
					dialogueTextEl.textContent =
						"You did not make it in time! you only found " +
						wordsFound +
						" out of 5 words. You lost 1 life... Would you like to try again?";
					mainGameBackBtn.setAttribute("class", "nes-btn");
					yesEl.style.display = "block";
					noEl.style.display = "block";
				} else if (wordsFound === 5) {
					dialogueTextEl.textContent =
						"You have successfully found all 5 words! Congratulations! You gained 500 XP";
					yesEl.style.display = "none";
					noEl.style.display = "none";
					mainGameContinueBtn.setAttribute("class", "nes-btn");
				} else {
					var addXP = (wordsFound - 5) * 10 + 500;
					var extraWords = wordsFound - 5;
					dialogueTextEl.textContent =
						"You have successfully found all 5 words and " +
						extraWords +
						" extra words! Congratulations! You gained " +
						addXP +
						"XP.";
					yesEl.style.display = "none";
					noEl.style.display = "none";
					mainGameContinueBtn.setAttribute("class", "nes-btn");
				}
			}
		}, 1000);
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
});

// Load the dialog to the dialog section

dialogueNextBtn.addEventListener("click", () => {
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
		initGame();
	});
