import _ from 'underscore';

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

var createPlayers = function (newPlayerX, newPlayerO) {
    var playerX = newPlayerX || 'Player X';
    var playerO = newPlayerO || 'Player O';
    return {
        'PLAYERX': {
            wins: 0,
            displayName: playerX,
            cells: [],
            keyName: 'playerX'
        },
        'PLAYERO': {
            wins: 0,
            displayName: playerO,
            cells: [],
            keyName: 'playerO'
        }
    }
};

var isNewKey = false;

var Model = (function () {
    return function (key) {
        this.key = key;
        this.wasGameOver = false;
        this.players = createPlayers();
        var storage,
            model;
        storage = LocalStorage.getItem(key);
        if(storage) {
            model = JSON.parse(storage);
            this.players = model.players;
            this.wasGameOver = model.wasGameOver;
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
	createNewPlayers: function (newPlayerX, newPlayerO) {
		this.players = createPlayers(newPlayerX, newPlayerO);
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
