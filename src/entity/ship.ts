import { GameCommandType } from '../gameCommandType';
import { ICollisionInfo } from '../interface/iCollisionInfo';
import { IController } from '../interface/iController';
import IPrinter from '../interface/iPrinter';
import { IShipConfig } from '../interface/iShipConfig';
import { IVector2 } from '../interface/iVector2';
import { IGameStateInfo } from '../scene/gameScene';

const shipConfig: Readonly<IShipConfig> = {
    lifes: 5,
};

class Ship {
    private active: boolean = true;
    private lifes: number = shipConfig.lifes;
    private pos: IVector2 = { x: 0, y: 0 };
    private currVelocity: IVector2 = { x: 0, y: 0 };
    private velocity: number = 4;
    private width: number = 0;
    private height: number = 0;
    private sprite: HTMLImageElement | null = null;
    private dieSound: HTMLAudioElement | null = null;
    private bulletSound: HTMLAudioElement | null = null;
    private bulletActive: boolean = false;
    private bulletPos: IVector2 = { x: 0, y: 0 };

    constructor(
        x: number,
        y: number,
        sprite: HTMLImageElement,
        bulletSound: HTMLAudioElement,
        dieSound: HTMLAudioElement,
    ) {
        this.create(x, y, sprite, bulletSound, dieSound);
    }

    public create(
        x: number,
        y: number,
        sprite: HTMLImageElement,
        bulletSound: HTMLAudioElement,
        dieSound: HTMLAudioElement,
    ) {
        this.active = true;
        this.pos = { x, y };
        this.width = sprite.width;
        this.height = sprite.height;
        this.sprite = sprite;
        this.lifes = shipConfig.lifes;
        this.bulletSound = bulletSound;
        this.dieSound = dieSound;
    }

    public restart(x: number, y: number) {
        this.create(x, y, this.sprite!, this.bulletSound!, this.dieSound!);
    }

    public kill(gameState: IGameStateInfo) {
        this.active = false;

        if (this.lifes > 0) {
            this.dieSound!.pause();
            this.dieSound!.currentTime = 0;
            this.dieSound!.play();
            this.lifes -= 1;
        }

        setTimeout(() => {
            if (this.lifes > 0) {
                this.active = true;
                this.pos.x = gameState.screenWidth / 2 - this.width / 2;
            }
        }, 500);

    }

    public disable() {
        this.lifes = 0;
        this.active = false;
    }

    public update(gameState: IGameStateInfo, controller: IController) {
        if (this.active) {
            this.move(gameState, controller);

            if (controller.isCommandPressed(GameCommandType.fire) && !this.bulletActive) {
                this.bulletActive = true;
                this.bulletPos = {
                    x: this.pos.x + this.width / 2,
                    y: this.pos.y,
                };
                this.bulletSound!.pause();
                this.bulletSound!.currentTime = 0;
                this.bulletSound!.play();
            }
        }

        if (this.bulletActive) {
            this.bulletPos.y -= 10;
            const outsideScreen = this.bulletPos.y < 0;

            if (outsideScreen) {
                this.bulletActive = false;
            }
        }
    }

    public draw(printer: IPrinter) {
        if (this.active) {
            printer.drawImage(this.pos.x, this.pos.y, this.sprite!);
        }

        if (this.bulletActive) {
            printer.drawRect(this.bulletPos.x, this.bulletPos.y, 5, 10, 'white');
        }
    }

    public setVelocity(xVelocity: number) {
        this.currVelocity.x = xVelocity;
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getCollisionInfo(): ICollisionInfo {
        return {
            x: this.pos.x,
            y: this.pos.y,
            width: this.width,
            height: this.height,
        };
    }

    public getBulletCollisionInfo(): ICollisionInfo {
        return {
            x: this.bulletPos.x,
            y: this.bulletPos.y,
            width: 5,
            height: 10,
        };
    }

    public getLifes() {
        return this.lifes;
    }

    public isActive() {
        return this.active;
    }

    public isBulletActive() {
        return this.bulletActive;
    }

    public disableBullet() {
        this.bulletActive = false;
    }

    private move(gameState: IGameStateInfo, controller: IController) {
        this.setVelocity(0);

        if (controller.isCommandPressed(GameCommandType.left)) {
            this.setVelocity(-this.velocity);
        } else if (controller.isCommandPressed(GameCommandType.right)) {
            this.setVelocity(this.velocity);
        }

        const outsideScreenNegativeX = this.pos.x < 0;
        const outsideScreenPositiveX = this.pos.x + this.width > gameState.screenWidth;

        const blockMovement = (outsideScreenNegativeX && this.currVelocity.x < 0)
            || (outsideScreenPositiveX && this.currVelocity.x > 0);

        if (blockMovement) {
            this.setVelocity(0);
        }

        this.pos.x += this.currVelocity.x;
    }
}

export default Ship;
