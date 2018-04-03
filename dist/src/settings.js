import PlayerPiece from "./piece/piece";
import Utils from "./utils";
export var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["easy"] = 0] = "easy";
    Difficulty[Difficulty["midEasy"] = 1] = "midEasy";
    Difficulty[Difficulty["mid"] = 2] = "mid";
    Difficulty[Difficulty["midHard"] = 3] = "midHard";
    Difficulty[Difficulty["hard"] = 4] = "hard";
})(Difficulty || (Difficulty = {}));
export var GameType;
(function (GameType) {
    GameType[GameType["playerVsPlayerLocal"] = 0] = "playerVsPlayerLocal";
    GameType[GameType["playerVsAI"] = 1] = "playerVsAI";
    GameType[GameType["playerVsPlayerOnline"] = 2] = "playerVsPlayerOnline";
})(GameType || (GameType = {}));
export let defaultSettings = {
    difficulty: null,
    gameType: GameType.playerVsPlayerLocal,
    aiColor: null,
    startingTurn: PlayerPiece.colors.red
};
export class SettingsScreen {
    constructor(settings) {
        this.settings = settings;
        this.parent = document.getElementById('settings-screen-container');
        this.settingsScreen = document.createElement('div');
        this.settingsScreen.id = 'settings-screen';
        Utils.addCssClass(this.settingsScreen, ['settings-screen']);
        let radioGroup = document.createElement('div');
        Utils.addCssClass(radioGroup, ['radio-group']);
        let redLabel = document.createElement('label');
        redLabel.innerHTML = 'Red';
        this.startingTurnRed = document.createElement('input');
        this.startingTurnRed.setAttribute('type', 'radio');
        this.startingTurnRed.setAttribute('name', 'starting-turn');
        this.startingTurnRed.setAttribute('value', PlayerPiece.colors.red);
        this.startingTurnRed.setAttribute('checked', 'true');
        let yellowLabel = document.createElement('label');
        yellowLabel.innerHTML = 'Yellow';
        this.startinTurnYellow = document.createElement('input');
        this.startinTurnYellow.setAttribute('type', 'radio');
        this.startinTurnYellow.setAttribute('name', 'starting-turn');
        this.startinTurnYellow.setAttribute('value', PlayerPiece.colors.yellow);
        radioGroup.appendChild(redLabel);
        radioGroup.appendChild(this.startingTurnRed);
        radioGroup.appendChild(yellowLabel);
        radioGroup.appendChild(this.startinTurnYellow);
        this.settingsScreen.appendChild(radioGroup);
        this.parent.appendChild(this.settingsScreen);
    }
    show() {
        // this
    }
}
