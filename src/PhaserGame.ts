// src/PhaserGame.ts file

import Phaser from 'phaser'

import { Bootstrap } from './scenes/Bootstrap'
import { Game } from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'phaser-container',
	backgroundColor: '#FFFFAF',
	scale: {
		mode: Phaser.Scale.ScaleModes.NONE,
		width: 430,
		height: 754,
	},
	physics: {
		default: 'matter',
		matter: {
			enableSleeping: false,
			gravity: {
				y: 0.5
			},
			debug: {
				showBody: false,
				showStaticBody: true
			}
		}
	},
	scene: [Bootstrap, Game],
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new Phaser.Game(config)