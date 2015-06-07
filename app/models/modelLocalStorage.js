import _ from 'underscore';

import {globals} from '../game/globals';

function randomString () {
	return Math.random().toString(36).substring(7);
}

// Tests localStorage with Modernizer
var LocalStorage = {
    getItem: function (key) {
        if(Modernizr.localstorage) {
            return localStorage.getItem(key);
        } else {
            console.log("Sorry, this browser does not support localStorage!");
        }
    },
    setItem: function (key, string) {
        if(Modernizr.localstorage) {
            return localStorage.setItem(key, string);
        } else {
            console.log("Sorry, this browser does not support localStorage!");
        }
    }
};

class Player {
	/* player either be a string that is for displayname
	 * or a full player with data meaning
	 */
	constructor(player) {
		if (_.isString(player)) {
			this.wins = 0;
			this.cells = [];
			this.displayName = player;
			this.keyName = ""; // is set by new Players
			return this;
		}
		if (_.isObject(player)) {
			this.wins = player.wins;
			this.cells = player.cells;
			this.displayName = player.displayName;
			this.keyName = player.keyName;
			return this;
		}
		throw "Not valid input to Player::constructor"; 
	}
	isHis(location) {
		return _.contains(this.cells, location);
	}
	setKeyName(keyName) {
		this.keyName = keyName;
	}
}

class Players {
	constructor(playerX, playerO) {
		playerX.setKeyName(globals.playerX);
		playerO.setKeyName(globals.playerO);
		this.PLAYERX = playerX;
		this.PLAYERO = playerO;
	}
}

var isNewKey = false;

var Model = (function () {
    return function (key) {
        this.key = key;
        this.wasGameOver = false;
        var storage;
        storage = LocalStorage.getItem(key);
        if (storage) {
			let model, playerX, playerO;
            model = JSON.parse(storage);
			playerX = new Player(model.players.PLAYERX);
			playerO = new Player(model.players.PLAYERO);
			this.players = new Players(playerX, playerO);
            this.wasGameOver = model.wasGameOver;
        }
		else {
			let playerX, playerO;
			playerX = new Player();
			playerO = new Player();
			this.players = new Players(playerX, playerO);
		}
        if(this.players && this.wasGameOver) {
            this.clearPlayerCells();
        }
        this.store();
    }
})();

Model.prototype = _.extend(Model.prototype, {
    isNewKey: function () {
        return isNewKey;
    },
    store: function () {
        if (this.players) {
            var data = {
                players: this.players,
                wasGameOver: this.wasGameOver
            };
            isNewKey = !LocalStorage.getItem(this.key);
            return LocalStorage.setItem(this.key, JSON.stringify(data));
        }
    },
    clearPlayerCells: function () {
		_.each(this.players, function (player) {
			player.cells = [];
		});
	},
	createNewPlayers: function (playerXname, playerOname) {
		let playerX = new Player(playerXname);
		let playerO = new Player(playerOname);
		this.players = new Players(playerX, playerO);
		this.wasGameOver = false;
		this.store();
	},
	makeNewGame: function () {
		this.clearPlayerCells();
		this.wasGameOver = false;
	}
});

var model = new Model('tic-tac-toe');

export { model };
