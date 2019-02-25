import { ICollisionInfo } from '../interface/iCollisionInfo';

export function hasRectCollision(obj1: ICollisionInfo, obj2: ICollisionInfo): boolean {
    const maxX = obj1.x + obj1.width > obj2.x;
    const maxY = obj1.y + obj1.height > obj2.y;
    const minX = obj1.x < obj2.x + obj2.width;
    const minY = obj1.y < obj2.y + obj2.height;

    return maxX && maxY && minX && minY;
}
