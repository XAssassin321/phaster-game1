import MainScene from "MainScene";
import GameOverScene from "GameOverScene";

const sceneConfig = {
	"MainScene": {
		key: "MainScene",
		active: true,
	},
	"GameOverScene": {
		key: "GameOverScene",
		active: false,
	},
}
const gameConfig = {
	debug: true,
	type: Phaser.CANVAS,
	width: 800,
	height: 600,
	scene: [
		new MainScene(sceneConfig.MainScene),
		new GameOverScene(sceneConfig.GameOverScene),
	],
	/*
	scale: {
		mode: Phaser.Scale.ScaleModes.NONE,
		width: window.innerWidth - 100,
		height: window.innerHeight - 100,
	},
	*/
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0}
		}
	}
};

const game = new Phaser.Game(gameConfig);
