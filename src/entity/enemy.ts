import { ICollisionInfo } from '../interface/iCollisionInfo';
import IPrinter from '../interface/iPrinter';
import { IVector2 } from '../interface/iVector2';
import { IGameStateInfo } from '../scene/gameScene';

class Enemy {
    private active: boolean = true;
    private pos: IVector2 = { x: 0, y: 0 };
    private width: number = 0;
    private height: number = 0;
    private sprite: HTMLImageElement | null;
    private counter: number = 0;
    private direction: number = 1;
    private bulletActive: boolean = false;
    private bulletPos: IVector2 = { x: 0, y: 0 };
    private bulletSize = { width: 5, height: 10 };
    private bulletVelocity: number = 0;

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.pos.x = x;
        this.pos.y = y;
        this.width = image.width;
        this.height = image.height;
        this.sprite = image;
    }

    public update(gameState: IGameStateInfo) {
        if (this.bulletActive) {
            this.bulletPos.y += 2 * this.bulletVelocity;

            const bulletCollisionInfo = this.getBulletCollisionInfo();
            const outsideScreen = bulletCollisionInfo.y + bulletCollisionInfo.width > gameState.screenHeight;

            if (outsideScreen) {
                this.disableBullet();
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

    public move() {
        if (this.counter === 5) {
            this.direction = -this.direction;
            this.pos.y += 20;
        } else {
            this.pos.x += (10 * this.direction);
        }

        this.counter = (this.counter + 1) % 6;
    }

    public getCollisionInfo(): ICollisionInfo {
        return {
            x: this.pos.x,
            y: this.pos.y,
            width: this.width,
            height: this.height,
        };
    }

    public getPosition(): Readonly<IVector2> {
        return this.pos;
    }

    public getBulletCollisionInfo(): ICollisionInfo {
        return {
            x: this.bulletPos.x,
            y: this.bulletPos.y,
            width: this.bulletSize.width,
            height: this.bulletSize.height,
        };
    }

    public isActive() {
        return this.active;
    }

    public isBulletActive() {
        return this.bulletActive;
    }

    public disable() {
        this.active = false;
    }

    public disableBullet() {
        this.bulletActive = false;
    }

    public shot(velocity: number) {
        if (!this.bulletActive) {
            this.bulletPos = {
                x: this.pos.x + (this.width / 2),
                y: this.pos.y + this.height,
            };
            this.bulletActive = true;
            this.bulletVelocity = velocity;
        }
    }
}

export default Enemy;
