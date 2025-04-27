export default class GameOverScene extends Phaser.Scene {
	constructor(config) {
		super(config);
	}
	create(){
		this.add.text(100, 100, 'GAME OVER');
		this.add.text(100, 200, 'GAME OVER');
		this.add.text(100, 300, 'GAME OVER');
	}

}
