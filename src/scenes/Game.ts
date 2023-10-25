import { createWorld, addEntity, addComponent, System, IWorld, pipe } from 'bitecs'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import {
	movementSystem,
} from '../systems/movementSystem'
import { ITime, timeSystem } from '../systems/timeSystem'
import Rotation from '../components/Rotation'
import MouseInput from '../components/MouseInput'
import { Sprite } from '../components/Sprite'
import createSpriteSystem from '../systems/spriteSystem'
import { spawnerSystem } from '../systems/spawnerSystem'
import Spawner from '../components/Spawner'

export interface Fruit {
	width: number,
	points: number
}

export const FruitTypes = ["cherry",  "strawberry", "grape", "dekopon", "orange", "apple", "pear", "peach", "pineapple", "melon", "watermelon"] as const;
// need to adjust, only spawn small at first, maybe based on score? weight towards small ones
export const SpawnableFruits = ["cherry", "strawberry", "grape", "dekopon", "orange"] as const;
export type SpawnableFruitType = typeof SpawnableFruits[number];
export type FruitType = typeof FruitTypes[number];
export const Fruits: Record<FruitType, Fruit> = {
	cherry: {
		points: 2,
		width: 32
	},
	strawberry: {
		points: 4,
		width: 47
	},
    grape: {
        points: 6,
        width: 64
    },
	dekopon: {
        points: 8,
        width: 71
    },
    orange: {
        points: 10,
        width: 92
    },
    apple: {
        points: 5,
        width: 109
    },
    pear: {
        points: 6,
        width: 118
    },

    peach: {
        points: 8,
        width: 22
    },
    pineapple: {
        points: 9,
        width: 25
    },
    melon: {
        points: 10,
        width: 30
    },
    watermelon: {
        points: 11,
        width: 35
    }
}

export class Game extends Phaser.Scene {
	private world?: IWorld & {
		time: ITime
	}

	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	pipeline!: (...input: any[]) => any

	constructor() {
		super('game')
	}

	preload() {
		for (let i = 0; i < FruitTypes.length; i++) {
			this.load.image(FruitTypes[i].toLowerCase(), `assets/${FruitTypes[i].toLowerCase()}.png`);
		}
	}

	init() {
		this.cursors = this.input.keyboard!.createCursorKeys()
	}

	create() {
		const { width, height } = this.scale
		console.log("creating game");

		this.world = createWorld()
		this.world.time = { delta: 0, elapsed: 0, then: performance.now() }

		// create player spawner
		const player = addEntity(this.world);
		console.log("PLAYER " + player);
		addComponent(this.world, MouseInput, player);
		addComponent(this.world, Spawner, player);
		addComponent(this.world, Position, player);
		Position.y[player] = 50;
		Position.x[player] = width/2;
		Position.ignoreGravity[player] = 0;


		// create test fruit
		// const test = addEntity(this.world);
		// addComponent(this.world, Sprite, test);
		// Sprite.texture[test] = FruitTypes.indexOf("apple");
		// Sprite.width[test] = 30;

		// addComponent(this.world, Position, test);
		// Position.x[test] = 100;
		// Position.y[test] = 100;
		// Position.ignoreGravity[test] = 0;

		// console.log("added entity: " + test);



		// add bottom bounding box
		// todo add sides

		this.matter.world.add(
			this.matter.bodies.rectangle(width / 2, height, width, 30, {
				ignoreGravity: true,
				isStatic: true
			})
		);

		// const spriteStaticGroup = this.matter.add.staticGroup()
		// this.physics.add.staticBody(0, height, width, 5);


		// this.physics.add.collider(spriteGroup, spriteStaticGroup)
		// this.physics.add.collider(spriteGroup, spriteGroup)

		const spriteSystem = createSpriteSystem(this, FruitTypes);

		this.pipeline = pipe(movementSystem, timeSystem, spriteSystem, spawnerSystem(this));
		// this.spriteSystem = createArcadeSpriteSystem(spriteGroup, TextureKeys)
		// this.spriteStaticSystem = createArcadeSpriteStaticSystem(
		// 	spriteStaticGroup,
		// 	TextureKeys
		// )

		// this.playerSystem = createPlayerSystem(this.cursors)
		// this.cpuSystem = createCPUSystem(this)
	}

	update() {
		if (!this.world) return

		this.pipeline(this.world);
	}
}