// Global variables
var playerCharacter = {};
var apiKey = "5f4d6a42bcd88a23a38f5dc2463373d6"
var requestURL = "https://api.parser.name/?api_key=" + apiKey + "&endpoint=generate&country_code=IS&results=1";

// Document selectors
var startContainer = document.getElementById("start-container");
var characterSelectContainer = document.getElementById("character-select-container");
var characterNameInput = document.querySelector("#character-name-input-field");
var randomizeBtn = document.getElementById("randomize-btn");
var startBtn = document.getElementById("start-btn");
var loadBtn = document.getElementById("load-btn");
var backBtn = document.getElementById("back-btn");
var continueBtn = document.getElementById("continue-btn");
var modal = document.getElementById("warning-modal");
var modalClose = document.getElementsByClassName("close")[0];
var noBtn = document.getElementById("modal-close");
var yesBtn = document.getElementById("modal-continue");
var scoreBtn = document.getElementById("scores-btn");

scoreBtn.addEventListener("click", function(){
    location.href = "./scores.html"
})

// Character object array
var characterOptions = [
{
    "id": "witch",
    "characterName": "",
    "health": 250,
    "damage": 8,
    "xp": 0,
    "level": 1,
    "lives": 3,
    "src": "assets/images/female-witch.png"
},
{
    "id": "adventurer",
    "characterName": "",
    "health": 250,
    "damage": 15,
    "xp": 0,
    "level": 1,
    "lives": 3,
    "src": "assets/images/male-adventurer.png"
},
{
    "id": "fox",
    "characterName": "",
    "health": 250,
    "damage": 10,
    "xp": 0,
    "level": 1,
    "lives": 3,
    "src": "assets/images/fox-adventurer.png"
}]

// Navigate between start and character select containers on button click
function showCharacterSelect(){
    if (localStorage.getItem("playerCharacter") != null)
    {   
        modal.style.display = "block";
        modalBtnSelect();
    }
    else 
    {
        startContainer.classList.remove("visible");
        startContainer.classList.add("hidden");
        characterSelectContainer.classList.remove("hidden");
        characterSelectContainer.classList.add("visible");
    }
}

function returnToTitle(){
    startContainer.classList.remove("hidden");
    startContainer.classList.add("visible");
    characterSelectContainer.classList.remove("visible");
    characterSelectContainer.classList.add("hidden");
}

// Shows load button if a save is available in local storage
if (localStorage.getItem("playerCharacter") != null)
{
    loadBtn.classList.remove("is-disabled");
}

// On click events for modal buttons
function modalBtnSelect(){
    noBtn.onclick = function(){
        modal.style.display = "none";
        return false;
    }
    yesBtn.onclick = function(){
        modal.style.display = "none";
        localStorage.clear(playerCharacter);
        showCharacterSelect();
    }
}

// Retrieve selected carousel character and set to local storage
$('#character-slides').on('slide.bs.carousel', function onSlide (e) {
    var currentItem = $(e.relatedTarget);
        characterOptions.forEach(character => {
            if (currentItem[0].id == character.id)
            {
                playerCharacter = character;
                localStorage.setItem("playerCharacter", JSON.stringify(playerCharacter))
            }
        });
  })

// API call to generate random name
function generateName(){
    fetch(requestURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log();
        var name = data.data[0].name.firstname.name;
        characterNameInput.value = name;
    })
};

  // Event listeners
startBtn.addEventListener("click", showCharacterSelect);
loadBtn.addEventListener("click", function(){
    if(localStorage.getItem("playerCharacter") != null){
        location.href = "./mainGame.html"
    }
    
});
backBtn.addEventListener("click", returnToTitle);
randomizeBtn.addEventListener("click", generateName);

continueBtn.addEventListener("click", function(){
    if (characterNameInput.value.length == 0)
    {
        playerCharacter.characterName = "Nameless";
    }
    else
    {
        playerCharacter.characterName = characterNameInput.value;
    }
    localStorage.setItem("playerCharacter", JSON.stringify(playerCharacter))
    location.href = "./mainGame.html"
});
