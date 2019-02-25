import Enemy from '../entity/enemy';
import Ship from '../entity/ship';
import IPrinter from '../interface/iPrinter';
import { IGameStateInfo } from '../scene/gameScene';
import { hasRectCollision } from './gameUtil';

const enemiesCoordinates = {
    initalPos: { x: 25, y: 40 },
    increment: { x: 60, y: 60 },
};

class EnemyManager {
    private enemies: Enemy[][] = [];
    private incrementVelocity: number = 1;

    constructor(rows: number, cols: number, sprite: HTMLImageElement) {
        this.restart(rows, cols, sprite);
        this.startShotInterval();
        this.startMoveInterval();
    }

    public update(gameState: IGameStateInfo, ship: Ship) {
        this.incrementVelocity = gameState.increment;

        this.enemies.forEach((col) => {
            col.forEach((enemy) => {
                this.updateEnemy(enemy, gameState, ship);
            });
        });
    }

    public draw(printer: IPrinter) {
        this.enemies.forEach((col) => {
            col.forEach((enemy) => {
                enemy.draw(printer);
            });
        });
    }

    public startMoveInterval() {
        setTimeout(() => {
            this.enemies.forEach((col) => {
                col.forEach((enemy) => {
                    enemy.move();
                });
            });

            this.startMoveInterval();
        }, Math.round(2000 / this.incrementVelocity));
    }

    public startShotInterval() {
        const interval = Math.round(4000 / this.incrementVelocity);

        window.setTimeout(() => {
            this.shot();
            this.startShotInterval();
        }, interval);
    }

    public allEnemiesKilled() {
        let killedsNum = 0;
        let enemiesNum = 0;

        this.enemies.forEach((col) => {
            col.forEach((enemy) => {
                enemiesNum += 1;
                if (!enemy.isActive()) {
                    killedsNum += 1;
                }
            });
        });

        return killedsNum === enemiesNum;
    }

    public inMiddleScreen() {
        const invalid = this.allEnemiesKilled() || this.enemies.length < 1;
        let inMiddle = false;

        if (!invalid) {
            const enemy = this.enemies[0][0];

            inMiddle = enemy.getPosition().y > 200;
        }

        return inMiddle;
    }

    public restart(rows: number, cols: number, sprite: HTMLImageElement) {
        this.enemies = [];
        let initialPosX = enemiesCoordinates.initalPos.x;
        let initialPosY = enemiesCoordinates.initalPos.y;

        for (let indexCols = 0; indexCols < cols; indexCols += 1) {
            const col: Enemy[] = [];

            for (let indexRows = 0; indexRows < rows; indexRows += 1) {
                const enemy = new Enemy(initialPosX, initialPosY, sprite);

                col.push(enemy);
                initialPosY += enemiesCoordinates.increment.y;
            }

            initialPosX += enemiesCoordinates.increment.x;
            initialPosY = enemiesCoordinates.initalPos.y;
            this.enemies!.push(col);
        }
    }

    private updateEnemy(enemy: Enemy, gameState: IGameStateInfo, ship: Ship) {
        enemy.update(gameState);

        if (enemy.isActive()) {
            const enemyCollisionInfo = enemy.getCollisionInfo();
            const shipCollisionInfo = ship.getBulletCollisionInfo();

            const hasReached = ship.isBulletActive() && hasRectCollision(enemyCollisionInfo, shipCollisionInfo);

            if (hasReached) {
                enemy.disable();
                ship.disableBullet();
            }
        }

        const hasBulletCollision = enemy.isBulletActive() && ship.isActive()
            && hasRectCollision(enemy.getBulletCollisionInfo(), ship.getCollisionInfo());

        if (hasBulletCollision) {
            enemy.disableBullet();
            ship.kill(gameState);
        }
    }

    private shot() {
        const nearEnimies = this.getNearEnemies();

        if (nearEnimies.length > 0) {
            const indexSelected = Math.round(Math.random() * (nearEnimies.length - 1));
            nearEnimies[indexSelected].shot(this.incrementVelocity);
        }
    }

    private getNearEnemies(): Enemy[] {
        const nearEnimies: Enemy[] = [];

        this.enemies.forEach((col) => {
            const activeEnemies = col
                .filter((enemy) => {
                    return enemy.isActive();
                });

            if (activeEnemies.length > 0) {
                nearEnimies.push(activeEnemies[activeEnemies.length - 1]);
            }
        });

        return nearEnimies;
    }
}

export default EnemyManager;
