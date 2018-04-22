;(function() {

    var STATE = {
        SWITCHING_IN: 1,
        SWITCHING_OUT: 2,
        PAINT: 3
    };

    var stateMain = {
        _MT: {}

        // current state
        , _state: STATE.SWITCHING_IN
        // rate of bullets firing
        , _fireRate: 30
        // time to fire next bullet
        , _nextFire: 0
        // time it takes a bullet to fly
        , _bulletSpeed: 200
        // current player data
        , _player: {}
        // current picture data
        , _picture: {}

        , preload: function() {

        }

        , style_hudText:{ font: "56px Barlow Condensed", fill: "#86d500", align: "center" }

        , create: function() {
            this._initPlayer();
            game.input.mouse.callbackContext = this;
            game.input.mouse.mouseWheelCallback = this._onMouseWheel;

            this._background = game.add.image(0, 0, 'back_layer_1');
            this._blayer2 = game.add.group();
            this._blayer2.y = 150;
            this._blayer2.add(game.make.image(0, 0, 'back_layer_2')).scale.set(2.0, 2.0);
            this._blayer2.add(game.make.image(1280, 0, 'back_layer_2')).scale.set(2.0, 2.0);
            this._blayer3 = game.add.group();
            this._blayer3.x = -1280;
            this._blayer3.y = 50;
            this._blayer3.add(game.make.image(0, 0, 'back_layer_3')).scale.set(2.0, 2.0);
            this._blayer3.add(game.make.image(1280, 0, 'back_layer_3')).scale.set(2.0, 2.0);


            game.add.image(1000, 0, "loadingEmpty");
            this._progress = game.add.image(1000, 0, "loadingFull");
            this._progress.scale.set(0, 1);


            this._blot = game.make.sprite(0, 0, 'blot');
            this._blot.anchor.set(0.5);

            this._images = game.add.group();

            this._jars_c = new Array(6);
            this._colors_c = new Array(6);
            this._jars = game.add.group();
            this._jars.x = 20;
            this._jars.y = game.world.height - 280;
            this._jars_c[0] = this._jars.create(62, 170, 'jars', 0);
            this._colors_c[0] = this._jars.create(62, 170, 'jars', 4);
            this._jars_c[1] = this._jars.create(162, 150, 'jars', 1);
            this._colors_c[1] = this._jars.create(162, 150, 'jars', 4);
            this._jars_c[2] = this._jars.create(132, 230, 'jars', 2);
            this._colors_c[2] = this._jars.create(132, 230, 'jars', 4);
            this._jars_c[4] = this._jars.create(292, 180, 'jars', 3);
            this._colors_c[4] = this._jars.create(292, 180, 'jars', 4);
            this._jars_c[3] = this._jars.create(232, 210, 'jars', 3);
            this._colors_c[3] = this._jars.create(232, 210, 'jars', 4);
            this._jars_c[5] = this._jars.create(312, 270, 'jars', 3);
            this._colors_c[5] = this._jars.create(312, 270, 'jars', 4);
            for (var i = 0; i < this._jars_c.length; ++i) {
                this._jars_c[i].anchor.set(0.5, 1.0);
                this._colors_c[i].anchor.set(0.5, 1.0);
            }

            this._holder = game.add.image(game.world.width / 2 + 100, 0, 'holder_layer');
            this._holder.anchor.set(0.5, 0);
            this._holder._w_x = game.world.width / 2 + 100;

            this._bullets = game.add.group();
            this._bullets.createMultiple(50, 'blot');
            this._bullets.setAll('anchor.x', 0.5);
            this._bullets.setAll('anchor.y', 0.5);

            this._textReward = game.add.text(20, 20, "$0", this.style_hudText);
            this._textReward.anchor.set(0, 0);
            this._textClock = game.add.text(200, 20, "0:0", this.style_hudText);
            this._textClock.anchor.set(0, 0);


            this._switchPicture('picture_1');
        }

        , _generateGraphics: function() {
            var graphics = game.add.graphics(0, 0);

            graphics.beginFill(0xFF3300);
            graphics.drawCircle(10, 10, 20);
            graphics.endFill();

            this._bulletTexture = graphics.generateTexture();
            graphics.destroy();
        }

        , _initPlayer: function() {
            this._player.x = game.world.width / 2;
            this._player.y = game.world.height - 100;
            this._player.colors = [];
            this._player.activeColor = 0;
            this._player.reward = 0;
        }

        , _switchPicture: function(name) {
            if (this._mainPicture) this._mainPicture.destroy();
            if (this._miniature) this._miniature.destroy();

            this._picture.name = name;
            this._picture.timeLeft = 0.1 * 60 * 1000;
            this._picture.image = game.cache.getImage(name);
            this._picture.ref = game.cache.getImage(name + '_ref');
            this._picture.mask = game.cache.getImage(name + '_mask');
            this._picture.accuracy = this._picture.image.width / this._picture.mask.width;

            var mwidth = this._picture.mask.width,
                mheight = this._picture.mask.height;
            this._picture.width = this._picture.image.width;
            this._picture.height = this._picture.image.height;
            this._picture.mwidth = mwidth;
            this._picture.mheight = mheight;
            if (this._picture.maskData) this._picture.maskData.destroy();
            this._picture.maskData = game.make.bitmapData(mwidth, mheight);
            this._picture.maskData.draw(this._picture.mask, 0, 0);
            this._picture.maskData.update();
            this._picture.filled = 0;
            this._picture.fill = new Array(mwidth * mheight);
            this._picture.colors = new Map();
            for (var i = 0; i < mheight; ++i) {
                for (var j = 0; j < mwidth; ++j) {
                    this._picture.fill[mwidth * i + j] = false;
                    //AABBGGRR
                    var pixel = this._picture.maskData.getPixel32(j, i);
                    if (this._picture.colors.has(pixel))
                        this._picture.colors.set(pixel, this._picture.colors.get(pixel) + 1);
                    else
                        this._picture.colors.set(pixel, 0);
                }
            }

            if (this._picture.imageData) this._picture.imageData.destroy();
            this._picture.imageData = game.make.bitmapData(this._picture.image.width, this._picture.image.height);
            this._picture.imageData.draw(this._picture.image, 0, 0);
            this._picture.imageData.update();
            // display
            this._mainPicture = game.make.image(0, 0, this._picture.imageData);
            this._mainPicture.x = game.world.width / 2;
            this._mainPicture.y = 100;
            this._mainPicture.anchor.set(0.5, 0);
            this._images.add(this._mainPicture);
            this._miniature = game.make.image(0, 0, name + '_ref');
            this._miniature.scale.set(0.25, 0.25);
            this._miniature.x = this._mainPicture.x + this._mainPicture.width / 2 + 60;
            this._miniature.y = 90;
            this._miniature.angle = -12;
            this._images.add(this._miniature);

            // select first player color
            this._player.colors.length = 0;
            this._picture.colors.forEach(function(count, color) {
                this._player.colors.push(color);
            }, this);
            this._player.activeColor = 0;
            this._onColorsChanged();
            this._onActiveColorChanged();

            this._images.x = game.world.width;
            //this._holder.x = game.world.width;
            this._state = STATE.SWITCHING_IN;
        }

        , _onMouseWheel: function (event) {
            this._player.activeColor += game.input.mouse.wheelDelta;
            var ncolors = this._player.colors.length - 1;
            if (this._player.activeColor < 0) this._player.activeColor = ncolors;
            if (this._player.activeColor > ncolors) this._player.activeColor = 0;
            this._onActiveColorChanged();
        }

        , _getActiveColor: function() {
            var c = this._player.colors[this._player.activeColor];
            return this._convertColor(c);
        }

        , _convertColor: function(c) {
            return ((c & 0xFF) << 16) | (c & 0xFF00) | ((c & 0xFF0000) >> 16); //AABBGGRR
        }

        , _putBlot: function(x, y, bullet) {
            if (x < 0 || x > this._picture.width || y < 0 || y > this._picture.height)
                return;
            // draw blot
            var s = Math.random() * 0.50 + 0.50;
            this._blot.tint = this._getActiveColor();
            this._blot.angle = Math.random() * 359.0;
            this._blot.scale.set(s, s);
            this._picture.imageData.draw(this._blot, x, y);
            // examine
            this._assessBlot(x, y);
        }

        , _assessBlot: function(x, y) {
            var xm = Math.floor(x / this._picture.accuracy),
                ym = Math.floor(y / this._picture.accuracy),
                color = this._player.colors[this._player.activeColor],
                prevFilled = this._picture.filled,
                radius = 2;
                //pixel = this._picture.maskData.getPixel32(xm, ym),
                //index = this._picture.mwidth * ym + xm;


            for (var i = -radius; i <= radius; ++i) {
                var yy = ym + i;
                if (yy < 0 || yy >= this._picture.mheight) continue;
                for (var j = -radius; j <= radius; ++j) {
                    var xx = xm + j;
                    if (xx < 0 || xx >= this._picture.mwidth) continue;
                    var pixel = this._picture.maskData.getPixel32(xx, yy),
                        index = this._picture.mwidth * yy + xx;
                    // became correct
                    if (this._picture.fill[index] !== pixel && pixel === color) {
                        this._picture.filled += 1;
                        this._picture.fill[index] = color;
                    }
                    // became incorrect
                    if (this._picture.fill[index] === pixel && pixel !== color) {
                        this._picture.filled -= 1;
                        this._picture.fill[index] = color;
                    }
                }
            }
/*
            // became correct
            if (this._picture.fill[index] !== pixel && pixel === this._player.colors[this._player.activeColor]) {
                this._picture.filled += 1;
                this._picture.fill[index] = color;
                this._onFillChanged(prevFilled, this._picture.filled);
            }

            // became incorrect
            if (this._picture.fill[index] === pixel && pixel !== this._player.colors[this._player.activeColor]) {
                this._picture.filled -= 1;
                this._picture.fill[index] = color;
                this._onFillChanged(prevFilled, this._picture.filled);
            }
*/
            if (prevFilled !== this._picture.filled)
                this._onFillChanged(prevFilled, this._picture.filled);
        }

        , _onColorsChanged: function() {
            for (var i = 0; i < this._jars_c.length; ++i) {
                this._colors_c[i].visible = false;
            }
            this._player.colors.forEach(function(c, i) {
                this._colors_c[i].tint = this._convertColor(c);
                this._colors_c[i].visible = true;
            }, this);
        }

        , _onActiveColorChanged: function() {
            for (var i = 0; i < this._jars_c.length; ++i) {
                this._jars_c[i].scale.set(1, 1);
                this._colors_c[i].scale.set(1, 1);
            }
            this._jars_c[this._player.activeColor].scale.set(1.25, 1.25);
            this._colors_c[this._player.activeColor].scale.set(1.25, 1.25);
        }

        , _onFillChanged: function(prevFilled, filled) {
            var progress = filled / this._picture.fill.length;
            this._progress.scale.set(progress, 1);

            // reward
            if (filled > prevFilled) {
                this._player.reward += 1;
                this._onRewardChanged();
            }
        }

        , _onRewardChanged: function() {
            this._textReward.setText('$' + this._player.reward);
        }

        , update: function() {
            this._updateBackground();

            switch (this._state) {
                case STATE.SWITCHING_IN:
                    this._switchingIn();
                    break;
                case STATE.SWITCHING_OUT:
                    this._switchingOut();
                    break;
                case STATE.PAINT:
                    this._paint();
                    break;
            }
        }

        , _switchingIn: function() {
            this._images.x = this._images.x - 12;
            if (this._images.x <= 0) {
                this._state = STATE.PAINT;
            }
        }

        , _switchingOut: function() {
            this._images.x = this._images.x + 12;
            if (this._images.x >= 1280) {
                this._switchPicture('picture_1');
            }
        }

        , _paint: function() {
            if (game.input.activePointer.isDown) {
                this._fire();
            }
            this._picture.timeLeft -= game.time.elapsedMS;
            if (this._picture.timeLeft <= 0) {
                this._killBullets();
                this._state = STATE.SWITCHING_OUT;
                return;
            }
            this._updateBullets();
            this._updateHud();
        }

        , _fire: function () {
            if (game.time.now > this._nextFire && this._bullets.countDead() > 0)  {
                this._nextFire = game.time.now + this._fireRate;

                var bullet = this._bullets.getFirstDead();
                bullet.reset(this._player.x, this._player.y);
                bullet.tint = this._getActiveColor();
                bullet._w_xs = this._player.x;
                bullet._w_ys = this._player.y;
                bullet._w_xt = game.input.activePointer.x;
                bullet._w_yt = game.input.activePointer.y;
                bullet._w_tm = game.time.now;
            }
        }

        , _updateBullets: function() {
            this._bullets.forEachAlive(function(bullet) {
                var delta = game.time.now - bullet._w_tm;
                if (delta > this._bulletSpeed) {
                    bullet.alive = false;
                    bullet.visible = false;
                    this._putBlot(bullet._w_xt - (game.world.width - this._picture.width) / 2,
                        bullet._w_yt - 100, bullet);
                    return;
                }

                var t = delta / this._bulletSpeed,
                    s = 1.0 * (1 - t) + 0.50 * t;
                bullet.scale.setTo(s, s);
                bullet.x = bullet._w_xs * (1 - t) + bullet._w_xt * t;
                bullet.y = bullet._w_ys * (1 - t) + bullet._w_yt * t;
            }, this);

        }

        , _killBullets: function() {
            this._bullets.forEachAlive(function(bullet) {
                bullet.alive = false;
                bullet.visible = false;
            }, this);
        }

        , _updateBackground: function () {
            this._blayer2.x = this._blayer2.x - 1;
            if (this._blayer2.x < -1280) this._blayer2.x = 0;

            this._blayer3.x = this._blayer3.x + 1;
            if (this._blayer3.x > 0) this._blayer3.x = -1280;
        }

        , _updateHud: function() {
            var t = Math.floor(this._picture.timeLeft / 1000),
                m = Math.floor(t / 60), s = t - m * 60;
            this._textClock.setText(m + ':' + (s > 9 ? s : '0'+s));
        }

        , _linear: function(yl, yu) {
            return function (t) {
                return yl * (1 - t) + yu * t;
            }
        }

        , _quadratic: function() {
            /*
            var t = delta / this._bulletSpeed,
                s = 1 * (1 - t) + 0.35 * t,
                // y(x) = (d2/2)*(x-xc)^2 + d1*(x-xc)+ d0,
                // d2 = 2 ([(yu-yc)/(xu-xc)] - [(yc-yl)/(xc-xl)]) / (xu-xl),
                // d1 = [(yu-yc)/(xu-xc)] - (d2/2)(xu-xc) = [(yc-yl)/(xc-xl)] + (d2/2)(xc-xl),
                // d0 = yc
                xl = 0, yl = 0,
                xc = 0.5, yc = -15,
                xu = 1, yu = 5,
                d2 = 2*((yu-yc)/(xu-xc)-(yl-yc)/(xl-xc))/(xu-xl),
                d1 = (yu-yc)/(xu-xc) - 0.5*d2*(xu-xc),
                d0 = yc,
                dy = ((0.5 * d2)*(t-xc) + d1) * (t-xc) + d0;
*/

        }


};

    // exports
    window.registerState("main", stateMain);

})();
