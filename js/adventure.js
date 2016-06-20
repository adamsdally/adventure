var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var players, player, line;
var graphics;
var cursors;
var defaultSpeed = 500;

function preload() {
    game.load.tilemap('mapTilemap', 'maps/adventure.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('adventureImage', 'maps/adventure.png');
    game.load.image('treesImage', 'assets/tree2.png');
    game.load.spritesheet('playerSpriteSheet', 'assets/dude.png',32,48, 9);
}

function create() {
    var map, groundLayer;

    //add tilemap to game and match Tiled's tileset name to Phaser tileset image
    map = game.add.tilemap('mapTilemap');
    map.addTilesetImage('adventure', 'adventureImage');
    map.addTilesetImage ('Tree', 'treesImage');

    //create the layer named groundLayer from Phaser and resize world to fit
    groundLayer = map.createLayer('groundLayer');
    groundLayer.resizeWorld();
    treeLayer = map.createLayer('treeLayer');

    game.physics.startSystem(Phaser.Physics.ARCADE);
    players = game.add.group();
    players.enableBody = true;

    //convert objects in Tiled playerLayer called player1 to sprites in Phaser
    map.createFromObjects('playerLayer', 'player1', 'playerSpriteSheet', 0, true, false, players);

    //Establish animations for each player in players group
    players.forEach(function(player) {
        player.animations.add('still', [4], 5, true);
        player.animations.add('left', [0,1,2,3], 5, true);
        player.animations.add('right', [5,6,7,8], 5, true);
        player.health=100;
        player.anchor.set(0.5,0.5);
    }, this, true);

    //Currently there is only one player in the players group
    //set it as player and follow with camera
    player = players.children[0];
    game.camera.follow(player);

    //graphics
    game.stage.backgroundColor = '#124184';

    graphics = game.add.graphics(0, 0);

    cursors = game.input.keyboard.createCursorKeys();


}

function update() {

    //line.centerOn(game.input.activePointer.x, game.input.activePointer.y);
    //line.rotate(0.05);

    if (game.input.mousePointer.isDown) {
        //if it's overlapping the mouse, don't move any more
        //otherwise move at speed of 400
        if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
            players.children[0].body.velocity.setTo(0, 0);
        else
            game.physics.arcade.moveToPointer(player, 400);
    } else {
        players.children[0].body.velocity.setTo(0, 0);
    }
    if (cursors.up.isDown)
    {
       player.body.velocity.y = -defaultSpeed;
    }
    else if (cursors.down.isDown)
    {
       player.body.velocity.y = defaultSpeed;

    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -defaultSpeed;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = defaultSpeed;
    }

    //Change animation accordingly
    if (player.body.velocity.x<0)
        player.animations.play('left');
    else if (player.body.velocity.x>0)
        player.animations.play('right');
    else
        player.animations.play('still');

    // draw the health rectangle
    graphics.clear()
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(player.body.x + player.body.width/2 - player.health/2, player.body.y - 10, player.health, 10);


}
