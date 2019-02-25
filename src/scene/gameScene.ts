import Ship from '../entity/ship';
import { GameCommandType } from '../gameCommandType';
import EnemyManager from '../helper/enemyManager';
import { IController } from '../interface/iController';
import { IGameScene } from '../interface/iGameScene';
import { IImageAsset } from '../interface/iImageAsset';
import IPrinter, { AlignType } from '../interface/iPrinter';
import { IVector2 } from '../interface/iVector2';
import { GUIElement } from '../printer/guiElement';
import { ISoundAsset } from '../interface/iSoundAsset';

export interface IGameStateInfo {
    screenWidth: number;
    screenHeight: number;
    currentState: GameState;
    increment: number;
}

interface ILevelConfig {
    readonly levelName: string;
    readonly cols: number;
    readonly rows: number;
    readonly increment: number;
}

const enum GameState {
    level = 2,
    levelTransition = 3,
    gameOver = 4,
}

const levelsConfig: Readonly<ILevelConfig[]> = [
    { levelName: 'LEVEL 1', cols: 7, rows: 1, increment: 1 },
    { levelName: 'LEVEL 2', cols: 7, rows: 2, increment: 2 },
    { levelName: 'LEVEL 3', cols: 7, rows: 3, increment: 3 },
];

class GameScene implements IGameScene {
    private printer: IPrinter | null = null;

    private images: Readonly<IImageAsset> = {};
    private sounds: Readonly<ISoundAsset> = {};

    private gameState: IGameStateInfo = {
        screenHeight: 0,
        screenWidth: 0,
        currentState: GameState.level,
        increment: 1,
    };
    private currentLevelIndex = -1;
    private enemyManager: EnemyManager | null = null;
    private ship: Ship | null = null;

    private txtLife: GUIElement | null = null;
    private txtGameOver: GUIElement | null = null;
    private txtRestart: GUIElement | null = null;
    private txtCurrentLevel: GUIElement | null = null;
    private txtThanksLevelsCompleted: GUIElement | null = null;

    public create(images: Readonly<IImageAsset>, sounds: Readonly<ISoundAsset>, printer: IPrinter) {
        this.printer = printer;
        this.images = images;
        this.sounds = sounds;

        const shipPos = this.getInitialShipPos();
        this.ship = new Ship(shipPos.x, shipPos.y, this.images.ship, this.sounds.shot1, this.sounds.die);
        this.enemyManager = new EnemyManager(0, 0, this.images.alien1);

        this.gameState.screenHeight = printer.getWidth();
        this.gameState.screenWidth = printer.getHeight();

        this.goNextLevel();
        this.createGUI();
    }

    public update(controller: IController) {
        this.updateInGameState(controller);

        switch (this.gameState.currentState) {
            case GameState.level:
                const allKilled = this.enemyManager!.allEnemiesKilled();

                if (allKilled) {
                    this.goNextLevel();
                }
                break;
            case GameState.gameOver: {
                if (controller.isCommandPressed(GameCommandType.ok)) {
                    this.restart();
                }
                break;
            }
            default:
                break;
        }
    }

    public draw() {
        this.printer!.clear();
        this.printer!.drawRect(0, 0, this.printer!.getWidth(), this.printer!.getHeight(), 'black');

        this.ship!.draw(this.printer!);
        this.enemyManager!.draw(this.printer!);

        this.drawGUI();
    }

    public destroy() {

    }

    private createGUI() {
        this.txtLife = new GUIElement(
            { x: 20, y: 20 },
            20,
            'Arial',
            'white',
            '',
            AlignType.start,
        );

        this.txtGameOver = new GUIElement(
            { x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 },
            40,
            'Arial',
            'white',
            'GAME OVER',
            AlignType.center,
        );
        this.txtGameOver.disable();

        this.txtCurrentLevel = new GUIElement(
            { x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 },
            40,
            'Arial',
            'white',
            '',
            AlignType.center,
        );
        this.txtCurrentLevel.disable();

        this.txtThanksLevelsCompleted = new GUIElement(
            { x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 + 50 },
            30,
            'Arial',
            'white',
            'THANKS TO PLAY :)',
            AlignType.center,
        );
        this.txtThanksLevelsCompleted.disable();

        this.txtRestart = new GUIElement(
            { x: this.gameState.screenWidth / 2, y: this.gameState.screenHeight / 2 + 50 },
            30,
            'Arial',
            'white',
            'PRESS ENTER TO RESTART',
            AlignType.center,
        );
        this.txtRestart.disable();
    }

    private drawGUI() {
        this.txtLife!.draw(this.printer!);
        this.txtGameOver!.draw(this.printer!);
        this.txtRestart!.draw(this.printer!);
        this.txtCurrentLevel!.draw(this.printer!);
        this.txtThanksLevelsCompleted!.draw(this.printer!);
    }

    private isGameOver() {
        return this.enemyManager!.inMiddleScreen() || this.ship!.getLifes() === 0;
    }

    private updateInGameState(controller: IController) {
        this.gameState.increment += 0.005;

        if (this.isGameOver() && this.gameState.currentState !== GameState.gameOver) {
            this.setGameOver();
        }

        this.ship!.update(this.gameState, controller);
        this.txtLife!.setText(`LIFES: ${this.ship!.getLifes()}`);
        this.enemyManager!.update(this.gameState, this.ship!);
    }

    private goNextLevel() {
        this.stopLevelSound();
        this.currentLevelIndex += 1;

        if (this.currentLevelIndex === levelsConfig.length) {
            this.txtCurrentLevel!.setText('GAME COMPLETED!');
            this.txtCurrentLevel!.enable();
            this.txtThanksLevelsCompleted!.enable();
            this.gameState.currentState = GameState.levelTransition;
            return;
        }

        const currentLevel = levelsConfig[this.currentLevelIndex];
        console.log(`Next level: ${currentLevel.levelName}.`);
        this.gameState.currentState = GameState.levelTransition;
        this.gameState.increment = currentLevel.increment;

        window.setTimeout(() => {
            this.txtCurrentLevel!.setText(currentLevel.levelName);
            this.txtCurrentLevel!.enable();

            if (this.currentLevelIndex > 0) {
                this.sounds.endLevel.play();
            }
        }, 400);

        window.setTimeout(() => {
            this.txtCurrentLevel!.disable();
            this.playLevelSound();
        }, 800);

        window.setTimeout(() => {
            this.txtCurrentLevel!.disable();
            this.enemyManager!.restart(currentLevel.rows, currentLevel.cols, this.images.alien1);
            this.gameState.currentState = GameState.level;
        }, 1200);
    }

    private setGameOver() {
        this.ship!.disable();
        this.txtGameOver!.enable();
        this.txtRestart!.enable();
        this.gameState.currentState = GameState.gameOver;
    }

    private restart() {
        this.stopLevelSound();
        const currentLevel = levelsConfig[this.currentLevelIndex];
        this.gameState.currentState = GameState.level;
        this.gameState.increment = currentLevel.increment;
        this.enemyManager!.restart(currentLevel.rows, currentLevel.cols, this.images.alien1);
        this.txtGameOver!.disable();
        this.txtRestart!.disable();

        const shipPos = this.getInitialShipPos();
        this.ship!.restart(shipPos.x, shipPos.y);
        this.restartLevelSound();
    }

    private getInitialShipPos(): IVector2 {
        return {
            x: this.printer!.getWidth() / 2 - (this.images.ship.width / 2),
            y: this.printer!.getHeight() - 60,
        };
    }

    private playLevelSound() {
        this.sounds.level.play();

        this.sounds.level.onended = () => {
            if (this.gameState.currentState === GameState.level) {
                this.restartLevelSound();
            }
        };
    }

    private stopLevelSound() {
        this.sounds.level.pause();
        this.sounds.level.currentTime = 0;
    }

    private restartLevelSound() {
        this.stopLevelSound();
        this.sounds.level.play();
    }
}

export default GameScene;
