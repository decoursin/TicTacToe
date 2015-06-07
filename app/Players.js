import _ from 'underscore';

import {globals} from './globals';

export class Players {
	PLAYERX: PlayerX;
	PLAYERO: PlayerO;
	constructor(playerX: PlayerX, playerO: PlayerO) {
		this.PLAYERX = playerX;
		this.PLAYERO = playerO;
	}
}

class Player {
	wins: number;
	cells: Array<number>;
	displayName: string;
	/* player is either 1) a string that is for displayname
	 * 2) or a full player with data. 1 or the other not null.
	 */
	constructor (player) {
		if (_.isString(player)) {
			this.wins = 0;
			this.cells = [];
			this.displayName = player;
			return this;
		}
		if (_.isObject(player)) {
			this.wins = player.wins;
			this.cells = player.cells;
			this.displayName = player.displayName;
			return this;
		}
		throw "Not valid input to Player::constructor"; 
	}
	isHis(location) {
		return _.contains(this.cells, location);
	}
}

export class PlayerX extends Player {
	keyName: string;
	constructor (player) {
		if (!player) {
			super(globals.playerXdefaultDisplayName);
		} else {
			super(player);
		}
		this.keyName = globals.playerX;
	}
}

export class PlayerO extends Player {
	keyName: string;
	constructor (player) {
		if (!player) {
			super(globals.playerOdefaultDisplayName);
		} else {
			super(player);
		}
		this.keyName = globals.playerO;
	}
}
