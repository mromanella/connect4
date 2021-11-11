import { GameObject } from "./objects/index";


function withinHorizontal(obj1: GameObject, obj2: GameObject): boolean {
    const obj1Bounds = obj1.getBoundingBox();
    const obj2Bounds = obj2.getBoundingBox();

    if (obj1Bounds.xMin < obj2Bounds.xMax && obj1Bounds.xMax > obj2Bounds.xMin) {
        return true;
    }
    return false;
}

function withinVertical(obj1: GameObject, obj2: GameObject) {
    const obj1Bounds = obj1.getBoundingBox();
    const obj2Bounds = obj2.getBoundingBox();

    if (obj1Bounds.yMin < obj2Bounds.yMax && obj1Bounds.yMax > obj2Bounds.yMin) {
        return true;
    }
    return false;
}

function checkCollision(obj1: GameObject, obj2: GameObject): boolean {

    const horiz = withinHorizontal(obj1, obj2);
    const vert = withinVertical(obj1, obj2);

    return horiz && vert;
}

export {
    checkCollision, withinHorizontal, withinVertical
}
