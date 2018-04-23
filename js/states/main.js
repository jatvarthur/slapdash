;(function() {

    var STATE = {
        INTRO: 0,
        SWITCHING_IN: 1,
        SWITCHING_OUT: 2,
        PAINT: 3,
        GAME_OVER: 4,
        WAITING: 5
    };

    var PICTURES = [
        {
            name: 'picture_1',
            colors: [0xe9c579, 0x9a5129, 0x566f6a, 0x36150f],
            title: 'Mona Lisa - Leonardo da Vinci'
        },{
            name: 'picture_2',
            colors: [0xf3d572, 0xd97046, 0x3b7e6c, 0xa51711],
            title: 'Bathing of the Red Horse - Kuzma Petrov-Vodkin'
        },{
            name: 'picture_3',
            colors: [0xe9dabb, 0xccad8e, 0xb5841e, 0x121b24, 0x345c9b],
            title: 'Girl with a Pearl Earring - Johannes Vermeer'
        },{
            name: 'picture_4',
            colors: [0xf6d873, 0xdb7b47, 0x1f415a, 0x1c2015],
            title: 'The Scream - Edvard Munch'
        },{
            name: 'picture_5',
            colors: [0xfff637, 0x9fc2d6, 0x36688c, 0x181a1a],
            title: 'The Starry Night - Vincent van Gogh'
        },{
            name: 'picture_6',
            colors: [0xe3d7d7, 0x628971, 0x954f77, 0x2d262b],
            title: 'The Walk - Marc Chagall'
        },{
            name: 'picture_7',
            colors: [0xf6f3e7, 0xd29b22, 0x0a2f76, 0x191611],
            title: 'Suprematist composition... -  Kazimir Malevich'
        },{
            name: 'picture_8',
            colors: [0xf7cb38, 0x66552d, 0x3c5e39, 0x0a0c0f],
            title: 'The Kiss -  Klimt'
        },{
            name: 'picture_9',
            colors: [0xe9dda1, 0x4e6468, 0x116da4, 0x202123],
            title: 'Moonwalk - Andy Warhol'
        }
    ];

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
        // current picture index
        , _pictureIndex: 0

        , preload: function() {

        }

        , style_hudText:{ font: "86px Nanum Brush Script", fill: "#86d500", align: "center" }
        , style_titleText:{ font: "42px Nanum Brush Script", fill: "#86d500", align: "center" }
        , style_finalText:{ font: "86px Nanum Brush Script", fill: "#000000", align: "center" }

        , create: function() {
            game.input.mouse.callbackContext = this;
            game.input.mouse.mouseWheelCallback = this._onMouseWheel;

            // sounds
            this.soundClick = game.add.audio("click");
            this.backgroundMusic = game.add.audio("bgm1");
            this.backgroundMusic.volume = .03;
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();

            // graphics
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

            this._blot = game.make.sprite(0, 0, 'blot');
            this._blot.anchor.set(0.5);

            this._jars_c = new Array(5);
            this._colors_c = new Array(5);
            this._jars = game.add.group();
            this._jars.x = 20;
            this._jars.y = game.world.height - 280;
            this._jars_c[0] = this._jars.create(62, 70, 'jars', 0);
            this._colors_c[0] = this._jars.create(62, 70, 'jars', 4);
            this._jars_c[1] = this._jars.create(172, 50, 'jars', 1);
            this._colors_c[1] = this._jars.create(172, 50, 'jars', 4);
            this._jars_c[2] = this._jars.create(132, 150, 'jars', 2);
            this._colors_c[2] = this._jars.create(132, 150, 'jars', 4);
            this._jars_c[4] = this._jars.create(302, 70, 'jars', 3);
            this._colors_c[4] = this._jars.create(302, 70, 'jars', 4);
            this._jars_c[3] = this._jars.create(232, 130, 'jars', 3);
            this._colors_c[3] = this._jars.create(232, 130, 'jars', 4);
            //this._jars_c[5] = this._jars.create(312, 270, 'jars', 3);
            //this._colors_c[5] = this._jars.create(312, 270, 'jars', 4);
            for (var i = 0; i < this._jars_c.length; ++i) {
                this._jars_c[i].anchor.set(0.5, 0.5);
                this._colors_c[i].anchor.set(0.5, 0.5);
                this._colors_c[i].inputEnabled = true;
                this._colors_c[i].events.onInputDown.add(this._onColorClick, this);
            }

            this._images = game.add.group();
            this._textTitle = game.make.text(game.world.width / 2, game.world.height - 100, "-", this.style_titleText);
            this._textTitle.anchor.set(0.5, 1.0);
            this._images.add(this._textTitle);

            this._holder = game.add.image(game.world.width * 2, 0, 'holder_layer');
            this._holder.anchor.set(0.5, 0);
            this._holder._w_x = game.world.width / 2 + 100;

            this._bullets = game.add.group();
            this._bullets.createMultiple(50, 'blot');
            this._bullets.setAll('anchor.x', 0.5);
            this._bullets.setAll('anchor.y', 0.5);

            this._gun = game.add.image(game.world.width - 100, game.world.height, 'gun');
            this._gun.anchor.set(1.0, 1.0);

            this._results = new Array(5);
            this._results[0] = game.add.image(game.world.width / 2, game.world.height / 2, 'ui_result1');
            this._results[1] = game.add.image(game.world.width / 2, game.world.height / 2, 'ui_result2');
            this._results[2] = game.add.image(game.world.width / 2, game.world.height / 2, 'ui_result3');
            this._results[3] = game.add.image(game.world.width / 2, game.world.height / 2, 'ui_result4');
            this._results[4] = game.add.image(game.world.width / 2, game.world.height / 2, 'ui_result5');
            for (var i = 0; i < this._results.length; ++i) {
                this._results[i].anchor.set(0.5, 0.5);
                this._results[i].visible = false;
            }

            this._textReward = game.add.text(20, 90, "$0", this.style_hudText);
            this._textReward.anchor.set(0, 0);
            this._textClock = game.add.text(20, 20, "0:0", this.style_hudText);
            this._textClock.anchor.set(0, 0);
            this._progressEmpty = game.add.image(1000, 20, "progressbar", 1);
            this._progressFull = game.add.image(1000, 20, "progressbar", 0);
            this._progressFull._w_width = this._progressFull.width;
            this._progressFull.cropRect = new Phaser.Rectangle(0, 0, 1, this._progressFull.height);
            this._progressFull.updateCrop();

            this._intro();
            //this._nextPicture();
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
            this._player.x = game.world.width - 350;
            this._player.y = game.world.height - 200;
            this._player.colors = [];
            this._player.activeColor = 0;
            this._player.reward = 0;

            this._pictureIndex = -1;
        }

        , _switchPicture: function(desc) {
            if (this._mainPicture) this._mainPicture.destroy();
            if (this._miniature) this._miniature.destroy();

            this._picture.name = desc.name;
            this._picture.timeLeft = 0.5 * 60 * 1000;
            this._picture.image = game.cache.getImage(desc.name);
            this._picture.ref = game.cache.getImage(desc.name + '_ref');
            this._picture.mask = game.cache.getImage(desc.name + '_mask');
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
                    var pixel = this._picture.maskData.getPixel32(j, i) & 0xffffff;
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
            this._miniature = game.make.image(0, 0, desc.name + '_ref');
            this._miniature.x = game.world.width / 2 + 300;
            this._miniature.y = 85;
            this._miniature.angle = -12;
            this._images.add(this._miniature);
            this._textTitle.setText(desc.title);
            this._textTitle.y = this._picture.height + 150;

            // select first player color
            this._player.colors.length = 0;
            desc.colors.forEach(function(color) {
                // threshold
                this._player.colors.push(this._convertColor(color));
            }, this);
            this._player.activeColor = 0;
            this._onColorsChanged();
            this._onActiveColorChanged();
            this._onFillChanged(0, 0);
        }

        , _onMouseWheel: function (event) {
            if (this._state != STATE.PAINT) return;

            this._player.activeColor += game.input.mouse.wheelDelta;
            var ncolors = this._player.colors.length - 1;
            if (this._player.activeColor < 0) this._player.activeColor = ncolors;
            if (this._player.activeColor > ncolors) this._player.activeColor = 0;
            this._onActiveColorChanged();
        }

        , _onColorClick: function(sprite) {
            this._player.activeColor = sprite._w_colorIndex;
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
                radius = 3;
                //pixel = this._picture.maskData.getPixel32(xm, ym),
                //index = this._picture.mwidth * ym + xm;


            for (var i = -radius; i <= radius; ++i) {
                var yy = ym + i;
                if (yy < 0 || yy >= this._picture.mheight) continue;
                for (var j = -radius; j <= radius; ++j) {
                    var xx = xm + j;
                    if (xx < 0 || xx >= this._picture.mwidth) continue;
                    var pixel = this._picture.maskData.getPixel32(xx, yy) & 0xffffff,
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
                this._jars_c[i].visible = false;
                this._colors_c[i].visible = false;
            }
            var cntm = Math.min(this._player.colors.length, this._colors_c.length);
            for (var i = 0; i < cntm; ++i) {
                this._colors_c[i].tint = this._convertColor(this._player.colors[i]);
                this._colors_c[i]._w_colorIndex = i;
                this._jars_c[i].visible = true;
                this._colors_c[i].visible = true;
            }
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
            this._player.progress = filled / this._picture.fill.length;
            this._progressFull.cropRect.width = this._progressFull._w_width * this._player.progress;
            this._progressFull.updateCrop();

            // reward
            if (filled > prevFilled) {
                this._player.reward += 1;
                this._onRewardChanged();
            }
        }

        , _onRewardChanged: function() {
            this._textReward.setText('$' + this._player.reward);
        }

        , _nextPicture: function() {
            this._pictureIndex += 1;
            if (this._pictureIndex >= PICTURES.length) {
                this._state = STATE.GAME_OVER;
            } else {
                this._images.x = game.world.width;
                this._holder.x = game.world.width + this._holder._w_x;
                this._state = STATE.SWITCHING_IN;
                this._switchPicture(PICTURES[this._pictureIndex]);
            }
        }

        , update: function() {
            this._updateBackground();

            switch (this._state) {
                case STATE.INTRO:
                    break;
                case STATE.SWITCHING_IN:
                    this._switchingIn();
                    break;
                case STATE.SWITCHING_OUT:
                    this._switchingOut();
                    break;
                case STATE.PAINT:
                    this._paint();
                    break;
                case STATE.GAME_OVER:
                    this._gameOver();
                    break;
            }
        }

        , _intro: function () {
            this._state = STATE.INTRO;
            this._showIntro();
        }

        , _switchingIn: function() {
            this._images.x = this._images.x - 12;
            this._holder.x = this._holder.x - 12;
            if (this._images.x <= 0) {
                this._state = STATE.PAINT;
            }
        }

        , _switchingOut: function() {
            this._images.x = this._images.x + 12;
            this._holder.x = this._holder.x + 12;
            if (this._images.x >= 1280) {
                this._hideResult();
                this._nextPicture();
            }
        }

        , _paint: function() {
            if (game.input.activePointer.isDown) {
                this._fire();
            }
            this._picture.timeLeft -= game.time.elapsedMS;
            if (this._picture.timeLeft <= 0) {
                this._killBullets();
                this._showResult(Math.floor(Math.random() * this._results.length));
                this._state = STATE.SWITCHING_OUT;
                return;
            }
            this._updateBullets();
            this._updateHud();
        }

        , _gameOver: function() {
            this._state = STATE.WAITING;
            this._showOutro();
        }

        , _fire: function () {
            /*var x = game.input.activePointer.x - (game.world.width - this._picture.width) / 2,
                y = game.input.activePointer.y - 100;
            if (x < 0 || x > this._picture.width || y < 0 || y > this._picture.height)
                return;
            */

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

        , _hideResult: function() {
            for (var i = 0; i < this._results.length; ++i) {
                this._results[i].visible = false;
            }
        }

        , _showResult: function(i) {
            this._hideResult();
            if (i < 0 || i >= this._results.length) i = 0;
            this._results[i].visible = true;
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

        /* MODALS */
        , _closeModal: function() {
            if (this._modal) {
                this._modal.destroy();
                this._modal = null;
                this.soundClick.play();
            }
        }

        , _showIntro: function() {
            this._closeModal();

            var width = 1280, height = 622;
            var dialog = game.add.group();
            dialog.x = game.world.width / 2 - width / 2;
            dialog.y = game.world.height / 2 - height / 2;

            var back = game.add.sprite(game.world.width, 0, "ui_w_clrd_back");
            back.anchor.set(1.0, 0.0);
            dialog.add(back);

            var character = game.add.sprite(0, 50, "ui_w_character");
            dialog.add(character);

            var icon = game.add.sprite(750, 300, "ui_w_game_name");
            icon.anchor.set(0.5, 0.5);
            dialog.add(icon);

            var posx = 620, posy = height - 46;
            var button = game.add.sprite(posx, posy, "ui_b_play");
            button.anchor.set(0.5, 0.5);
            button.inputEnabled = true;
            button.events.onInputDown.add(function () {
                this._initPlayer();
                this._nextPicture();
                this._closeModal();
            }, this);
            dialog.add(button);
            button.events.onInputOver.add(function (sprite) { sprite.scale.set(1.1); }, this);
            button.events.onInputOut.add(function (sprite) { sprite.scale.set(1.0); }, this);

            this._modal = dialog;
        }

        , _showOutro: function() {
            this._closeModal();

            var width = 1280, height = 622;
            var dialog = game.add.group();
            dialog.x = game.world.width / 2 - width / 2;
            dialog.y = game.world.height / 2 - height / 2;

            var back = game.add.sprite(game.world.width, 0, "ui_w_clrd_back");
            back.anchor.set(1.0, 0.0);
            dialog.add(back);

            var character = game.add.sprite(0, 50, "ui_w_character");
            dialog.add(character);

            var icon = game.add.sprite(750, 250, "ui_w_final_text");
            icon.anchor.set(0.5, 0.5);
            dialog.add(icon);

            var text = game.add.text(750, 400, "$" + this._player.reward, this.style_finalText);
            text.anchor.set(0.5, 0.5);
            dialog.add(text);

            var posx = 620, posy = height - 46;
            var button = game.add.sprite(posx, posy, "ui_b_play");
            button.anchor.set(0.5, 0.5);
            button.inputEnabled = true;
            button.events.onInputDown.add(function () {
                this._initPlayer();
                this._nextPicture();
                this._closeModal();
            }, this);
            dialog.add(button);
            button.events.onInputOver.add(function (sprite) { sprite.scale.set(1.1); }, this);
            button.events.onInputOut.add(function (sprite) { sprite.scale.set(1.0); }, this);

            this._modal = dialog;
        }


    };

    // exports
    window.registerState("main", stateMain);

})();
