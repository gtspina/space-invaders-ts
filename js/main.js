(function () {
    'use strict';

    var CanvasPrinter = /** @class */ (function () {
        function CanvasPrinter(targetName, width, height) {
            this.elemCanvas = null;
            this.contextCanvas = null;
            this.width = 0;
            this.height = 0;
            this.elemCanvas = document.querySelector(targetName);
            this.contextCanvas = this.elemCanvas.getContext('2d');
            this.width = width;
            this.height = height;
            this.elemCanvas.width = width;
            this.elemCanvas.height = height;
        }
        CanvasPrinter.prototype.clear = function () {
            this.contextCanvas.clearRect(0, 0, this.width, this.height);
        };
        CanvasPrinter.prototype.drawRect = function (x, y, width, height, color) {
            this.contextCanvas.save();
            this.contextCanvas.fillStyle = color;
            this.contextCanvas.fillRect(x, y, width, height);
            this.contextCanvas.restore();
        };
        CanvasPrinter.prototype.drawText = function (x, y, text, color, fontType, fontSize, alignType) {
            this.contextCanvas.save();
            this.contextCanvas.fillStyle = color;
            this.contextCanvas.font = fontSize + "px " + fontType;
            this.contextCanvas.textAlign = alignType;
            this.contextCanvas.fillText(text, x, y);
            this.contextCanvas.restore();
        };
        CanvasPrinter.prototype.drawImage = function (x, y, image) {
            this.contextCanvas.save();
            this.contextCanvas.drawImage(image, x, y);
            this.contextCanvas.restore();
        };
        CanvasPrinter.prototype.getWidth = function () {
            return this.width;
        };
        CanvasPrinter.prototype.getHeight = function () {
            return this.height;
        };
        CanvasPrinter.prototype.assignOnPrintEvent = function (callback) {
            var that = this;
            window.requestAnimationFrame(function () {
                callback();
                that.assignOnPrintEvent(callback);
            });
        };
        return CanvasPrinter;
    }());

    var assetsPath = [
        { name: 'ship', path: './assets/image/ship.png', type: 'image' },
        { name: 'alien1', path: './assets/image/alien1.png', type: 'image' },
        { name: 'shot1', path: './assets/audio/shot1.mp3', type: 'sound' },
        { name: 'shot2', path: './assets/audio/shot2.mp3', type: 'sound' },
        { name: 'die', path: './assets/audio/die.mp3', type: 'sound' },
        { name: 'endLevel', path: './assets/audio/endlevel.mp3', type: 'sound' },
        { name: 'level', path: './assets/audio/level.mp3', type: 'sound' },
    ];

    var Keyboard = /** @class */ (function () {
        function Keyboard() {
            this.keysStates = [];
        }
        Keyboard.prototype.configure = function () {
            var that = this;
            this.createKeysStates();
            document.addEventListener('keydown', function (evt) {
                that.handleEvent(evt, true);
            });
            document.addEventListener('keyup', function (evt) {
                that.handleEvent(evt, false);
            });
        };
        Keyboard.prototype.isPressed = function (keyCode) {
            var keyState = this.keysStates.find(function (item) {
                return keyCode === item.keyCode;
            });
            if (keyState) {
                return keyState.pressed;
            }
            return false;
        };
        Keyboard.prototype.createKeysStates = function () {
            var that = this;
            var keys = [
                37 /* left */,
                39 /* right */,
                40 /* down */,
                38 /* up */,
                32 /* space */,
                13 /* enter */,
            ];
            keys.forEach(function (key) {
                var keyPressed = {
                    keyCode: key,
                    pressed: false,
                };
                that.keysStates.push(keyPressed);
            });
        };
        Keyboard.prototype.handleEvent = function (evt, pressed) {
            var keyState = this.keysStates.find(function (keyPressed) {
                return evt.keyCode === keyPressed.keyCode;
            });
            if (keyState) {
                keyState.pressed = pressed;
            }
        };
        return Keyboard;
    }());

    var keysToCommands = [
        { key: 37 /* left */, command: "left" /* left */ },
        { key: 39 /* right */, command: "right" /* right */ },
        { key: 38 /* up */, command: "up" /* up */ },
        { key: 40 /* down */, command: "down" /* down */ },
        { key: 32 /* space */, command: "fire" /* fire */ },
        { key: 13 /* enter */, command: "ok" /* ok */ },
    ];
    var KeyboardController = /** @class */ (function () {
        function KeyboardController() {
            this.keyboard = new Keyboard();
        }
        KeyboardController.prototype.configure = function () {
            this.keyboard.configure();
        };
        KeyboardController.prototype.getCommands = function () {
            var _this = this;
            var commands = [];
            keysToCommands.forEach(function (keyToCommand) {
                if (_this.keyboard.isPressed(keyToCommand.key)) {
                    commands.push(keyToCommand.command);
                }
            });
            return commands;
        };
        KeyboardController.prototype.isCommandPressed = function (gameCommand) {
            var commands = this.getCommands();
            return commands.includes(gameCommand);
        };
        return KeyboardController;
    }());

    var shipConfig = {
        lifes: 5,
    };
    var Ship = /** @class */ (function () {
        function Ship(x, y, sprite, bulletSound, dieSound) {
            this.active = true;
            this.lifes = shipConfig.lifes;
            this.pos = { x: 0, y: 0 };
            this.currVelocity = { x: 0, y: 0 };
            this.velocity = 4;
            this.width = 0;
            this.height = 0;
            this.sprite = null;
            this.dieSound = null;
            this.bulletSound = null;
            this.bulletActive = false;
            this.bulletPos = { x: 0, y: 0 };
            this.create(x, y, sprite, bulletSound, dieSound);
        }
        Ship.prototype.create = function (x, y, sprite, bulletSound, dieSound) {
            this.active = true;
            this.pos = { x: x, y: y };
            this.width = sprite.width;
            this.height = sprite.height;
            this.sprite = sprite;
            this.lifes = shipConfig.lifes;
            this.bulletSound = bulletSound;
            this.dieSound = dieSound;
        };
        Ship.prototype.restart = function (x, y) {
            this.create(x, y, this.sprite, this.bulletSound, this.dieSound);
        };
        Ship.prototype.kill = function (gameState) {
            var _this = this;
            this.active = false;
            if (this.lifes > 0) {
                this.dieSound.pause();
                this.dieSound.currentTime = 0;
                this.dieSound.play();
                this.lifes -= 1;
            }
            setTimeout(function () {
                if (_this.lifes > 0) {
                    _this.active = true;
                    _this.pos.x = gameState.screenWidth / 2 - _this.width / 2;
                }
            }, 500);
        };
        Ship.prototype.disable = function () {
            this.lifes = 0;
            this.active = false;
        };
        Ship.prototype.update = function (gameState, controller) {
            if (this.active) {
                this.move(gameState, controller);
                if (controller.isCommandPressed("fire" /* fire */) && !this.bulletActive) {
                    this.bulletActive = true;
                    this.bulletPos = {
                        x: this.pos.x + this.width / 2,
                        y: this.pos.y,
                    };
                    this.bulletSound.pause();
                    this.bulletSound.currentTime = 0;
                    this.bulletSound.play();
                }
            }
            if (this.bulletActive) {
                this.bulletPos.y -= 10;
                var outsideScreen = this.bulletPos.y < 0;
                if (outsideScreen) {
                    this.bulletActive = false;
                }
            }
        };
        Ship.prototype.draw = function (printer) {
            if (this.active) {
                printer.drawImage(this.pos.x, this.pos.y, this.sprite);
            }
            if (this.bulletActive) {
                printer.drawRect(this.bulletPos.x, this.bulletPos.y, 5, 10, 'white');
            }
        };
        Ship.prototype.setVelocity = function (xVelocity) {
            this.currVelocity.x = xVelocity;
        };
        Ship.prototype.getWidth = function () {
            return this.width;
        };
        Ship.prototype.getHeight = function () {
            return this.height;
        };
        Ship.prototype.getCollisionInfo = function () {
            return {
                x: this.pos.x,
                y: this.pos.y,
                width: this.width,
                height: this.height,
            };
        };
        Ship.prototype.getBulletCollisionInfo = function () {
            return {
                x: this.bulletPos.x,
                y: this.bulletPos.y,
                width: 5,
                height: 10,
            };
        };
        Ship.prototype.getLifes = function () {
            return this.lifes;
        };
        Ship.prototype.isActive = function () {
            return this.active;
        };
        Ship.prototype.isBulletActive = function () {
            return this.bulletActive;
        };
        Ship.prototype.disableBullet = function () {
            this.bulletActive = false;
        };
        Ship.prototype.move = function (gameState, controller) {
            this.setVelocity(0);
            if (controller.isCommandPressed("left" /* left */)) {
                this.setVelocity(-this.velocity);
            }
            else if (controller.isCommandPressed("right" /* right */)) {
                this.setVelocity(this.velocity);
            }
            var outsideScreenNegativeX = this.pos.x < 0;
            var outsideScreenPositiveX = this.pos.x + this.width > gameState.screenWidth;
            var blockMovement = (outsideScreenNegativeX && this.currVelocity.x < 0)
                || (outsideScreenPositiveX && this.currVelocity.x > 0);
            if (blockMovement) {
                this.setVelocity(0);
            }
            this.pos.x += this.currVelocity.x;
        };
        return Ship;
    }());

    var Enemy = /** @class */ (function () {
        function Enemy(x, y, image) {
            this.active = true;
            this.pos = { x: 0, y: 0 };
            this.width = 0;
            this.height = 0;
            this.counter = 0;
            this.direction = 1;
            this.bulletActive = false;
            this.bulletPos = { x: 0, y: 0 };
            this.bulletSize = { width: 5, height: 10 };
            this.bulletVelocity = 0;
            this.pos.x = x;
            this.pos.y = y;
            this.width = image.width;
            this.height = image.height;
            this.sprite = image;
        }
        Enemy.prototype.update = function (gameState) {
            if (this.bulletActive) {
                this.bulletPos.y += 2 * this.bulletVelocity;
                var bulletCollisionInfo = this.getBulletCollisionInfo();
                var outsideScreen = bulletCollisionInfo.y + bulletCollisionInfo.width > gameState.screenHeight;
                if (outsideScreen) {
                    this.disableBullet();
                }
            }
        };
        Enemy.prototype.draw = function (printer) {
            if (this.active) {
                printer.drawImage(this.pos.x, this.pos.y, this.sprite);
            }
            if (this.bulletActive) {
                printer.drawRect(this.bulletPos.x, this.bulletPos.y, 5, 10, 'white');
            }
        };
        Enemy.prototype.move = function () {
            if (this.counter === 5) {
                this.direction = -this.direction;
                this.pos.y += 20;
            }
            else {
                this.pos.x += (10 * this.direction);
            }
            this.counter = (this.counter + 1) % 6;
        };
        Enemy.prototype.getCollisionInfo = function () {
            return {
                x: this.pos.x,
                y: this.pos.y,
                width: this.width,
                height: this.height,
            };
        };
        Enemy.prototype.getPosition = function () {
            return this.pos;
        };
        Enemy.prototype.getBulletCollisionInfo = function () {
            return {
                x: this.bulletPos.x,
                y: this.bulletPos.y,
                width: this.bulletSize.width,
                height: this.bulletSize.height,
            };
        };
        Enemy.prototype.isActive = function () {
            return this.active;
        };
        Enemy.prototype.isBulletActive = function () {
            return this.bulletActive;
        };
        Enemy.prototype.disable = function () {
            this.active = false;
        };
        Enemy.prototype.disableBullet = function () {
            this.bulletActive = false;
        };
        Enemy.prototype.shot = function (velocity) {
            if (!this.bulletActive) {
                this.bulletPos = {
                    x: this.pos.x + (this.width / 2),
                    y: this.pos.y + this.height,
                };
                this.bulletActive = true;
                this.bulletVelocity = velocity;
            }
        };
        return Enemy;
    }());

    function hasRectCollision(obj1, obj2) {
        var maxX = obj1.x + obj1.width > obj2.x;
        var maxY = obj1.y + obj1.height > obj2.y;
        var minX = obj1.x < obj2.x + obj2.width;
        var minY = obj1.y < obj2.y + obj2.height;
        return maxX && maxY && minX && minY;
    }

    var enemiesCoordinates = {
        initalPos: { x: 25, y: 40 },
        increment: { x: 60, y: 60 },
    };
    var EnemyManager = /** @class */ (function () {
        function EnemyManager(rows, cols, sprite) {
            this.enemies = [];
            this.incrementVelocity = 1;
            this.restart(rows, cols, sprite);
            this.startShotInterval();
            this.startMoveInterval();
        }
        EnemyManager.prototype.update = function (gameState, ship) {
            var _this = this;
            this.incrementVelocity = gameState.increment;
            this.enemies.forEach(function (col) {
                col.forEach(function (enemy) {
                    _this.updateEnemy(enemy, gameState, ship);
                });
            });
        };
        EnemyManager.prototype.draw = function (printer) {
            this.enemies.forEach(function (col) {
                col.forEach(function (enemy) {
                    enemy.draw(printer);
                });
            });
        };
        EnemyManager.prototype.startMoveInterval = function () {
            var _this = this;
            setTimeout(function () {
                _this.enemies.forEach(function (col) {
                    col.forEach(function (enemy) {
                        enemy.move();
                    });
                });
                _this.startMoveInterval();
            }, Math.round(2000 / this.incrementVelocity));
        };
        EnemyManager.prototype.startShotInterval = function () {
            var _this = this;
            var interval = Math.round(4000 / this.incrementVelocity);
            window.setTimeout(function () {
                _this.shot();
                _this.startShotInterval();
            }, interval);
        };
        EnemyManager.prototype.allEnemiesKilled = function () {
            var killedsNum = 0;
            var enemiesNum = 0;
            this.enemies.forEach(function (col) {
                col.forEach(function (enemy) {
                    enemiesNum += 1;
                    if (!enemy.isActive()) {
                        killedsNum += 1;
                    }
                });
            });
            return killedsNum === enemiesNum;
        };
        EnemyManager.prototype.inMiddleScreen = function () {
            var invalid = this.allEnemiesKilled() || this.enemies.length < 1;
            var inMiddle = false;
            if (!invalid) {
                var enemy = this.enemies[0][0];
                inMiddle = enemy.getPosition().y > 200;
            }
            return inMiddle;
        };
        EnemyManager.prototype.restart = function (rows, cols, sprite) {
            this.enemies = [];
            var initialPosX = enemiesCoordinates.initalPos.x;
            var initialPosY = enemiesCoordinates.initalPos.y;
            for (var indexCols = 0; indexCols < cols; indexCols += 1) {
                var col = [];
                for (var indexRows = 0; indexRows < rows; indexRows += 1) {
                    var enemy = new Enemy(initialPosX, initialPosY, sprite);
                    col.push(enemy);
                    initialPosY += enemiesCoordinates.increment.y;
                }
                initialPosX += enemiesCoordinates.increment.x;
                initialPosY = enemiesCoordinates.initalPos.y;
                this.enemies.push(col);
            }
        };
        EnemyManager.prototype.updateEnemy = function (enemy, gameState, ship) {
            enemy.update(gameState);
            if (enemy.isActive()) {
                var enemyCollisionInfo = enemy.getCollisionInfo();
                var shipCollisionInfo = ship.getBulletCollisionInfo();
                var hasReached = ship.isBulletActive() && hasRectCollision(enemyCollisionInfo, shipCollisionInfo);
                if (hasReached) {
                    enemy.disable();
                    ship.disableBullet();
                }
            }
            var hasBulletCollision = enemy.isBulletActive() && ship.isActive()
                && hasRectCollision(enemy.getBulletCollisionInfo(), ship.getCollisionInfo());
            if (hasBulletCollision) {
                enemy.disableBullet();
                ship.kill(gameState);
            }
        };
        EnemyManager.prototype.shot = function () {
            var nearEnimies = this.getNearEnemies();
            if (nearEnimies.length > 0) {
                var indexSelected = Math.round(Math.random() * (nearEnimies.length - 1));
                nearEnimies[indexSelected].shot(this.incrementVelocity);
            }
        };
        EnemyManager.prototype.getNearEnemies = function () {
            var nearEnimies = [];
            this.enemies.forEach(function (col) {
                var activeEnemies = col
                    .filter(function (enemy) {
                    return enemy.isActive();
                });
                if (activeEnemies.length > 0) {
                    nearEnimies.push(activeEnemies[activeEnemies.length - 1]);
                }
            });
            return nearEnimies;
        };
        return EnemyManager;
    }());

    var AlignType;
    (function (AlignType) {
        AlignType["center"] = "center";
        AlignType["start"] = "start";
    })(AlignType || (AlignType = {}));

    var GUIElement = /** @class */ (function () {
        function GUIElement(pos, fontSize, fontType, color, text, alignType) {
            this.active = true;
            this.pos = { x: 0, y: 0 };
            this.fontSize = 0;
            this.fontType = '';
            this.color = 'white';
            this.text = '';
            this.alignType = AlignType.start;
            this.pos = pos,
                this.fontSize = fontSize,
                this.fontType = fontType,
                this.color = color,
                this.text = text,
                this.alignType = alignType;
        }
        GUIElement.prototype.update = function () {
        };
        GUIElement.prototype.draw = function (printer) {
            if (!this.active) {
                return;
            }
            printer.drawText(this.pos.x, this.pos.y, this.text, this.color, this.fontType, this.fontSize, this.alignType);
        };
        GUIElement.prototype.enable = function () {
            this.active = true;
        };
        GUIElement.prototype.disable = function () {
            this.active = false;
        };
        GUIElement.prototype.setText = function (text) {
            this.text = text;
        };
        return GUIElement;
    }());

    var levelsConfig = [
        { levelName: 'LEVEL 1', cols: 7, rows: 1, increment: 1 },
        { levelName: 'LEVEL 2', cols: 7, rows: 2, increment: 2 },
        { levelName: 'LEVEL 3', cols: 7, rows: 3, increment: 3 },
    ];
    var GameScene = /** @class */ (function () {
        function GameScene() {
            this.printer = null;
            this.images = {};
            this.sounds = {};
            this.gameState = {
                screenHeight: 0,
                screenWidth: 0,
                currentState: 2 /* level */,
                increment: 1,
            };
            this.currentLevelIndex = -1;
            this.enemyManager = null;
            this.ship = null;
            this.txtLife = null;
            this.txtGameOver = null;
            this.txtRestart = null;
            this.txtCurrentLevel = null;
            this.txtThanksLevelsCompleted = null;
        }
        GameScene.prototype.create = function (images, sounds, printer) {
            this.printer = printer;
            this.images = images;
            this.sounds = sounds;
            var shipPos = this.getInitialShipPos();
            this.ship = new Ship(shipPos.x, shipPos.y, this.images.ship, this.sounds.shot1, this.sounds.die);
            this.enemyManager = new EnemyManager(0, 0, this.images.alien1);
            this.gameState.screenHeight = printer.getWidth();
            this.gameState.screenWidth = printer.getHeight();
            this.goNextLevel();
            this.createGUI();
        };
        GameScene.prototype.update = function (controller) {
            this.updateInGameState(controller);
            switch (this.gameState.currentState) {
                case 2 /* level */:
                    var allKilled = this.enemyManager.allEnemiesKilled();
                    if (allKilled) {
                        this.goNextLevel();
                    }
                    break;
                case 4 /* gameOver */: {
                    if (controller.isCommandPressed("ok" /* ok */)) {
                        this.restart();
                    }
                    break;
                }
                default:
                    break;
            }
        };
        GameScene.prototype.draw = function () {
            this.printer.clear();
            this.printer.drawRect(0, 0, this.printer.getWidth(), this.printer.getHeight(), 'black');
            this.ship.draw(this.printer);
            this.enemyManager.draw(this.printer);
            this.drawGUI();
        };
        GameScene.prototype.destroy = function () {
        };
        GameScene.prototype.createGUI = function () {
            this.txtLife = new GUIElement({ x: 20, y: 20 }, 20, 'Arial', 'white', '', AlignType.start);
            this.txtGameOver = new GUIElement({ x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 }, 40, 'Arial', 'white', 'GAME OVER', AlignType.center);
            this.txtGameOver.disable();
            this.txtCurrentLevel = new GUIElement({ x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 }, 40, 'Arial', 'white', '', AlignType.center);
            this.txtCurrentLevel.disable();
            this.txtThanksLevelsCompleted = new GUIElement({ x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 + 50 }, 30, 'Arial', 'white', 'THANKS TO PLAY :)', AlignType.center);
            this.txtThanksLevelsCompleted.disable();
            this.txtRestart = new GUIElement({ x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 + 50 }, 30, 'Arial', 'white', 'PRESS ENTER TO RESTART', AlignType.center);
            this.txtRestart.disable();
        };
        GameScene.prototype.drawGUI = function () {
            this.txtLife.draw(this.printer);
            this.txtGameOver.draw(this.printer);
            this.txtRestart.draw(this.printer);
            this.txtCurrentLevel.draw(this.printer);
            this.txtThanksLevelsCompleted.draw(this.printer);
        };
        GameScene.prototype.isGameOver = function () {
            return this.enemyManager.inMiddleScreen() || this.ship.getLifes() === 0;
        };
        GameScene.prototype.updateInGameState = function (controller) {
            this.gameState.increment += 0.005;
            if (this.isGameOver() && this.gameState.currentState !== 4 /* gameOver */) {
                this.setGameOver();
            }
            this.ship.update(this.gameState, controller);
            this.txtLife.setText("LIFES: " + this.ship.getLifes());
            this.enemyManager.update(this.gameState, this.ship);
        };
        GameScene.prototype.goNextLevel = function () {
            var _this = this;
            this.stopLevelSound();
            this.currentLevelIndex += 1;
            if (this.currentLevelIndex === levelsConfig.length) {
                this.txtCurrentLevel.setText('GAME COMPLETED!');
                this.txtCurrentLevel.enable();
                this.txtThanksLevelsCompleted.enable();
                this.gameState.currentState = 3 /* levelTransition */;
                return;
            }
            var currentLevel = levelsConfig[this.currentLevelIndex];
            console.log("Next level: " + currentLevel.levelName + ".");
            this.gameState.currentState = 3 /* levelTransition */;
            this.gameState.increment = currentLevel.increment;
            window.setTimeout(function () {
                _this.txtCurrentLevel.setText(currentLevel.levelName);
                _this.txtCurrentLevel.enable();
                if (_this.currentLevelIndex > 0) {
                    _this.sounds.endLevel.play();
                }
            }, 400);
            window.setTimeout(function () {
                _this.txtCurrentLevel.disable();
                _this.playLevelSound();
            }, 800);
            window.setTimeout(function () {
                _this.txtCurrentLevel.disable();
                _this.enemyManager.restart(currentLevel.rows, currentLevel.cols, _this.images.alien1);
                _this.gameState.currentState = 2 /* level */;
            }, 1200);
        };
        GameScene.prototype.setGameOver = function () {
            this.ship.disable();
            this.txtGameOver.enable();
            this.txtRestart.enable();
            this.gameState.currentState = 4 /* gameOver */;
        };
        GameScene.prototype.restart = function () {
            this.stopLevelSound();
            var currentLevel = levelsConfig[this.currentLevelIndex];
            this.gameState.currentState = 2 /* level */;
            this.gameState.increment = currentLevel.increment;
            this.enemyManager.restart(currentLevel.rows, currentLevel.cols, this.images.alien1);
            this.txtGameOver.disable();
            this.txtRestart.disable();
            var shipPos = this.getInitialShipPos();
            this.ship.restart(shipPos.x, shipPos.y);
            this.restartLevelSound();
        };
        GameScene.prototype.getInitialShipPos = function () {
            return {
                x: this.printer.getWidth() / 2 - (this.images.ship.width / 2),
                y: this.printer.getHeight() - 60,
            };
        };
        GameScene.prototype.playLevelSound = function () {
            var _this = this;
            this.sounds.level.play();
            this.sounds.level.onended = function () {
                if (_this.gameState.currentState === 2 /* level */) {
                    _this.restartLevelSound();
                }
            };
        };
        GameScene.prototype.stopLevelSound = function () {
            this.sounds.level.pause();
            this.sounds.level.currentTime = 0;
        };
        GameScene.prototype.restartLevelSound = function () {
            this.stopLevelSound();
            this.sounds.level.play();
        };
        return GameScene;
    }());

    var MainMenuScene = /** @class */ (function () {
        function MainMenuScene() {
            this.printer = null;
            this.txtTitle = null;
            this.txtStart = null;
            this.txtTips = null;
        }
        MainMenuScene.prototype.create = function (images, sounds, printer) {
            this.printer = printer;
            this.createGUI();
        };
        MainMenuScene.prototype.update = function (controller, options) {
            if (controller.isCommandPressed("ok" /* ok */)) {
                options.changeScene('game');
            }
        };
        MainMenuScene.prototype.draw = function () {
            this.printer.clear();
            this.printer.drawRect(0, 0, this.printer.getWidth(), this.printer.getHeight(), 'black');
            this.txtTitle.draw(this.printer);
            this.txtStart.draw(this.printer);
            this.txtTips.draw(this.printer);
        };
        MainMenuScene.prototype.destroy = function () {
        };
        MainMenuScene.prototype.createGUI = function () {
            this.txtTitle = new GUIElement({ x: this.printer.getWidth() / 2, y: this.printer.getHeight() / 2 }, 50, 'Arial', 'white', 'SPACE INVADERS', AlignType.center);
            this.txtStart = new GUIElement({ x: this.printer.getWidth() / 2, y: this.printer.getHeight() / 2 + 50 }, 25, 'Arial', 'white', 'PRESS ENTER TO START', AlignType.center);
            this.txtTips = new GUIElement({ x: this.printer.getWidth() / 2, y: this.printer.getHeight() / 2 + 100 }, 20, 'Arial', 'white', 'SPACE - SHOT, ARROWS - MOVE', AlignType.center);
        };
        return MainMenuScene;
    }());

    var SpaceInvadersOptions = /** @class */ (function () {
        function SpaceInvadersOptions(spaceInvadersGame) {
            this.spaceInvadersGame = spaceInvadersGame;
        }
        SpaceInvadersOptions.prototype.changeScene = function (sceneName) {
            this.spaceInvadersGame.changeScene(sceneName);
        };
        return SpaceInvadersOptions;
    }());

    var SpaceInvadersGame = /** @class */ (function () {
        function SpaceInvadersGame(printer) {
            this.printer = null;
            this.currentScene = null;
            this.gameOptions = new SpaceInvadersOptions(this);
            this.images = {};
            this.sounds = {};
            this.controller = new KeyboardController();
            this.printer = printer;
            this.controller.configure();
        }
        SpaceInvadersGame.prototype.start = function () {
            var _this = this;
            var onFinishPreLoad = function () {
                _this.currentScene = new MainMenuScene();
                _this.currentScene.create(_this.images, _this.sounds, _this.printer);
                _this.printer.assignOnPrintEvent(function () {
                    _this.currentScene.update(_this.controller, _this.gameOptions);
                    _this.currentScene.draw();
                });
            };
            this.preloadAssets(onFinishPreLoad);
        };
        SpaceInvadersGame.prototype.changeScene = function (sceneName) {
            this.currentScene.destroy();
            switch (sceneName) {
                case 'game':
                    this.currentScene = new GameScene();
                    break;
                case 'menu':
                    this.currentScene = new MainMenuScene();
                    break;
            }
            this.currentScene.create(this.images, this.sounds, this.printer);
            console.log('Change scene.');
        };
        SpaceInvadersGame.prototype.preloadAssets = function (onFinish) {
            var that = this;
            var missingsAssets = assetsPath.length;
            var onLoadImage = function (name, image) {
                that.images[name] = image;
                console.log("Asset image " + name + " has loaded.");
                missingsAssets -= 1;
                if (missingsAssets < 1) {
                    console.log('Game start.');
                    onFinish();
                }
            };
            var onLoadSound = function (name, sound) {
                that.sounds[name] = sound;
                console.log("Asset sound " + name + " has loaded.");
                missingsAssets -= 1;
                if (missingsAssets < 1) {
                    console.log('Game start.');
                    onFinish();
                }
            };
            assetsPath.forEach(function (assetPath) {
                if (assetPath.type === 'image') {
                    var image_1 = new Image();
                    image_1.src = assetPath.path;
                    image_1.onload = function () {
                        onLoadImage(assetPath.name, image_1);
                    };
                }
                else if (assetPath.type === 'sound') {
                    var sound_1 = new Audio();
                    sound_1.src = assetPath.path;
                    sound_1.onloadeddata = function () {
                        onLoadSound(assetPath.name, sound_1);
                    };
                }
            });
        };
        return SpaceInvadersGame;
    }());

    var printer = new CanvasPrinter('#myCanvas', 500, 500);
    var starForceGame = new SpaceInvadersGame(printer);
    starForceGame.start();

}());
