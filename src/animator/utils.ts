import { Point, BoundingBox } from "./objects/index";

function randomBetween(lowerBound: number = 0, upperBound: number = 1): number {
    return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
}

function randomChoice(items: any[]): any {
    let lowerBound = 0;
    let upperBound = items.length;
    return items[randomBetween(lowerBound, upperBound)];
}

function randomPointBetween(bounds: BoundingBox, offset: number = 0): Point {
    let randX = randomBetween(bounds.xMin + offset, bounds.xMax - offset);
    let randY = randomBetween(bounds.yMin + offset, bounds.yMax - offset);
    return new Point(randX, randY);
}

export { randomBetween, randomChoice, randomPointBetween }
