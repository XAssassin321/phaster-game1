class Examples {

	temp() {


		/*
		**********************************
		 Particles
		**********************************
		*/
		// Create
		this.particles = this.add.particles(0, 0, 'red', {
			speed: 100,
			scale: {start: 0.5, end: 0},
			blendMode: 'ADD'
		});
		particles.startFollow(player1);

		/*
		*********************************
		Collectable (simple)
		*********************************
		*/
		// Create
		this.collectable1 = this.physics.add.group({
			key: 'red',
			repeat: 20,
			setXY: {x: 5, y: 0, stepX: 20}
		});

		this.collectable1.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
			child.setScale(0.5);
			child.setSize(10, 10);
			// console.log(child);
		});
		this.physics.add.overlap(this.player1, this.collectable1, this.collectCollectable1, null, this);


		collectCollectable1(player, collectable)
		{
			console.log('collectCollectable1 called');

			collectable.disableBody(true, true);
			// this.game_data.score = this.game_data.score + 1;
			// let score = this.game_data.score;

			let coins = this.game_data.stats.coins;
			coins.addFlatModifier(1);
			let score = coins.getTotal()
			// console.log(score);

			this.scoreText.setText("Score : " + score);

		}


	}
}
