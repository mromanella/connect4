import PlayerPiece from "./piece";
import Utils from "./utils";


export enum Difficulty {
    easy,
    midEasy,
    mid,
    midHard,
    hard
}

export enum GameType {
    playerVsPlayerLocal,
    playerVsAI,
    playerVsPlayerOnline
}

export interface Settings {
    difficulty: Difficulty;
    gameType: GameType;
    aiColor: string;
    startingTurn: string;
}

export let defaultSettings: Settings = {
    difficulty: null,
    gameType: GameType.playerVsPlayerLocal,
    aiColor: null,
    startingTurn: PlayerPiece.colors.red
}

export class SettingsScreen {

    settings: Settings;
    parent: HTMLElement;
    settingsScreen: HTMLElement;

    startingTurnRed: HTMLElement;
    startinTurnYellow: HTMLElement;

    constructor(settings: Settings) {
        this.settings = settings;
        this.parent = document.getElementById('settings-screen-container')
        
        this.settingsScreen = document.createElement('div');
        this.settingsScreen.id = 'settings-screen';
        Utils.addCssClass(this.settingsScreen, ['settings-screen'])

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