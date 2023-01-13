// Global variables
var startBtn = document.getElementById("start-btn");
var backBtn = document.getElementById("back-btn");
var continueBtn = document.getElementById("continue-btn");

// Document selectors
var startContainer = document.getElementById("start-container");
var characterSelectContainer = document.getElementById("character-select-container");
var characterNameInput = document.querySelector("#character-name");

// Start page and character select JavaScript
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

function characterStats(){
    var characterInfo = {
        "name": characterNameInput.value,
        "damage": damage,
        "weapon": weapon,
        "lives": lives
        
    }
}


// returns something? but nothing useful that I can find
// $('#character-slides').on('slide.bs.carousel', function onSlide (e) {
//     var currentItem = $(e.relatedTarget);
//     console.log(currentItem);
//   })


startBtn.addEventListener("click", showCharacterSelect);
backBtn.addEventListener("click", returnToTitle);
