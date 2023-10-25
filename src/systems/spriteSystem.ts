import { defineQuery, enterQuery, exitQuery, defineSystem } from "bitecs"
import Position from "../components/Position"
import Sprite from '../components/Sprite';

const spritesById = new Map<number, Phaser.Physics.Matter.Sprite>();

const spriteQuery = defineQuery([Position, Sprite]);

const spriteQueryEnter = enterQuery(spriteQuery);
const spriteQueryExit = exitQuery(spriteQuery);


export default function createSpriteSystem(scene: Phaser.Scene, textures: Record<number, string>) {
	return defineSystem((world) => {    
		const entitiesEntered = spriteQueryEnter(world);
		for (let i = 0; i < entitiesEntered.length; ++i)
		{
			const id = entitiesEntered[i];
			const texId = Sprite.texture[id];
            const width = Sprite.width[id];
			const texture = textures[texId];



            const sprite = scene.matter.add.sprite(Position.x[id], Position.y[id], texture, undefined, {isStatic: true});

            console.log("Static: " + (Position.ignoreGravity[id] === 1));

            const ignoreGravity = Position.ignoreGravity[id] === 1;

            console.log(sprite.isStatic());

			sprite.displayWidth = width;
            sprite.displayHeight = width;
            sprite.setCircle(width/2.0, {
                isStatic: true
            });

            sprite.setStatic(ignoreGravity);


			spritesById.set(id, sprite);
		}

		const entities = spriteQuery(world);
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i];

			const sprite = spritesById.get(id);
			if (!sprite)
			{
				// log an error
				continue;
			}


            const matterJsBody = (sprite.body as MatterJS.BodyType);
            if (matterJsBody.isStatic && sprite.x !== Position.x[id]) {
                console.log("Updating position to: " + Position.x[id]);
                sprite.x = Position.x[id]; 
            }

            if (matterJsBody.ignoreGravity && Position.ignoreGravity[id] === 0) {
                // no longer ignore gravity
                console.log("No longer static");
                sprite.setStatic(false);

            }



			// sprite.y = Position.y[id]
			// sprite.angle = Rotation.angle[id]
		}

		const entitiesExited = spriteQueryExit(world);
		for (let i = 0; i < entitiesExited.length; ++i)
		{
			const id = entitiesEntered[i];
			spritesById.delete(id);
		}

		return world;
	})
}