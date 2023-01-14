// Global variables
var startBtn = document.getElementById("start-btn");
var backBtn = document.getElementById("back-btn");
var continueBtn = document.getElementById("continue-btn");
var playerCharacter = {};

// Document selectors
var startContainer = document.getElementById("start-container");
var characterSelectContainer = document.getElementById("character-select-container");
var characterNameInput = document.querySelector("#character-name");

// Character object array
var characterOptions = [{
    "id": "witch",
    "characterName": "",
    "health": 250,
    "damage": 8,
    "xp": 0,
    "level": 0,
    "lives": 3,
    "src": "none"
},
{
    "id": "adventurer",
    "characterName": "",
    "health": 250,
    "damage": 15,
    "xp": 0,
    "level": 0,
    "lives": 3,
    "src": "assets/images/male-adventurer.png"
},
{
    "id": "fox",
    "characterName": "",
    "health": 250,
    "damage": 10,
    "xp": 0,
    "level": 0,
    "lives": 3
}]




// Navigate between start and character select containers on button click
function showCharacterSelect(){
    startContainer.classList.remove("visible");
    startContainer.classList.add("hidden");
    characterSelectContainer.classList.remove("hidden");
    characterSelectContainer.classList.add("visible");
}

function returnToTitle(){
    startContainer.classList.remove("hidden");
    startContainer.classList.add("visible");
    characterSelectContainer.classList.remove("visible");
    characterSelectContainer.classList.add("hidden");
}

// Retrieve selected carousel character and set to local storage
$('#character-slides').on('slide.bs.carousel', function onSlide (e) {
    var currentItem = $(e.relatedTarget);
    console.log(currentItem[0]);
        characterOptions.forEach(character => {
            if (currentItem[0].id == character.id)
            {
                playerCharacter = character;
                localStorage.setItem("playerCharacter", JSON.stringify(playerCharacter))
            }
            
        });
  })

  // Event listeners
startBtn.addEventListener("click", showCharacterSelect);
backBtn.addEventListener("click", returnToTitle);
continueBtn.addEventListener("click", function(){
    playerCharacter.characterName = characterNameInput.value;
    localStorage.setItem("playerCharacter", JSON.stringify(playerCharacter))
    location.href = "./mainGame.html"
})