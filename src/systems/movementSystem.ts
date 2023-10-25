import { IWorld, defineQuery } from "bitecs";
import { ITime } from "./timeSystem";
import Position from "../components/Position";
import { Velocity } from "../components/Velocity";

const movementQuery = defineQuery([Position, Velocity]);
export const movementSystem = (world: IWorld & { time: ITime }) => {
    const { time: { delta } } = world;
    const ents = movementQuery(world);
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i];
        Position.x[eid] += Velocity.x[eid] * delta;
        Position.y[eid] += Velocity.y[eid] * delta;
    }
    return world;
}
export default movementSystem;