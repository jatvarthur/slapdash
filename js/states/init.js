;(function() {

    var stateInit = {
        _MT: {}

        , preload: function () {
            game.load.spritesheet("progressbar", "images/progressbar.png", 198, 50);
            //game.load.image("progress", "images/progress_none.png");
            //game.load.image("loadingFull", "images/progress_all.png");
            if (window.isOnMobile()) {
                game.scale.forceOrientation(true, false); // landscape
                /*
                game.scale.enterIncorrectOrientation.add(this.wrongWay, this);
                game.scale.leaveIncorrectOrientation.add(this.rightWay, this);
                */
            }
        }

        , create: function () {
            game.state.start("load");
        }

        , update: function () {

        }

    };

    // exports
    window.registerState("init", stateInit);

})();
