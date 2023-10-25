import { IWorld, addComponent, addEntity, defineQuery, defineSystem } from "bitecs";
import { Scene } from "phaser";
import MouseInput from "../components/MouseInput";
import Spawner from "../components/Spawner";
import Position from "../components/Position";
import Sprite from "../components/Sprite";
import { Fruits, SpawnableFruits } from '../scenes/Game';

const mouseQuery = defineQuery([MouseInput, Spawner, Position])

const spawnFruit = (world: IWorld, fruitType: number, parentEntity: number) => {
    const fruitInfo = Fruits[SpawnableFruits[fruitType]];

    console.log("SPAWNING FROM " +parentEntity);

    const fruit = addEntity(world);
    addComponent(world, Sprite, fruit);
    Sprite.texture[fruit] = fruitType;
    Sprite.width[fruit] = fruitInfo.width;

    addComponent(world, Position, fruit);
    Position.x[fruit] = Position.x[parentEntity];
    Position.y[fruit] = Position.y[parentEntity];
    Position.ignoreGravity[fruit] = 1;

    return fruit;
}

export const spawnerSystem = (scene: Scene) => {

    // scene.input.mousePointer.position.x

    let lastMouseDown = false;

    return defineSystem((world: IWorld) => {
        const entities = mouseQuery(world);

        
        for (let i = 0; i < entities.length; i++) {
            const eid = entities[i];

            if (Spawner.spawned[eid] !== 0) {
                continue;
            }

            //const fruitType = Spawner.fruit[eid];

            const random = Math.floor(Math.random() * (SpawnableFruits.length - 1));                
            Spawner.spawned[eid] = spawnFruit(world, random, eid);
        }

        for (let i = 0; i < entities.length; i++) {
            const eid = entities[i];

            const leftDown = scene.input.activePointer.leftButtonDown();

            // console.log(leftDown);

            const spawned = Spawner.spawned[eid];
            const mouseX = scene.input.activePointer.worldX;    

            if (leftDown && spawned !== 0) {
                console.log("setting spawned position to: " + mouseX);
                Position.x[spawned] = mouseX;
                Position.x[eid] = mouseX;
            }

            if (lastMouseDown && !leftDown && spawned !== 0) {
                console.log(mouseX);
                Position.x[spawned] = mouseX;
                Position.ignoreGravity[spawned] = 0;
                // set timeout maybe
                //Spawner.spawned[eid] = 0;
            }

            lastMouseDown = leftDown;
        }
        



        return world;
    });
}