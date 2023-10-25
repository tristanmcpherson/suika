// scenes/Bootstrap.ts

import Phaser from 'phaser'

export class Bootstrap extends Phaser.Scene {
	constructor() {
		super('bootstrap')
	}

	init() {}

	preload() {
		// This Loads my assets created with texture packer
	}

	create() {
		this.createNewGame()
	}

	update() {}

	private createNewGame() {
		// this launches the game scene
		this.scene.launch('game')
	}
}