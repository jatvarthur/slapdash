;(function() {

    var stateLoad = {
        _MT: {}

        , preload: function () {
            var empty = game.add.image(0, 0, "loadingEmpty");
            var full = game.add.image(0, 0, "loadingFull");

            empty.anchor.set(0.5, 0.5);
            empty.y = game.world.centerY;
            empty.x = game.world.centerX;

            full.anchor.set(0, 0.5);
            full.x = game.world.centerX - empty.width / 2;
            full.y = empty.y;

            game.load.setPreloadSprite(full);

            this._doPreload();
        }

        , _doPreload: function() {
            game.load.image("blot", "images/blot_white.png");
            game.load.spritesheet("jars", "images/jar.png", 125, 150);
            game.load.image("back_layer_1", "images/back_layer_1.jpg");
            game.load.image("back_layer_2", "images/back_layer2_2.png");
            game.load.image("back_layer_3", "images/back_layer3_2.png");

            game.load.image("holder_layer", "images/picture_holder.png");

            game.load.image("picture_1", "images/pics/pic_1_3.gif");
            game.load.image("picture_1_ref", "images/pics/pic_1_1.jpg");
            game.load.image("picture_1_mask", "images/pics/pic_1_mask.gif");

            //game.load.spritesheet("ic_building_type", "images/main/ic_building_sheet_150x150.png", 300, 300);

            //game.load.audio('backgroundMusic', 'audio/austin_blues.mp3');
        }

        , create: function () {
            game.state.start("main");
        }

        , update: function () {

        }

    };

    // exports
    window.registerState("load", stateLoad);

})();
