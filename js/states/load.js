;(function() {

    var stateLoad = {
        _MT: {}

        , preload: function () {
            var empty = game.add.image(0, 0, "progressbar", 1);
            var full = game.add.image(0, 0, "progressbar", 0);

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
            game.load.image("gun", "images/gun.png");

            game.load.image("picture_1", "images/pics/pic_1_3.gif");
            game.load.image("picture_1_ref", "images/pics/pic_1_1.jpg");
            game.load.image("picture_1_mask", "images/pics/pic_1_mask.gif");
            game.load.image("picture_2", "images/pics/pic_2_3.gif");
            game.load.image("picture_2_ref", "images/pics/pic_2_1.jpg");
            game.load.image("picture_2_mask", "images/pics/pic_2_2.gif");
            game.load.image("picture_3", "images/pics/pic_3_3.gif");
            game.load.image("picture_3_ref", "images/pics/pic_3_1.jpg");
            game.load.image("picture_3_mask", "images/pics/pic_3_2.gif");
            game.load.image("picture_4", "images/pics/pic_4_3.gif");
            game.load.image("picture_4_ref", "images/pics/pic_4_1.jpg");
            game.load.image("picture_4_mask", "images/pics/pic_4_2.gif");
            game.load.image("picture_5", "images/pics/pic_5_3.gif");
            game.load.image("picture_5_ref", "images/pics/pic_5_1.jpg");
            game.load.image("picture_5_mask", "images/pics/pic_5_2.gif");
            game.load.image("picture_6", "images/pics/pic_6_3.gif");
            game.load.image("picture_6_ref", "images/pics/pic_6_1.jpg");
            game.load.image("picture_6_mask", "images/pics/pic_6_2.gif");
            game.load.image("picture_7", "images/pics/pic_7_3.gif");
            game.load.image("picture_7_ref", "images/pics/pic_7_1.jpg");
            game.load.image("picture_7_mask", "images/pics/pic_7_2.gif");
            game.load.image("picture_8", "images/pics/pic_8_3.gif");
            game.load.image("picture_8_ref", "images/pics/pic_8_1.jpg");
            game.load.image("picture_8_mask", "images/pics/pic_8_2.gif");
            game.load.image("picture_9", "images/pics/pic_9_3.gif");
            game.load.image("picture_9_ref", "images/pics/pic_9_1.jpg");
            game.load.image("picture_9_mask", "images/pics/pic_9_2.gif");

            game.load.image("ui_w_character", "images/ui/w_character.png");
            game.load.image("ui_b_play", "images/ui/b_play.png");
            game.load.image("ui_w_clrd_back", "images/ui/w_clrd_back.png");
            game.load.image("ui_w_game_name", "images/ui/w_game_name.png");
            game.load.image("ui_w_final_text", "images/ui/w_final_text.png");

            game.load.image("ui_result1", "images/ui/txt_1.png");
            game.load.image("ui_result2", "images/ui/txt_2.png");
            game.load.image("ui_result3", "images/ui/txt_3.png");
            game.load.image("ui_result4", "images/ui/txt_4.png");
            game.load.image("ui_result5", "images/ui/txt_5.png");


            //game.load.spritesheet("ic_building_type", "images/main/ic_building_sheet_150x150.png", 300, 300);

            game.load.audio('click', 'audio/paper1.wav');
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
