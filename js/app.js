;(function() {

    var states = {};
    var isMobile = false;

    // exports
    window.registerState = function(name, state) {
        states[name] = state;
    };

    window.isOnMobile = function () {
        return isMobile;
    };

    window.onload = function () {
        isMobile =  navigator.userAgent.indexOf("Mobile") > -1;
        // init global game instance
        if (!isMobile) {
            window.game = new Phaser.Game(1280, 800, Phaser.AUTO, "ph_game");
        } else {
            window.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "ph_game");
        }
        //add a state or screen to the game
        for (var key in states) {
            game.state.add(key, states[key]);
        }

        game.state.start("init");
    };

})();
