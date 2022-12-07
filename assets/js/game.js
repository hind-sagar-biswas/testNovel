// Importing JSON Data
import characterData from "../../db/characters.json" assert { type: "json" };
import sceneData from "../../db/scenes.json" assert { type: "json" };
import storyData from "../../db/story.json" assert { type: "json" };

// Required Constants
const DEBUG = true;
const startPoint = 1;

// Select required DOM elements
const dom = {
	container: document.getElementById("game-container"),
	character: document.getElementById("character"),
	characterNameBox: document.getElementById("dialogue-character-name"),
	dialogueBox: document.getElementById("dialogue"),
	optionBox: document.getElementById("option-box"),
};

// To update DOM according to story
const updateGame = (storyObj) => {
	if (storyObj.characterName != null) {
		if (storyObj.characterMode == null || storyObj.characterMode == "base")
			storyObj.characterMode = "basic";

		const characterImg =
			characterData.imageLocation +
			storyObj.character.images[storyObj.characterMode];
		const characterFullName =
			storyObj.character.firstName + " " + storyObj.character.lastName;

		dom.character.innerHTML = `<img src="${characterImg}" alt="${characterFullName}" title="${characterFullName}">`;
		dom.characterNameBox.innerHTML = `${storyObj.character.firstName}`;
		dom.characterNameBox.style.visibility = "visible";
	} else {
		dom.character.innerHTML = ``;
		dom.characterNameBox.style.visibility = "hidden";
	}

	if (storyObj.scene != null) {
		const sceneImg = sceneData.imagelocation + storyObj.scene.image;
		dom.container.style.backgroundImage = `url('${sceneImg}')`;
	} else {
		dom.container.style.backgroundImage = `url('assets/img/background/night.webp')`;
	}

	dom.dialogueBox.innerHTML = storyObj.dialogue;
	dom.optionBox.innerHTML = "";
	storyObj.choices.forEach((choice) => {
		if (DEBUG) console.log(choice);
		dom.optionBox.innerHTML += `<div class="option" id="choice-${choice.id}">
										${choice.choice}
										<input type="hidden" id="choice-${choice.id}-value" value='${JSON.stringify(choice)}'>
									</div>`;
	});

	// Adding Event Listeners to all option Btns
	document.querySelectorAll(".option").forEach((option) => {
		option.addEventListener("click", (e) => {
			if (DEBUG) console.log("Recieved a Response!");
			const choice = JSON.parse(
				document.getElementById(e.target.id + "-value").value
			);
			runGame(choice);
		});
	});
};

// To setup story object adding character and scene info
const setUpStory = (storyId) => {
	const story = storyData[storyData.findIndex((story) => story.id === storyId)];
	if (DEBUG) console.log("Setup Story: ", story);

	if (story.scene != null) story.scene = sceneData.scenes[story.scene];
	if (story.characterName != null)
		story.character = characterData.characters[story.characterName];

	return story;
};

// For Response from player
const getChoiceStory = (scene, choiceObj) => {
	if (DEBUG) console.log("Setting up choice story!");

	return {
		id: -2,
		characterName: "protagonist",
		characterMode: "basic",
		character: characterData.characters["protagonist"],
		scene: scene,
		dialogue: choiceObj.choice,
		choices: [
			{
				id: 1,
				choice: "Next",
				next: choiceObj.next,
			},
		],
	};
};

// Main game running function which runs @ player response
const runGame = (response) => {
	if (DEBUG) console.log("Response:", response.choice);

	let story;
	if (response.choice !== "Next")
		story = getChoiceStory(currentStory.scene, response);
	else story = setUpStory(response.next);
	if (DEBUG) console.log(story);
	updateGame(story);
};

// To get the start point/story
let currentStory = setUpStory(startPoint);
window.addEventListener("load", () => {
	let story = setUpStory(currentStory.id);
	if (DEBUG) console.log("Start Story:", story);
	updateGame(story);
});
