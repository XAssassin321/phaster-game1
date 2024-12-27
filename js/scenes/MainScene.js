import Stat from "Stat";
import pixelart from "pixelart"
export default class MainScene extends Phaser.Scene {

	constructor(config) {
		super(config);

		this.inputs = {};
		this.player1;
		this.platform1;
		// this.player1Bullets = [];
		this.nextBulletAt = 0;
		this.nextEnemyWaveAt = 0;

		this.enemies = [];
		this.enemiesBullets = [];

		this.stats = {
			score: new Stat(0),
			coins: new Stat(0),
			life: new Stat(10),
			damage: new Stat(10),
			fireRatePerSec: new Stat(0),
			movementSpeedX: new Stat(200), // Velocity
			movementSpeedY: new Stat(200), //Velocity
		};

		this.statsBoardItems = {};
		this.projectilePools = [];
		this.spritePools = [];

		/*
		**********************************
		Temp Vars : ToDo: Remove later and do not use in published version
		**********************************
		*/

		this.config = {}
		this.collectable1;
		this.bullet1;
		this.other = {
			last_score: 0,
			percentage_score_to_remember: 10,
		};
		this.chanceToDropMirror = 0.0000000001;
		this.gameOver = false;
	}

	preload() {
		//this.load.setBaseURL('https://labs.phaser.io');
		// this.load.image('sky', 'https://labs.phaser.io/assets/skies/space1.png');
		//this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
		// this.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');
console.log(pixelart);
	}

	create() {
		// let {gameWidth, gameHeight} = this.sys.game.canvas;


		const pixelWidth = 4;
		const pixelHeight = 4;
		this.make.graphics()
			.fillStyle(0x00ff00)
			.fillRect(0, 0, 16, 16)
			.generateTexture('ground1', 16, 16);

		this.make.graphics()
			.fillStyle(0x222222)
			.fillRect(0, 0, 2000, 2000)
			.generateTexture('background1', 2000, 2000);


		this.add.image(200, 200, 'background1');


		this.textures.generate('playerA', {data: pixelart.playerAPixles, pixelWidth: pixelWidth});
		this.textures.generate('enemy1', {data: pixelart.enemyAPixles, pixelWidth: pixelWidth});

		this.textures.generate('coin', {data: pixelart.coinPixles, pixelWidth: pixelWidth});
		this.textures.generate('powerUp1', {data: pixelart.powerUp1Pixles, pixelWidth: pixelWidth});
		this.textures.generate('bullet1', {data: pixelart.bullet1Pixles, pixelWidth: pixelWidth});

		this.createProjectilePool('bullet1');

		this.player1 = this.physics.add.image(400, 500, 'playerA');
		this.player1.setOrigin(0.5, 0.5);
		this.player1.setVelocity(50, 50);
		this.player1.setBounce(0.2, 0.2);
		this.player1.setCollideWorldBounds(true);
		this.player1.body.setGravityY(400);


		// this.enemy1 = this.physics.add.image(400, 100, 'enemy1');
		// this.enemy1.setOrigin(0.5, 0.5);
		// this.enemy1.setCollideWorldBounds(false);
		// this.enemy1.body.setGravityY(100);
		// this.enemy1.angle = 180;

		this.collectable1 = this.physics.add.group({
			key: 'coin',
			repeat: 10,
			setXY: {x: 50, y: 0, stepX: 60}
		});

		this.collectable1.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
			child.setScale(0.5);
			child.setSize(10,10);
			child.body.setGravityY(100);
			// console.log(child);
		});

		this.createSpritePool('enemy1', {
			// key: 'enemy1',
			// frameQuantity: 10,
			// maxSize: 20,
			// gridAlign: {
			// 	x: 20,
			// 	y: 20,
			// 	width: 50,
			// 	height: 1,a
			// 	cellWidth: 100
			// },
			velocityX: 0,
			velocityY: 100,
			angle: 180,
			createIfNull: true,
			outOfBoundsKill: true,
			collideWorldBounds: false

		});

		this.platforms = this.physics.add.staticGroup();
		this.platform1 = this.platforms.create(800, 600 - 10, 'ground1').setScale(100, 1).refreshBody();
		// this.platforms.create(400, 400 - 100, 'ground1').setScale(5, 1).refreshBody();
		// this.platforms.create(600, 300, 'ground1').setScale(5, 1);


		this.physics.add.collider(this.player1, this.platforms);
		// this.physics.add.collider(this.bullet1, this.platforms);
		this.physics.add.collider(this.collectable1, this.platforms);

		this.physics.add.overlap(this.spritePools['enemy1'], this.projectilePools['bullet1'],
			(enemy, bullet) => {
				// console.log('bullet hit enemy : ', enemy, bullet);
				this.stats.score.increaseBy(20);

				bullet.disableBody(true, true);
				bullet.setActive(false);
				bullet.setVisible(false);
				bullet.removedFromScene();
				bullet.removeFromDisplayList();
				this.physics.world.remove(bullet.body);

				enemy.disableBody(true, true);
				enemy.setActive(false);
				enemy.setVisible(false);
				enemy.removedFromScene();
				enemy.removeFromDisplayList();
				this.physics.world.remove(enemy.body);
			}
		);
		this.physics.add.overlap(this.spritePools['enemy1'], this.platform1,
			(platform,enemy) => {
				// platform.disableBody(true, true);
				// platform.setActive(false);
				// platform.setVisible(false);
				// platform.removedFromScene();
				// platform.removeFromDisplayList();
				// this.physics.world.remove(platform.body);

				this.stats.life.increaseBy(-10);
				this.stats.life.getTotal();

				enemy.disableBody(true, true);
				enemy.setActive(false);
				enemy.setVisible(false);
				enemy.removedFromScene();
				enemy.removeFromDisplayList();
				this.physics.world.remove(enemy.body);
			}
		);

		this.physics.add.overlap(this.player1, this.collectable1, this.collectCollectable1, null, this);


		this.inputs.cursors = this.input.keyboard.createCursorKeys();
		this.inputs.aio = this.input.keyboard.addKeys({
			left: 'A',
			right: "D",
			up: "W",
			down: "S",
			attack: "SPACE",
			attack2: "SPACE",
		});

		// console.log(this.inputs.cursors);

		this.stats.score.addFlatModifier(2);
		this.stats.score.addMultiModifier(2.5);

		this.stats.life.addFlatModifier(1);
		this.stats.life.increment();

		this.stats.damage.increment();

		this.stats.coins.addFlatModifier(1);
		this.stats.coins.increments(20);

		this.stats.fireRatePerSec.addFlatModifier(4);
		this.stats.fireRatePerSec.increment();


		this.stats.movementSpeedX.increment();
		this.stats.movementSpeedY.increment();

		this.createStatsBoard();


	}

	update() {
		this.applyMovementKeysToEntity(this.inputs.aio, this.player1)
		this.updateStatsBoard();
		this.tryFireBullet(this.player1);

		// let enemies = this.spritePools['enemy1'].createMultiple({
		// 	frameQuantity: 10,
		// 	// maxSize: 10,
		// 	gridAlign: {
		// 		x: 20,
		// 		y: 20,
		// 		width: 50,
		// 		height: 1,
		// 		cellWidth: 100
		// 	},
		// 	velocityX: 0,
		// 	velocityY: 100,
		// 	angle: 180,
		// 	// createIfNull: true,
		// 	// collideWorldBounds: false
		// });
		// console.log(enemies);

		if (this.canSpawnEnemies()) {
			let group = this.spritePools['enemy1'];
			this.removeOutOfBoundGroupMembers(group);

			let randomX = Phaser.Math.Between(10, 600);
			let randomVelocity = Phaser.Math.Between(100, 300);
			randomVelocity = randomVelocity + (this.stats.score.getTotal() * 0.2);

			let enemy = group.getFirstDead(true, randomX, 50);

			// enemy.disableBody(false,false);
			enemy.setActive(true);
			enemy.setVisible(true);
			enemy.setOrigin(0.5, 0.5);
			enemy.setVelocityY(randomVelocity);
			// this.spritePools['enemy1'].getFirstDead(true,100,100);
		}
		if(this.stats.life.getTotal() <= 0){
			console.log("DEAD");
			this.scene.start("GameOverScene");
		}
	}

	applyMovementKeysToEntity(cursors, player) {
		let vX = this.stats.movementSpeedX.getTotal();
		let vY = this.stats.movementSpeedY.getTotal();
		vX = vX + (this.stats.score.getTotal() * 0.2);

		if (cursors.left.isDown) {
			player.setVelocityX(-1 * vX);
			//player.anims.play('left', true);
		} else if (cursors.right.isDown) {
			player.setVelocityX(vX);
			//player.anims.play('right', true);
		} else {
			player.setVelocityX(0);
		}

		if (cursors.down.isDown) {
			player.setVelocityY(vY);
			//player.anims.play('right', true);
		}
			// else if (cursors.up.isDown) {
			// 	player.setVelocityY(-160);
			// 	//player.anims.play('right', true);
		// }
		else if (cursors.up.isDown && player.body.touching.down) {
			player.setVelocityY(-1 * vY);

		}
	}

	fireBullet(actor) {

		// let bullet = this.physics.add.image(this.player1.x, this.player1.y, 'bullet1');

		let group = this.projectilePools['bullet1'];
		let bullet = group.getFirstDead(true, actor.x, actor.y);

		bullet.setActive(true);
		bullet.setVisible(true);
		bullet.setOrigin(0.5, 0.5);
		bullet.setVelocityY(-400);

		// console.log(bullet);

		// bullet.stats = {
		// 	damage: new Stat(1),
		// };
		// bullet.stats.damage.addMultiModifier(2);
		// bullet.stats.damage.increment();
		// console.log(bullet,bullet.stats.damage.getTotal());

		// this.physics.add.collider(bullet, this.platforms);

		// this.player1Bullets.push(bullet);
	}

	canFireBullet() {
		let canFire = this.rateLimiterPerSec(
			this.stats.fireRatePerSec.getTotal(),
			'nextBulletAt'
		);
		// console.log(canFire);
		return canFire;
	}

	tryFireBullet(actor) {
		if ( this.inputs.aio.attack.isDown) {
			if (this.canFireBullet()) {
				this.fireBullet(actor);
			}
		}
	}

	rateLimiterPerSec(ratePerSec, nextActionTimestampVarName) {
		let timeNow = this.time.now;
		let delay = 1000.0 / ratePerSec;

		if (timeNow > this[nextActionTimestampVarName]) {
			let nextActionTimestamp = timeNow + delay;
			this[nextActionTimestampVarName] = nextActionTimestamp;
			// console.log(timeNow, nextActionTimestamp)

			return true;
		} else {
			// console.log(timeNow)
			return false;
		}
	}

	createProjectilePool(ProjectileName, maxCount = 100) {
		// Add an empty sprite group into our game
		// this.projectilePools[ProjectileName] = this.add.group();
		//
		// // Enable physics to the whole sprite group
		// this.projectilePools[ProjectileName].enableBody = true;
		// this.projectilePools[ProjectileName].physicsBodyType = Phaser.Physics.ARCADE;
		//
		// this.projectilePools[ProjectileName].createMultiple(count, 'ProjectileName');
		//
		// console.log(this.projectilePools[ProjectileName])
		// // Sets anchors of all sprites
		// this.projectilePools[ProjectileName].setAll('anchor.x', 0.5);
		// this.projectilePools[ProjectileName].setAll('anchor.y', 0.5);
		//
		// // Automatically kill the bullet sprites when they go out of bounds
		// this.projectilePools[ProjectileName].setAll('outOfBoundsKill', true);
		// this.projectilePools[ProjectileName].setAll('checkWorldBounds', true);

		// Add an empty sprite group into our game
		let group = this.physics.add.group({
			defaultKey: ProjectileName,
			// key: ProjectileName,
			// frameQuantity: 28,
			// gridAlign: {
			// 	x: 14,
			// 	y: 14,
			// 	width: 28,
			// 	height: 1,
			// 	cellWidth: 28
			// },
			// bounceY: 1,
			// maxSize: maxCount,
			createIfNull: true,
			outOfBoundsKill: true,
			collideWorldBounds: false

		});
		// group.setVelocityY(300, 10);
		// group.enableBody = true;
		// group.physicsBodyType = Phaser.Physics.ARCADE;
		// console.log(group);
		// group.createMultiple([count, ProjectileName]);

		// this.removeOutOfBoundGroupMembers(group);
		this.projectilePools[ProjectileName] = group;

	}

	/**
	 *
	 * @param {Phaser.GameObjects.Group} group
	 */
	removeOutOfBoundGroupMembers(group) {
		// console.log(group.getChildren().length);
		// group.children.iterate((child) => {
		group.getChildren().forEach((child) => {
			// this.events.on('update', () => {
			let childInBound = this.physics.world.bounds.contains(child.x, child.y);
			// console.log(`childInBound : ${childInBound}`, child, child.active, child.x, child.y);
			if (child.active === true && childInBound === false) {
				// console.log("Used VS Free", group.getTotalUsed(), group.getTotalFree(), child);
				// child.destroy();
				// child.removedFromScene();
				// child.removeFromDisplayList();
				// this.physics.world.remove(child.body);

				// child.disableBody(true, true);
				child.setActive(false);
				// child.setVisible(false);
				// child.removedFromScene();
				// child.removeFromDisplayList();
				// this.physics.world.remove(child.body);
				// child.destroy();

			}
			// });
		});
	}

	createSpritePool(spriteName, configOverride = {}) {
		let defaultConfig = {
			defaultKey: spriteName,
		};
		let allConfig = Object.assign(defaultConfig, configOverride);
		let group = this.physics.add.group(allConfig);
		// group.enableBody = true;
		// group.physicsBodyType = Phaser.Physics.ARCADE;

		// this.removeOutOfBoundGroupMembers(group);
		this.spritePools[spriteName] = group;

	}

	canSpawnEnemies() {
		let can = this.rateLimiterPerSec(
			1,
			'nextEnemyWaveAt'
		);
		// console.log(canFire);
		return can;
	}

	collectCollectable1(player, collectable) {
		// console.log('collectCollectable1 called');
		// this.stats.score.increment();
		this.stats.score.increaseBy(2);

		// this.stats.life.increaseBy(-2);
		this.stats.life.increment();

		collectable.disableBody(true, true)

		// let tween_results = this.tweens.chain({
		// 	targets: collectable,
		// 	tweens: [a
		// 		{
		// 			scale: 1,
		// 			duration: 100,
		// 			ease: 'Bounce.easeOut',
		// 		},
		// 		{
		// 			delay: 100,
		// 			scale: 0,
		// 			duration: 100,
		// 		}
		// 	],
		// 	// hideOnComplete: true,
		// 	onComplete: () => {
		// 		console.log(collectable)
		// 		collectable.disableBody(true, true)
		// 	},
		//
		// });


	}

	createStatsBoard() {
		// console.log(this.statsBoardItems.score)
		let statsBoardBg = this.make.graphics().fillStyle(0x000000).fillRect(0, 0, 20, 20);
		this.statsBoardBg = statsBoardBg.generateTexture('ground2', 20, 20);

		this.statsBoardItems.score = this.add.text(20, 25, '');
		this.statsBoardItems.coins = this.add.text(20, 50, '');
		this.statsBoardItems.life = this.add.text(20, 75, '');
		this.statsBoardItems.damage = this.add.text(20, 100, '');
		this.statsBoardItems.fireRatePerSec = this.add.text(20, 125, '');
		this.statsBoardItems.movementSpeedXY = this.add.text(20, 150, '');
		// this.scoreText.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
	}

	updateStatsBoard() {
		// console.log(this.statsBoardItems.score)
		this.statsBoardItems.score.setText("Score : " + this.stats.score.getTotal());
		this.statsBoardItems.coins.setText("Coins : " + this.stats.coins.getTotal());
		this.statsBoardItems.life.setText("Life : " + this.stats.life.getTotal());
		this.statsBoardItems.damage.setText("Damage : " + this.stats.damage.getTotal());
		this.statsBoardItems.fireRatePerSec.setText("Fire Rate per Sec : " + this.stats.fireRatePerSec.getTotal());
		this.statsBoardItems.movementSpeedXY.setText("Movement Speed : "
			+ "X:" + this.stats.movementSpeedX.getTotal()
			+ " "
			+ "Y:" + this.stats.movementSpeedY.getTotal()
		);

	}
}
