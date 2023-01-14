// main game elements
var mainGameBackBtn = document.getElementById("main-back-btn");
var mainGameContinueBtn = document.getElementById("main-continue-btn");
var dialogueTextEl = document.getElementById("dialogueText");
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

// Load the story to the story section
function loadStory() {
	var scene = taleArray[taleTracker][1];
	if (scene.story != null && scene.story.length > 0) {
		console.log(scene.story[sceneIndex]);
		storyTextPEl.textContent = scene.story[sceneIndex];
		if (sceneIndex < scene.story.length) {
			enableContinue(true);

			mainGameContinueBtn.addEventListener("click", () => {
				sceneIndex++;
				console.log(sceneIndex + ", " + scene.story.length);
				storyTextPEl.textContent = scene.story[sceneIndex];
				if (sceneIndex > scene.story.length) {
					console.log("reaches to disable");
					enableContinue(false);
				}
			});
		}
	}
	dialogIndex = 0;
	loadDialog();
}

mainGameContinueBtn.addEventListener("click", () => {});

// Load the dialog to the dialog section
function loadDialog() {
	var scene = taleArray[taleTracker][1];
	if (scene.dialog != null && scene.dialog.length > 0) {
		console.log(scene.dialog[dialogIndex]);
		dialogueTextEl.textContent = scene.dialog[dialogIndex];
		if (dialogIndex < scene.dialog.length) {
			showDialogButton(true);
			dialogueNextBtn.addEventListener("click", function eventHandler() {
				dialogIndex++;
				console.log(dialogIndex + ", " + scene.dialog.length);
				dialogueTextEl.textContent = scene.dialog[dialogIndex];
				if (dialogIndex > scene.dialog.length) {
					console.log("reaches to disable");
					showDialogButton(false);
				}
			});
		}
	}
	taleTracker++;
	sceneIndex = 0;
	loadStory();
}

// Hides or shows the dialog button depending on if it is true/false
function showDialogButton(dialogTF) {
	if (dialogTF) {
		dialogueNextBtn.style.visibility = "visible";
	} else {
		dialogueNextBtn.style.visibility = "hidden";
	}
}

// enable/disable continue button in story section based on true false
function enableContinue(continButtonTF) {
	if (continButtonTF) {
		mainGameContinueBtn.classList.remove("is-disabled");
		mainGameContinueBtn.disabled = false;
	} else {
		mainGameContinueBtn.classList.add("is-disabled");
		mainGameContinueBtn.disabled = true;
	}
}

//might not need this function if loading story and dialog separately?
function printText() {}

// TODO: update background image based on location.
// function updateBackgroundImage(){}

// First load of the game.
function initGame() {
	console.log(tale);
	taleArray = Object.entries(tale);
	taleTracker = 0;
	// clear dialog and story to load new prompts
	clearDialog();
	clearStory();
	//call updateBackgroundImage(); here
	//check if there is a story for the scene then proceed to print the text and use continue button as needed.
	sceneIndex = 0;
	loadStory();
}

// Game is started after story json data is grabbed.
fetch("./assets/JSON/story.json")
	.then((res) => res.json())
	.then((data) => {
		tale = data;
		initGame();
	});
