var game;

var screen_w = 960;
var screen_h = 640;

var playState = {
	preload: function() 
	{
		game.load.image('tileset', 'assets/tileset.png');
		game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);	
	},
	create: function() 
	{
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		game.stage.backgroundColor = '#C0C0C0';
		
		this.createWorld();
		
		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		game.physics.arcade.enable(this.bullets);
		
		this.bullets.createMultiple(50, 'bullet');
		this.bullets.setAll('checkWorldBounds', true);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.nextFire = 0;
		this.bullets.fireRate = 250;
		
		this.player = game.add.sprite(screen_w/2, screen_h/2, 'arrow');
		this.player.anchor.set(0.5);
		game.physics.arcade.enable(this.player);
		this.player.body.drag.set(10);
		this.player.body.maxVelocity.set(400);
		this.player.scale.set(1, 0.5);
		
		this.player.body.allowRotation = false;
	},
	update: function() 
	{
		this.player.rotation = game.physics.arcade.angleToPointer(this.player);
		
		game.physics.arcade.collide(this.player, this.layer);
		
		if (game.input.activePointer.isDown)
		{
			this.fire();
		}
		
		game.camera.follow(this.player);
		
		//this.screenWrap();
	},
	createWorld: function()
	{
		this.map = game.add.tilemap('map'); 
		this.map.addTilesetImage('tileset');
		this.layer = this.map.createLayer('Tile Layer 1');
		this.layer.resizeWorld();
		this.map.setCollision(1);
	},
	fire: function()
	{
		if (game.time.now > this.bullets.nextFire && this.bullets.countDead() > 0)
		{
			this.bullets.nextFire = game.time.now + this.bullets.fireRate;
			
			this.bullet = this.bullets.getFirstDead();
			
			this.bullet.anchor.set(0.5);
			this.bullet.rotation = this.player.rotation;
			this.bullet.scale.set(0.25);
			
			this.bullet.reset(this.player.x, this.player.y);
			
			//game.physics.arcade.moveToPointer(this.bullet, 300);
			
			this.bullet.body.velocity.x = 800*Math.cos(this.player.rotation) + this.player.body.velocity.x;
			
			this.bullet.body.velocity.y = 800*Math.sin(this.player.rotation) + this.player.body.velocity.y;
			
			this.playerMove();
		}
	},
	playerMove: function()
	{
		this.player.body.velocity.x += -100*Math.cos(this.player.rotation);
		
		this.player.body.velocity.y += -100*Math.sin(this.player.rotation);
	},
	screenWrap: function()
	{
		if (this.player.x < 0)
		{
			this.player.x = game.width;
		}
		else if (this.player.x > game.width)
		{
			this.player.x = 0;
		}

		if (this.player.y < 0)
		{
			this.player.y = game.height;
		}
		else if (this.player.y > game.height)
		{
			this.player.y = 0;
		}
	}
};

game = new Phaser.Game(screen_w, screen_h, Phaser.AUTO, 'game');

game.state.add('play', playState);

game.state.start('play');