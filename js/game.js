class Example extends Phaser.Scene {

	constructor() {
		super();

		this.player1;
		this.player1_data = {
			health : 100,
			energy : 100,


		}
		this.enemy1;
		this.enemy1_data;

		this.ground1;

		this.collectable1;

		this.config = {

		}
		this.game_data = {
			score : 0,
			last_score: 0,
			percentage_score_to_remember : 10,
			temp : []
		}
	}
	preload() {
		//this.load.setBaseURL('https://labs.phaser.io');
		this.load.image('sky', 'https://labs.phaser.io/assets/skies/space1.png');
		//this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
		this.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');

	}

	create() {
		let {gameWidth, gameHeight} = this.sys.game.canvas;

		this.add.image(400, 300, 'sky');

		const pixelWidth = 6;
		const pixelHeight = 6;
		const chick = [
			'...55.......',
			'.....5......',
			'...7888887..',
			'..788888887.',
			'..888088808.',
			'..888886666.',
			'..8888644444',
			'..8888645555',
			'888888644444',
			'88788776555.',
			'78788788876.',
			'56655677776.',
			'456777777654',
			'.4........4.'
		];

		this.scoreText = this.add.text(100, 100, 'PLACEHOLDER',);
		this.scoreText.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
		this.scoreText.setText("Score : " + this.game_data.score);

		let ground1 = this.make.graphics().fillStyle(0x00ff00).fillRect(0, 0, 20, 20);
		this.ground1 = ground1.generateTexture('ground1', 20, 20);
		//this.add.image(400, 600 - 20 - 50, 'ground1');

		this.textures.generate('chick', {data: chick, pixelWidth: pixelWidth});

		this.player1 = this.physics.add.image(150, 200, 'chick');
		this.player1.setOrigin(0.5, 0.5);
		this.player1.setVelocity(50, 50);
		this.player1.setBounce(0.2, 0.2);
		this.player1.setCollideWorldBounds(true);
		this.player1.body.setGravityY(400);


		// this.particles = this.add.particles(0, 0, 'red', {
		// 	speed: 100,
		// 	scale: {start: 0.5, end: 0},
		// 	blendMode: 'ADD'
		// });
		//particles.startFollow(player1);


		this.collectable1 = this.physics.add.group({
			key: 'red',
			repeat: 20,
			setXY: {x: 5, y: 0, stepX: 20}
		});

		this.collectable1.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
			child.setScale(0.5);
			child.setSize(10,10);
			console.log(child);
		});

		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(800, 600 - 100, 'ground1').setScale(100, 1).refreshBody();
		this.platforms.create(400, 400 - 100, 'ground1').setScale(5, 1).refreshBody();
		this.platforms.create(600, 300, 'ground1').setScale(5, 1);


		this.physics.add.collider(this.player1, this.platforms);
		this.physics.add.collider(this.collectable1, this.platforms);

		this.physics.add.overlap(this.player1, this.collectable1, this.collectCollectable1, null, this);


		this.cursors = this.input.keyboard.createCursorKeys();


	}

	update() {
		this.arrowMovements(this.cursors, this.player1)

	}

	arrowMovements(cursors, player) {
		if (cursors.left.isDown) {
			player.setVelocityX(-160);
			//player.anims.play('left', true);
		}
		if (cursors.right.isDown) {
			player.setVelocityX(160);
			//player.anims.play('right', true);
		}
		if (cursors.up.isDown) {
			player.setVelocityY(-160);
			//player.anims.play('right', true);
		}
		if (cursors.down.isDown) {
			player.setVelocityY(160);
			//player.anims.play('right', true);
		}

		if (cursors.up.isDown && player.body.touching.down) {
			player.setVelocityY(-330);
		}
	}

	collectCollectable1(player, collectable) {
		collectable.disableBody(true, true);
		this.game_data.score = this.game_data.score + 1;
		this.scoreText.setText("Score : " + this.game_data.score);

	}
}

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: Example,
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
			gravity: {y: 100}
		}
	}
};

const game = new Phaser.Game(config);
