import { IWorld, System } from "bitecs";

export interface ITime { 
    elapsed: number
    delta: number
    then: number
}

export const timeSystem = (world: IWorld & { time: ITime }) => {
    const { time } = world
    const now = performance.now()
    const delta = now - time.then
    time.delta = delta
    time.elapsed += delta
    time.then = now
    return world
  }