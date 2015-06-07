import _ from 'underscore';

import {Players, PlayerX, PlayerO} from '../constants/Players';
import {globals} from '../constants/globals';

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

var isNewKey = false;

var Model = (function () {
    return function (key: string) {
        this.key = key;
        this.wasGameOver = false;
        var storage;
        storage = LocalStorage.getItem(key);
        if (storage) {
			let model, playerX, playerO;
            model = JSON.parse(storage);
			playerX = new PlayerX(model.players.PLAYERX);
			playerO = new PlayerO(model.players.PLAYERO);
			this.players = new Players(playerX, playerO);
            this.wasGameOver = model.wasGameOver;
        }
		else {
			let playerX, playerO;
			playerX = new PlayerX();
			playerO = new PlayerO();
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
		let playerX = new PlayerX(playerXname);
		let playerO = new PlayerO(playerOname);
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
